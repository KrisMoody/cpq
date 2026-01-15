<script setup lang="ts">
import type { AffinityType } from '~/generated/prisma/client'

const { affinities, loading, error, fetchAffinities, deleteAffinity } = useAffinities()

const filterType = ref<'ALL' | AffinityType>('ALL')

onMounted(() => {
  fetchAffinities({ includeInactive: true })
})

const filteredAffinities = computed(() => {
  if (filterType.value === 'ALL') return affinities.value
  return affinities.value.filter((a) => a.type === filterType.value)
})

const filterOptions = [
  { label: 'All', value: 'ALL' },
  { label: 'Cross-sell', value: 'CROSS_SELL' },
  { label: 'Upsell', value: 'UPSELL' },
  { label: 'Accessory', value: 'ACCESSORY' },
  { label: 'Required', value: 'REQUIRED' },
  { label: 'Subscription Add-on', value: 'SUBSCRIPTION_ADDON' },
]

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to delete this affinity rule?')) return
  await deleteAffinity(id)
}

function getAffinityTypeLabel(type: AffinityType) {
  const labels: Record<AffinityType, string> = {
    CROSS_SELL: 'Cross-sell',
    UPSELL: 'Upsell',
    ACCESSORY: 'Accessory',
    REQUIRED: 'Required',
    FREQUENTLY_BOUGHT: 'Popular',
    SUBSCRIPTION_ADDON: 'Add-on',
  }
  return labels[type] || type
}

function getAffinityTypeColor(type: AffinityType): 'error' | 'success' | 'info' | 'warning' | 'primary' | 'neutral' {
  const colors: Record<AffinityType, 'error' | 'success' | 'info' | 'warning' | 'primary' | 'neutral'> = {
    REQUIRED: 'error',
    UPSELL: 'success',
    CROSS_SELL: 'info',
    ACCESSORY: 'warning',
    SUBSCRIPTION_ADDON: 'primary',
    FREQUENTLY_BOUGHT: 'neutral',
  }
  return colors[type] || 'neutral'
}

function getSourceLabel(affinity: (typeof affinities.value)[0]) {
  if (affinity.sourceProduct) return affinity.sourceProduct.name
  if (affinity.sourceCategory) return `[Category] ${affinity.sourceCategory.name}`
  return 'Unknown'
}

function getTargetLabel(affinity: (typeof affinities.value)[0]) {
  if (affinity.targetProduct) return affinity.targetProduct.name
  if (affinity.targetCategory) return `[Category] ${affinity.targetCategory.name}`
  return 'Unknown'
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Product Affinities</h1>
        <p class="text-gray-500">Configure product recommendations and cross-sell rules</p>
      </div>
      <UButton to="/affinities/new" icon="i-heroicons-plus">
        New Affinity
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4 flex-wrap">
      <div class="inline-flex rounded-md shadow-sm flex-wrap">
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

      <span class="text-sm text-gray-500">
        {{ filteredAffinities.length }} rule{{ filteredAffinities.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error State -->
    <UAlert v-else-if="error" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error loading affinities</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Empty State -->
    <div v-else-if="filteredAffinities.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-light-bulb" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500 mb-4">No affinity rules found</p>
      <UButton to="/affinities/new" variant="soft">Create your first affinity</UButton>
    </div>

    <!-- Affinities List -->
    <div v-else class="space-y-3">
      <UCard
        v-for="affinity in filteredAffinities"
        :key="affinity.id"
        class="hover:ring-1 hover:ring-primary-500 transition-all"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 flex-wrap">
              <div class="min-w-0">
                <div class="font-medium truncate">{{ getSourceLabel(affinity) }}</div>
                <div v-if="affinity.sourceBillingFrequency" class="text-xs text-gray-500">
                  {{ affinity.sourceBillingFrequency }}
                </div>
              </div>
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div class="min-w-0">
                <div class="font-medium truncate">{{ getTargetLabel(affinity) }}</div>
                <div v-if="affinity.targetBillingFrequency" class="text-xs text-gray-500">
                  {{ affinity.targetBillingFrequency }}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <UBadge :color="getAffinityTypeColor(affinity.type)" variant="subtle">
                {{ getAffinityTypeLabel(affinity.type) }}
              </UBadge>
              <span class="text-xs text-gray-500">Priority: {{ affinity.priority }}</span>
              <UBadge :color="affinity.isActive ? 'success' : 'neutral'" variant="subtle">
                {{ affinity.isActive ? 'Active' : 'Inactive' }}
              </UBadge>
            </div>
          </div>
          <div class="flex items-center gap-1 flex-shrink-0">
            <UButton
              :to="`/affinities/${affinity.id}`"
              variant="ghost"
              size="sm"
              icon="i-heroicons-pencil"
            />
            <UButton
              variant="ghost"
              color="error"
              size="sm"
              icon="i-heroicons-trash"
              @click="handleDelete(affinity.id)"
            />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
