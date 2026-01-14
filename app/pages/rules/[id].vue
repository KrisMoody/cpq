<script setup lang="ts">
import type { RuleType, RuleTrigger } from '~/generated/prisma'

const route = useRoute()
const router = useRouter()
const { fetchRule, updateRule, deleteRule } = useRules()

const ruleId = route.params.id as string
const rule = ref<Awaited<ReturnType<typeof fetchRule>> | null>(null)
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)

const form = ref({
  name: '',
  description: '',
  type: 'PRICING' as RuleType,
  trigger: 'ON_QUOTE_SAVE' as RuleTrigger,
  priority: 100,
  isActive: true,
  condition: {} as Record<string, any>,
  action: {} as Record<string, any>,
})

const typeOptions = [
  { label: 'Configuration', value: 'CONFIGURATION' },
  { label: 'Pricing', value: 'PRICING' },
]

const triggerOptions = [
  { label: 'On Product Add', value: 'ON_PRODUCT_ADD' },
  { label: 'On Quantity Change', value: 'ON_QUANTITY_CHANGE' },
  { label: 'On Quote Save', value: 'ON_QUOTE_SAVE' },
  { label: 'On Finalize', value: 'ON_FINALIZE' },
]

onMounted(async () => {
  await loadRule()
})

async function loadRule() {
  loading.value = true
  error.value = null
  try {
    rule.value = await fetchRule(ruleId)
    if (rule.value) {
      form.value = {
        name: rule.value.name,
        description: rule.value.description || '',
        type: rule.value.type,
        trigger: rule.value.trigger,
        priority: rule.value.priority,
        isActive: rule.value.isActive,
        condition: rule.value.condition,
        action: rule.value.action,
      }
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load rule'
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!form.value.name.trim()) {
    error.value = 'Rule name is required'
    return
  }

  saving.value = true
  error.value = null

  try {
    const updated = await updateRule(ruleId, {
      name: form.value.name.trim(),
      description: form.value.description.trim() || null,
      type: form.value.type,
      trigger: form.value.trigger,
      priority: form.value.priority,
      isActive: form.value.isActive,
      condition: form.value.condition,
      action: form.value.action,
    })

    if (updated) {
      await loadRule()
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to update rule'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!confirm('Are you sure you want to delete this rule?')) return

  try {
    await deleteRule(ruleId)
    router.push('/rules')
  } catch (e: any) {
    error.value = e.message || 'Failed to delete rule'
  }
}

function cancelEdit() {
  if (rule.value) {
    form.value = {
      name: rule.value.name,
      description: rule.value.description || '',
      type: rule.value.type,
      trigger: rule.value.trigger,
      priority: rule.value.priority,
      isActive: rule.value.isActive,
      condition: rule.value.condition,
      action: rule.value.action,
    }
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UButton
      to="/rules"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Rules
    </UButton>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error -->
    <UAlert v-else-if="error && !rule" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Not Found -->
    <UAlert v-else-if="!rule" color="warning" icon="i-heroicons-exclamation-triangle">
      <template #title>Rule not found</template>
    </UAlert>

    <!-- Rule Editor -->
    <UCard v-else>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">Edit Rule</h1>
          <UButton
            variant="ghost"
            color="error"
            icon="i-heroicons-trash"
            size="sm"
            @click="handleDelete"
          >
            Delete
          </UButton>
        </div>
      </template>

      <form class="space-y-6" @submit.prevent="handleSave">
        <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
          <template #description>{{ error }}</template>
        </UAlert>

        <!-- Basic Info -->
        <div class="space-y-4">
          <UFormField label="Rule Name" required>
            <UInput v-model="form.name" />
          </UFormField>

          <UFormField label="Description">
            <UTextarea v-model="form.description" :rows="2" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Type">
              <USelect v-model="form.type" :items="typeOptions" />
            </UFormField>

            <UFormField label="Trigger">
              <USelect v-model="form.trigger" :items="triggerOptions" />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Priority">
              <UInput v-model.number="form.priority" type="number" />
            </UFormField>

            <UFormField label="Status">
              <UCheckbox v-model="form.isActive" label="Active" />
            </UFormField>
          </div>
        </div>

        <!-- JSON Editors -->
        <div class="space-y-4">
          <UFormField label="Condition (JSON)">
            <UTextarea
              :model-value="JSON.stringify(form.condition, null, 2)"
              :rows="4"
              font-mono
              @update:model-value="(v) => { try { form.condition = JSON.parse(v) } catch {} }"
            />
          </UFormField>

          <UFormField label="Action (JSON)">
            <UTextarea
              :model-value="JSON.stringify(form.action, null, 2)"
              :rows="4"
              font-mono
              @update:model-value="(v) => { try { form.action = JSON.parse(v) } catch {} }"
            />
          </UFormField>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <UButton variant="ghost" :disabled="saving" @click="cancelEdit">
            Cancel
          </UButton>
          <UButton type="submit" :loading="saving">
            Save Changes
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
