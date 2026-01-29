<script setup lang="ts">
import { phases } from '~/config/phases'

const { currentPhase, currentPhaseDetails, setPhase } = usePhaseContext()

// Emit for mobile sidebar to close after selection
const emit = defineEmits<{
  change: [phase: number]
}>()

function handleSelect(phaseNumber: number) {
  setPhase(phaseNumber)
  emit('change', phaseNumber)
}

// Build items for dropdown menu
const items = computed(() =>
  phases.map((phase) => ({
    label: `Phase ${phase.number}: ${phase.name}`,
    description: phase.description,
    phaseNumber: phase.number,
    slot: `phase-${phase.number}` as const,
    onSelect: () => handleSelect(phase.number)
  }))
)

// Phase color mapping for the trigger button border/accent
const phaseColors: Record<number, string> = {
  1: 'border-emerald-400',
  2: 'border-blue-400',
  3: 'border-purple-400',
  4: 'border-orange-400',
  5: 'border-pink-400'
}

const phaseBgColors: Record<number, string> = {
  1: 'bg-emerald-50',
  2: 'bg-blue-50',
  3: 'bg-purple-50',
  4: 'bg-orange-50',
  5: 'bg-pink-50'
}

const phaseTextColors: Record<number, string> = {
  1: 'text-emerald-700',
  2: 'text-blue-700',
  3: 'text-purple-700',
  4: 'text-orange-700',
  5: 'text-pink-700'
}

const phaseDotColors: Record<number, string> = {
  1: 'bg-emerald-500',
  2: 'bg-blue-500',
  3: 'bg-purple-500',
  4: 'bg-orange-500',
  5: 'bg-pink-500'
}
</script>

<template>
  <UDropdownMenu :items="items" :ui="{ content: 'w-72' }">
    <UButton
      variant="outline"
      class="w-full justify-between"
      :class="[phaseColors[currentPhase], phaseBgColors[currentPhase]]"
    >
      <span class="flex items-center gap-2 min-w-0">
        <span
          class="w-2 h-2 rounded-full flex-shrink-0"
          :class="phaseDotColors[currentPhase]"
        />
        <span class="truncate">
          <span :class="phaseTextColors[currentPhase]" class="font-medium">
            Phase {{ currentPhase }}
          </span>
          <span class="text-ga-gray-600 ml-1 text-xs">
            {{ currentPhaseDetails?.name }}
          </span>
        </span>
      </span>
      <UIcon name="i-heroicons-chevron-up-down" class="w-4 h-4 text-ga-gray-600" />
    </UButton>

    <template #item="{ item }">
      <div class="flex items-start gap-3 w-full py-1">
        <span
          class="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1"
          :class="phaseDotColors[item.phaseNumber]"
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span
              class="font-medium text-sm"
              :class="phaseTextColors[item.phaseNumber]"
            >
              Phase {{ item.phaseNumber }}
            </span>
            <span class="text-ga-gray-950 text-sm">
              {{ phases.find(p => p.number === item.phaseNumber)?.name }}
            </span>
            <UIcon
              v-if="currentPhase === item.phaseNumber"
              name="i-heroicons-check"
              class="w-4 h-4 ml-auto flex-shrink-0"
              :class="phaseTextColors[item.phaseNumber]"
            />
          </div>
          <p class="text-xs text-ga-gray-600 mt-0.5 line-clamp-2">
            {{ item.description }}
          </p>
        </div>
      </div>
    </template>
  </UDropdownMenu>
</template>
