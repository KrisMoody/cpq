<script setup lang="ts">
import { getErrorMessage } from '~/utils/errors'
const router = useRouter()
const { createCustomer } = useCustomers()
const { priceBooks, fetchPriceBooks } = usePricing()
const { currencies, fetchCurrencies } = useCurrencies()

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  priceBookId: undefined as string | undefined,
  currencyId: undefined as string | undefined,
}

const form = ref({ ...initialFormState })
const initialValues = ref({ ...initialFormState })

const { confirmLeave } = useUnsavedChanges(form, initialValues)

const loading = ref(false)
const error = ref<string | null>(null)

onMounted(() => {
  fetchPriceBooks()
  fetchCurrencies()
})

function handleCancel() {
  if (confirmLeave()) {
    router.push('/customers')
  }
}

async function handleSubmit() {
  if (!form.value.name.trim()) {
    error.value = 'Customer name is required'
    return
  }

  loading.value = true
  error.value = null

  try {
    const customer = await createCustomer({
      name: form.value.name.trim(),
      email: form.value.email.trim() || undefined,
      phone: form.value.phone.trim() || undefined,
      company: form.value.company.trim() || undefined,
      street: form.value.street.trim() || undefined,
      city: form.value.city.trim() || undefined,
      state: form.value.state.trim() || undefined,
      postalCode: form.value.postalCode.trim() || undefined,
      country: form.value.country.trim() || undefined,
      priceBookId: form.value.priceBookId || undefined,
      currencyId: form.value.currencyId || undefined,
    })

    if (customer) {
      router.push(`/customers/${customer.id}`)
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to create customer')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Create New Customer</h1>
      </template>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
          <template #description>{{ error }}</template>
        </UAlert>

        <!-- Basic Info -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Basic Information</h3>

          <UFormField label="Name" required>
            <UInput
              v-model="form.name"
              placeholder="Enter customer name"
              icon="i-heroicons-user"
            />
          </UFormField>

          <UFormField label="Company">
            <UInput
              v-model="form.company"
              placeholder="Company name (optional)"
              icon="i-heroicons-building-office"
            />
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Email">
              <UInput
                v-model="form.email"
                type="email"
                placeholder="email@example.com"
                icon="i-heroicons-envelope"
              />
            </UFormField>

            <UFormField label="Phone">
              <UInput
                v-model="form.phone"
                placeholder="+1 (555) 000-0000"
                icon="i-heroicons-phone"
              />
            </UFormField>
          </div>
        </div>

        <!-- Address -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Address</h3>

          <UFormField label="Street">
            <UInput
              v-model="form.street"
              placeholder="Street address"
            />
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="City">
              <UInput v-model="form.city" placeholder="City" />
            </UFormField>

            <UFormField label="State/Province">
              <UInput v-model="form.state" placeholder="State" />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Postal Code">
              <UInput v-model="form.postalCode" placeholder="Postal code" />
            </UFormField>

            <UFormField label="Country">
              <UInput v-model="form.country" placeholder="Country" />
            </UFormField>
          </div>
        </div>

        <!-- Pricing -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Pricing</h3>

          <UFormField label="Currency" hint="Default currency for quotes">
            <USelect
              v-model="form.currencyId"
              :items="currencies.filter(c => c.isActive).map(c => ({ label: `${c.code} - ${c.name}`, value: c.id }))"
              value-key="value"
              placeholder="Select currency (optional)"
            />
          </UFormField>

          <UFormField label="Price Book" hint="Quotes for this customer will use this price book by default">
            <USelect
              v-model="form.priceBookId"
              :items="priceBooks.map(pb => ({ label: pb.name, value: pb.id }))"
              value-key="value"
              placeholder="Select price book (optional)"
            />
          </UFormField>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <UButton
            variant="ghost"
            :disabled="loading"
            @click="handleCancel"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            :loading="loading"
            icon="i-heroicons-plus"
          >
            Create Customer
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
