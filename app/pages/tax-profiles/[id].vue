<script setup lang="ts">
const router = useRouter()
const {
  fetchTaxProfile,
  updateTaxProfile,
  deleteTaxProfile,
  assignRateToProfile,
  removeRateFromProfile,
  error,
} = useTaxProfiles()
const { taxRates, fetchTaxRates, formatRate } = useTaxRates()

const taxProfileId = useRequiredParam('id')
const taxProfile = ref<Awaited<ReturnType<typeof fetchTaxProfile>> | null>(null)
const loading = ref(true)
const saving = ref(false)
const isEditing = ref(false)
const showAddRateModal = ref(false)
const selectedRateId = ref<string | undefined>(undefined)
const addingRate = ref(false)

const form = ref({
  name: '',
  description: '',
  country: '',
  isActive: true,
})

onMounted(async () => {
  await Promise.all([loadTaxProfile(), fetchTaxRates(true)])
})

async function loadTaxProfile() {
  loading.value = true
  try {
    taxProfile.value = await fetchTaxProfile(taxProfileId)
    if (taxProfile.value) {
      form.value = {
        name: taxProfile.value.name,
        description: taxProfile.value.description ?? '',
        country: taxProfile.value.country,
        isActive: taxProfile.value.isActive,
      }
    }
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!form.value.name.trim() || !form.value.country.trim()) {
    return
  }

  saving.value = true

  const updated = await updateTaxProfile(taxProfileId, {
    name: form.value.name.trim(),
    description: form.value.description.trim() || null,
    country: form.value.country.trim(),
    isActive: form.value.isActive,
  })

  saving.value = false

  if (updated) {
    await loadTaxProfile()
    isEditing.value = false
  }
}

async function handleDelete() {
  if (!confirm('Are you sure you want to deactivate this tax profile?')) return

  const success = await deleteTaxProfile(taxProfileId)
  if (success) {
    router.push('/tax-profiles')
  }
}

function cancelEdit() {
  isEditing.value = false
  if (taxProfile.value) {
    form.value = {
      name: taxProfile.value.name,
      description: taxProfile.value.description ?? '',
      country: taxProfile.value.country,
      isActive: taxProfile.value.isActive,
    }
  }
}

async function handleAddRate() {
  if (!selectedRateId.value) return

  addingRate.value = true
  const updated = await assignRateToProfile(taxProfileId, selectedRateId.value)
  addingRate.value = false

  if (updated) {
    taxProfile.value = updated
    showAddRateModal.value = false
    selectedRateId.value = undefined
  }
}

async function handleRemoveRate(rateId: string) {
  if (!confirm('Remove this tax rate from the profile?')) return

  const updated = await removeRateFromProfile(taxProfileId, rateId)
  if (updated) {
    taxProfile.value = updated
  }
}

const availableRates = computed(() => {
  const assignedIds = new Set(taxProfile.value?.rates?.map((r) => r.id) ?? [])
  return taxRates.value
    .filter((r) => r.isActive && !assignedIds.has(r.id))
    .map((r) => ({
      label: `${r.name} (${formatRate(r.rate)}) - ${r.state ? `${r.state}, ${r.country}` : r.country}`,
      value: r.id,
    }))
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Not Found -->
    <UAlert v-else-if="!taxProfile" color="warning" icon="i-heroicons-exclamation-triangle">
      <template #title>Tax profile not found</template>
    </UAlert>

    <template v-else>
      <!-- Profile Details Card -->
      <UCard class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold">{{ taxProfile.name }}</h1>
              <p class="text-ga-gray-600 text-sm">{{ taxProfile.country }}</p>
            </div>
            <div class="flex items-center gap-2">
              <UBadge v-if="!taxProfile.isActive" color="warning" variant="subtle">Inactive</UBadge>
              <UButton
                v-if="!isEditing"
                variant="soft"
                icon="i-heroicons-pencil"
                @click="isEditing = true"
              >
                Edit
              </UButton>
              <UButton
                v-if="taxProfile.isActive"
                variant="ghost"
                color="error"
                icon="i-heroicons-trash"
                @click="handleDelete"
              />
            </div>
          </div>
        </template>

        <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
          <template #description>{{ error }}</template>
        </UAlert>

        <form v-if="isEditing" class="space-y-4" @submit.prevent="handleSave">
          <UFormField label="Name" required>
            <UInput v-model="form.name" class="w-64" />
          </UFormField>

          <UFormField label="Description">
            <UTextarea v-model="form.description" />
          </UFormField>

          <UFormField label="Country" required>
            <UInput v-model="form.country" class="w-64" />
          </UFormField>

          <UCheckbox v-model="form.isActive" label="Active" />

          <div class="flex justify-end gap-3 pt-4">
            <UButton variant="ghost" @click="cancelEdit">Cancel</UButton>
            <UButton type="submit" :loading="saving">Save Changes</UButton>
          </div>
        </form>

        <dl v-else class="space-y-4">
          <div v-if="taxProfile.description" class="flex justify-between">
            <dt class="text-ga-gray-600">Description</dt>
            <dd>{{ taxProfile.description }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-ga-gray-600">Country</dt>
            <dd>{{ taxProfile.country }}</dd>
          </div>
        </dl>
      </UCard>

      <!-- Assigned Rates Card -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">Assigned Tax Rates ({{ taxProfile.rates?.length ?? 0 }})</span>
            <UButton
              size="sm"
              icon="i-heroicons-plus"
              :disabled="availableRates.length === 0"
              @click="showAddRateModal = true"
            >
              Add Rate
            </UButton>
          </div>
        </template>

        <div v-if="!taxProfile.rates?.length" class="text-center py-8 text-ga-gray-600">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 mx-auto mb-2 text-amber-500" />
          <p>No tax rates assigned to this profile.</p>
          <p class="text-sm mt-1">Add rates to enable tax calculations.</p>
        </div>

        <div v-else class="divide-y divide-ga-gray-200">
          <div
            v-for="rate in taxProfile.rates"
            :key="rate.id"
            class="flex items-center justify-between py-3"
          >
            <div>
              <NuxtLink :to="`/tax-rates/${rate.id}`" class="font-medium text-ga-navy-600 hover:underline">
                {{ rate.name }}
              </NuxtLink>
              <p class="text-sm text-ga-gray-600">
                {{ rate.state ? `${rate.state}, ${rate.country}` : rate.country }}
                <span v-if="rate.category"> &middot; {{ rate.category.name }}</span>
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-mono text-sm font-medium">{{ formatRate(rate.rate) }}</span>
              <UButton
                variant="ghost"
                size="xs"
                color="error"
                icon="i-heroicons-x-mark"
                @click="handleRemoveRate(rate.id)"
              />
            </div>
          </div>
        </div>
      </UCard>
    </template>

    <!-- Add Rate Modal -->
    <UModal v-model:open="showAddRateModal" title="Add Tax Rate to Profile">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold">Add Tax Rate to Profile</h3>
          </template>

          <div class="space-y-4">
            <UFormField label="Tax Rate">
              <USelect
                v-model="selectedRateId"
                :items="availableRates"
                value-key="value"
                placeholder="Select a tax rate"
              />
            </UFormField>

            <p v-if="availableRates.length === 0" class="text-sm text-ga-gray-600">
              All available tax rates have been assigned to this profile.
            </p>

            <div class="flex justify-end gap-3 pt-4">
              <UButton variant="ghost" @click="showAddRateModal = false">Cancel</UButton>
              <UButton
                :disabled="!selectedRateId"
                :loading="addingRate"
                @click="handleAddRate"
              >
                Add Rate
              </UButton>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
