<script setup lang="ts">
import type { RuleType } from '~/generated/prisma/client'

const { rules, loading, error, fetchRules, deleteRule } = useRules()

const filterType = ref<'ALL' | RuleType>('ALL')

onMounted(() => {
  fetchRules()
})

const filteredRules = computed(() => {
  if (filterType.value === 'ALL') return rules.value
  return rules.value.filter((r) => r.type === filterType.value)
})

const filterOptions = [
  { label: 'All Rules', value: 'ALL' },
  { label: 'Configuration', value: 'CONFIGURATION' },
  { label: 'Pricing', value: 'PRICING' },
]

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to delete this rule?')) return
  await deleteRule(id)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Rules</h1>
        <p class="text-ga-gray-600">Configure business rules for pricing and configuration</p>
      </div>
      <UButton to="/rules/new" icon="i-heroicons-plus">
        New Rule
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4">
      <div class="inline-flex rounded-md shadow-sm">
        <UButton
          v-for="(option, index) in filterOptions"
          :key="option.value"
          :variant="filterType === option.value ? 'solid' : 'ghost'"
          size="sm"
          :class="[
            index === 0 ? 'rounded-r-none' : '',
            index === filterOptions.length - 1 ? 'rounded-l-none' : '',
            index !== 0 && index !== filterOptions.length - 1 ? 'rounded-none' : ''
          ]"
          @click="filterType = option.value as typeof filterType"
        >
          {{ option.label }}
        </UButton>
      </div>

      <span class="text-sm text-ga-gray-600">
        {{ filteredRules.length }} rule{{ filteredRules.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error State -->
    <UAlert v-else-if="error" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error loading rules</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Empty State -->
    <div v-else-if="filteredRules.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-cog-6-tooth" class="w-12 h-12 text-ga-gray-400 mx-auto mb-4" />
      <p class="text-ga-gray-600 mb-4">No rules found</p>
      <UButton to="/rules/new" variant="soft">Create your first rule</UButton>
    </div>

    <!-- Rules Table -->
    <TablesRulesTable v-else :rules="filteredRules" @delete="handleDelete" />
  </div>
</template>
