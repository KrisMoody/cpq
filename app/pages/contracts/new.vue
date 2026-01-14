<script setup lang="ts">
import { getErrorMessage } from '~/utils/errors'
import type { ContractStatus } from '~/composables/useContracts'

const router = useRouter()
const { createContract } = useContracts()
const { customers, fetchCustomers } = useCustomers()

const initialFormState = {
  name: '',
  customerId: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  status: 'DRAFT' as ContractStatus,
  discountPercent: null as number | null,
}

const form = ref({ ...initialFormState })
const initialValues = ref({ ...initialFormState })

const { confirmLeave } = useUnsavedChanges(form, initialValues)

const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  await fetchCustomers()
  // Set default end date to 1 year from now
  const endDate = new Date()
  endDate.setFullYear(endDate.getFullYear() + 1)
  form.value.endDate = endDate.toISOString().split('T')[0] ?? ''
  initialValues.value.endDate = form.value.endDate
})

function handleCancel() {
  if (confirmLeave()) {
    router.push('/contracts')
  }
}

const statusOptions = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Active', value: 'ACTIVE' },
]

const customerOptions = computed(() =>
  customers.value.map((c) => ({
    label: c.company ? `${c.name} (${c.company})` : c.name,
    value: c.id,
  }))
)

async function handleSubmit() {
  if (!form.value.name.trim()) {
    error.value = 'Contract name is required'
    return
  }

  if (!form.value.customerId) {
    error.value = 'Customer is required'
    return
  }

  if (!form.value.startDate || !form.value.endDate) {
    error.value = 'Start date and end date are required'
    return
  }

  if (new Date(form.value.startDate) >= new Date(form.value.endDate)) {
    error.value = 'End date must be after start date'
    return
  }

  loading.value = true
  error.value = null

  try {
    const contract = await createContract({
      name: form.value.name.trim(),
      customerId: form.value.customerId,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      status: form.value.status,
      discountPercent: form.value.discountPercent,
    })

    if (contract) {
      router.push(`/contracts/${contract.id}`)
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to create contract')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UButton
      to="/contracts"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Contracts
    </UButton>

    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Create New Contract</h1>
      </template>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
          <template #description>{{ error }}</template>
        </UAlert>

        <!-- Basic Info -->
        <div class="space-y-4">
          <UFormField label="Contract Name" required>
            <UInput
              v-model="form.name"
              placeholder="e.g., Acme Corp 2024 Agreement"
            />
          </UFormField>

          <UFormField label="Customer" required>
            <USelect
              v-model="form.customerId"
              placeholder="Select a customer"
              :items="customerOptions"
              value-key="value"
            />
          </UFormField>
        </div>

        <!-- Validity Period -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Validity Period</h3>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Start Date" required>
              <UInput v-model="form.startDate" type="date" />
            </UFormField>

            <UFormField label="End Date" required>
              <UInput v-model="form.endDate" type="date" />
            </UFormField>
          </div>
        </div>

        <!-- Pricing -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Default Discount</h3>

          <UFormField label="Discount Percentage" hint="Applied to all products unless overridden">
            <UInput
              v-model.number="form.discountPercent"
              type="number"
              :min="0"
              :max="100"
              step="0.01"
              placeholder="No default discount"
            />
          </UFormField>
        </div>

        <!-- Status -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Status</h3>

          <UFormField label="Contract Status">
            <USelect v-model="form.status" :items="statusOptions" value-key="value" />
          </UFormField>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <UButton variant="ghost" :disabled="loading" @click="handleCancel">
            Cancel
          </UButton>
          <UButton type="submit" :loading="loading" icon="i-heroicons-plus">
            Create Contract
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
