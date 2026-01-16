<script setup lang="ts">
import { getErrorMessage } from '~/utils/errors'
import type { CategoryWithProducts, CategoryAttribute } from '~/composables/useCategories'

const _route = useRoute()
const router = useRouter()
const toast = useToast()
const {
  fetchCategory,
  updateCategory,
  deleteCategory,
  fetchCategories,
  categories,
  flattenCategories,
  removeProductFromCategory,
  fetchCategoryAttributes,
  addAttributeToCategory,
  removeAttributeFromCategory,
} = useCategories()
const { products: allProducts, fetchProducts } = useProducts()
const { attributes: allAttributes, fetchAttributes } = useAttributes()

const categoryId = useRequiredParam('id')
const category = ref<CategoryWithProducts | null>(null)
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const isEditing = ref(false)

const form = ref({
  name: '',
  description: '',
  parentId: undefined as string | undefined,
  sortOrder: 0,
  isActive: true,
})

const categoryAttributes = ref<CategoryAttribute[]>([])

onMounted(async () => {
  await Promise.all([loadCategory(), fetchCategories({ flat: true }), fetchProducts(), fetchAttributes({ includeGroup: true })])
  await loadCategoryAttributes()
})

async function loadCategoryAttributes() {
  categoryAttributes.value = await fetchCategoryAttributes(categoryId)
}

async function loadCategory() {
  loading.value = true
  error.value = null
  try {
    category.value = await fetchCategory(categoryId)
    if (category.value) {
      form.value = {
        name: category.value.name,
        description: category.value.description || '',
        parentId: category.value.parentId || undefined,
        sortOrder: category.value.sortOrder,
        isActive: category.value.isActive,
      }
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to load category')
  } finally {
    loading.value = false
  }
}

const parentOptions = computed(() => {
  const flat = flattenCategories(categories.value).filter((c) => c.id !== categoryId)
  return flat.map((c) => ({
    label: '\u00A0'.repeat(c.depth * 4) + c.name,
    value: c.id,
  }))
})

const availableProducts = computed(() => {
  if (!category.value) return []
  const assignedIds = new Set(category.value.products.map((p) => p.id))
  return allProducts.value.filter((p) => !assignedIds.has(p.id) && p.isActive)
})

async function handleSave() {
  if (!form.value.name.trim()) {
    error.value = 'Category name is required'
    return
  }

  saving.value = true
  error.value = null

  try {
    await updateCategory(categoryId, {
      name: form.value.name.trim(),
      description: form.value.description.trim() || null,
      parentId: form.value.parentId || null,
      sortOrder: form.value.sortOrder,
      isActive: form.value.isActive,
    })
    await loadCategory()
    isEditing.value = false
    toast.add({ title: 'Category updated', color: 'success' })
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to update category')
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!category.value) return
  if (confirm(`Deactivate category "${category.value.name}"?`)) {
    const success = await deleteCategory(categoryId)
    if (success) {
      toast.add({ title: 'Category deactivated', color: 'success' })
      router.push('/categories')
    } else {
      toast.add({ title: 'Failed to deactivate category', color: 'error' })
    }
  }
}

async function handleRemoveProduct(productId: string) {
  const success = await removeProductFromCategory(categoryId, productId)
  if (success) {
    await loadCategory()
    toast.add({ title: 'Product removed from category', color: 'success' })
  } else {
    toast.add({ title: 'Failed to remove product', color: 'error' })
  }
}

// Add product modal
const showAddProductModal = ref(false)
const selectedProductId = ref('')
const { addProductToCategory } = useCategories()

async function handleAddProduct() {
  if (!selectedProductId.value) return
  const success = await addProductToCategory(categoryId, selectedProductId.value)
  if (success) {
    await loadCategory()
    showAddProductModal.value = false
    selectedProductId.value = ''
    toast.add({ title: 'Product added to category', color: 'success' })
  } else {
    toast.add({ title: 'Failed to add product', color: 'error' })
  }
}

// Add attribute modal
const showAddAttributeModal = ref(false)
const selectedAttributeId = ref('')

const availableAttributes = computed(() => {
  const assignedIds = new Set(categoryAttributes.value.map((ca) => ca.attributeId))
  return allAttributes.value.filter((a) => !assignedIds.has(a.id))
})

async function handleAddAttribute() {
  if (!selectedAttributeId.value) return
  const success = await addAttributeToCategory(categoryId, selectedAttributeId.value)
  if (success) {
    await loadCategoryAttributes()
    showAddAttributeModal.value = false
    selectedAttributeId.value = ''
    toast.add({ title: 'Attribute added to category', color: 'success' })
  } else {
    toast.add({ title: 'Failed to add attribute', color: 'error' })
  }
}

async function handleRemoveAttribute(attributeId: string) {
  const success = await removeAttributeFromCategory(categoryId, attributeId)
  if (success) {
    await loadCategoryAttributes()
    toast.add({ title: 'Attribute removed from category', color: 'success' })
  } else {
    toast.add({ title: 'Failed to remove attribute', color: 'error' })
  }
}

function getAttributeTypeLabel(type: string): string {
  const types: Record<string, string> = {
    TEXT: 'Text',
    NUMBER: 'Number',
    BOOLEAN: 'Boolean',
    SELECT: 'Select',
    MULTISELECT: 'Multi-select',
    DATE: 'Date',
  }
  return types[type] || type
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <UButton
      to="/categories"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Categories
    </UButton>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Not Found -->
    <UAlert v-else-if="!category" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Category not found</template>
    </UAlert>

    <!-- Category Detail -->
    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold">{{ category.name }}</h1>
            <UBadge v-if="!category.isActive" color="neutral">Inactive</UBadge>
          </div>
          <p v-if="category.parent" class="text-gray-500 mt-1">
            Parent: {{ category.parent.name }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            v-if="!isEditing"
            icon="i-heroicons-pencil"
            variant="soft"
            @click="isEditing = true"
          >
            Edit
          </UButton>
          <UButton
            v-if="category.isActive"
            icon="i-heroicons-trash"
            variant="soft"
            color="error"
            @click="handleDelete"
          >
            Deactivate
          </UButton>
        </div>
      </div>

      <!-- Edit Form -->
      <UCard v-if="isEditing">
        <template #header>
          <h2 class="font-semibold">Edit Category</h2>
        </template>

        <form class="space-y-4" @submit.prevent="handleSave">
          <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
            <template #description>{{ error }}</template>
          </UAlert>

          <UFormField label="Name" required>
            <UInput v-model="form.name" placeholder="Category name" />
          </UFormField>

          <UFormField label="Description">
            <UTextarea v-model="form.description" placeholder="Optional description" :rows="3" />
          </UFormField>

          <UFormField label="Parent Category">
            <USelect v-model="form.parentId" :items="parentOptions" value-key="value" placeholder="None (root category)" />
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Sort Order">
              <UInput v-model.number="form.sortOrder" type="number" />
            </UFormField>

            <UFormField label="Status">
              <UCheckbox v-model="form.isActive" label="Active" />
            </UFormField>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <UButton variant="ghost" @click="isEditing = false">Cancel</UButton>
            <UButton type="submit" :loading="saving">Save Changes</UButton>
          </div>
        </form>
      </UCard>

      <!-- Description -->
      <UCard v-if="category.description && !isEditing">
        <p class="text-gray-600">{{ category.description }}</p>
      </UCard>

      <!-- Subcategories -->
      <UCard v-if="category.children.length > 0">
        <template #header>
          <h2 class="font-semibold">Subcategories ({{ category.children.length }})</h2>
        </template>

        <div class="divide-y">
          <NuxtLink
            v-for="child in category.children"
            :key="child.id"
            :to="`/categories/${child.id}`"
            class="flex items-center gap-3 py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
          >
            <UIcon name="i-heroicons-folder" class="w-5 h-5 text-gray-400" />
            <span class="font-medium">{{ child.name }}</span>
          </NuxtLink>
        </div>
      </UCard>

      <!-- Products -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Products ({{ category.products.length }})</h2>
            <UButton
              size="sm"
              icon="i-heroicons-plus"
              @click="showAddProductModal = true"
            >
              Add Product
            </UButton>
          </div>
        </template>

        <div v-if="category.products.length === 0" class="text-center py-8 text-gray-500">
          No products in this category
        </div>

        <div v-else class="divide-y">
          <div
            v-for="product in category.products"
            :key="product.id"
            class="flex items-center justify-between py-3 px-2"
          >
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-cube" class="w-5 h-5 text-gray-400" />
              <div>
                <NuxtLink :to="`/products/${product.id}`" class="font-medium hover:text-primary-500">
                  {{ product.name }}
                </NuxtLink>
                <p class="text-sm text-gray-500">{{ product.sku }}</p>
              </div>
              <UBadge v-if="!product.isActive" color="neutral" size="xs">Inactive</UBadge>
              <UBadge v-if="product.type === 'BUNDLE'" color="info" size="xs">Bundle</UBadge>
            </div>
            <UButton
              icon="i-heroicons-x-mark"
              size="xs"
              variant="ghost"
              color="error"
              @click="handleRemoveProduct(product.id)"
            />
          </div>
        </div>
      </UCard>

      <!-- Attributes -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Attributes ({{ categoryAttributes.length }})</h2>
            <UButton
              size="sm"
              icon="i-heroicons-plus"
              @click="showAddAttributeModal = true"
            >
              Add Attribute
            </UButton>
          </div>
        </template>

        <div v-if="categoryAttributes.length === 0" class="text-center py-8 text-gray-500">
          No attributes assigned to this category
        </div>

        <div v-else class="divide-y">
          <div
            v-for="catAttr in categoryAttributes"
            :key="catAttr.id"
            class="flex items-center justify-between py-3 px-2"
          >
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-tag" class="w-5 h-5 text-gray-400" />
              <div>
                <NuxtLink :to="`/attributes/${catAttr.attribute.id}`" class="font-medium hover:text-primary-500">
                  {{ catAttr.attribute.name }}
                </NuxtLink>
                <p class="text-sm text-gray-500">{{ catAttr.attribute.code }}</p>
              </div>
              <UBadge color="info" size="xs">{{ getAttributeTypeLabel(catAttr.attribute.type) }}</UBadge>
              <UBadge v-if="catAttr.attribute.isRequired" color="warning" size="xs">Required</UBadge>
            </div>
            <UButton
              icon="i-heroicons-x-mark"
              size="xs"
              variant="ghost"
              color="error"
              @click="handleRemoveAttribute(catAttr.attributeId)"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Add Product Modal -->
    <UModal v-model:open="showAddProductModal" title="Add Product to Category">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold">Add Product to Category</h3>
          </template>

          <div class="space-y-4">
            <UFormField label="Product">
              <USelect
                v-model="selectedProductId"
                :items="availableProducts.map(p => ({ label: `${p.name} (${p.sku})`, value: p.id }))"
                placeholder="Select a product"
                value-key="value"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" @click="showAddProductModal = false">Cancel</UButton>
              <UButton :disabled="!selectedProductId" @click="handleAddProduct">Add Product</UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Add Attribute Modal -->
    <UModal v-model:open="showAddAttributeModal" title="Add Attribute to Category">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold">Add Attribute to Category</h3>
          </template>

          <div class="space-y-4">
            <UFormField label="Attribute">
              <USelect
                v-model="selectedAttributeId"
                :items="availableAttributes.map(a => ({ label: `${a.name} (${a.code})`, value: a.id }))"
                placeholder="Select an attribute"
                value-key="value"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" @click="showAddAttributeModal = false">Cancel</UButton>
              <UButton :disabled="!selectedAttributeId" @click="handleAddAttribute">Add Attribute</UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
