<script setup lang="ts">
import type { Phase } from "~/config/phases";

const props = defineProps<{
  phase: Phase;
  entityCount: number;
  isSelected?: boolean;
}>();

const emit = defineEmits<{
  select: [phaseNumber: number];
}>();

const isExpanded = ref(false);

function handleClick() {
  emit("select", props.phase.number);
}

function toggleExpand(e: Event) {
  e.stopPropagation();
  isExpanded.value = !isExpanded.value;
}
</script>

<template>
  <div
    :class="[
      'rounded-lg border-2 transition-all cursor-pointer',
      phase.bgColor,
      isSelected
        ? `${phase.borderColor} ring-2 ring-offset-2`
        : 'border-transparent hover:border-ga-gray-400',
    ]"
    @click="handleClick"
  >
    <!-- Collapsed View -->
    <div class="p-4">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <PhaseBadge :phase="phase" :show-tooltip="false" />
        </div>
        <button
          class="p-1 rounded hover:bg-black/10 transition-colors"
          @click="toggleExpand"
        >
          <UIcon
            :name="
              isExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'
            "
            class="w-4 h-4"
          />
        </button>
      </div>

      <h3 :class="['font-semibold', phase.color]">{{ phase.name }}</h3>
      <p class="text-xs text-ga-gray-600 mt-1">
        {{ phase.description }}
      </p>
      <div class="mt-2 text-xs text-ga-gray-500">{{ entityCount }} entities</div>
    </div>

    <!-- Expanded View -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[500px]"
      leave-from-class="opacity-100 max-h-[500px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isExpanded" class="px-4 pb-4 overflow-hidden">
        <div class="border-t border-ga-gray-300 pt-3 mt-1">
          <!-- Details -->
          <p
            v-if="phase.details"
            class="text-sm text-ga-gray-700 mb-3"
          >
            {{ phase.details }}
          </p>

          <!-- Goals -->
          <div v-if="phase.goals?.length" class="mb-3">
            <h4 class="text-xs font-semibold text-ga-gray-600 uppercase mb-1">
              Goals
            </h4>
            <ul class="text-xs text-ga-gray-700 space-y-0.5">
              <li v-for="goal in phase.goals" :key="goal" class="flex gap-1">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-3 h-3 mt-0.5 text-ga-green-600 shrink-0"
                />
                {{ goal }}
              </li>
            </ul>
          </div>

          <!-- Key Deliverables -->
          <div v-if="phase.keyDeliverables?.length" class="mb-3">
            <h4 class="text-xs font-semibold text-ga-gray-600 uppercase mb-1">
              Key Deliverables
            </h4>
            <ul class="text-xs text-ga-gray-700 space-y-0.5">
              <li
                v-for="deliverable in phase.keyDeliverables"
                :key="deliverable"
                class="flex gap-1"
              >
                <UIcon
                  name="i-heroicons-cube"
                  class="w-3 h-3 mt-0.5 text-ga-blue-500 shrink-0"
                />
                {{ deliverable }}
              </li>
            </ul>
          </div>

          <!-- Upcoming Changes (Phase 3) -->
          <div
            v-if="phase.upcomingChanges"
            class="p-2 rounded bg-purple-100 border border-purple-200"
          >
            <div class="flex items-start gap-2">
              <UIcon
                name="i-heroicons-information-circle"
                class="w-4 h-4 text-purple-600 shrink-0 mt-0.5"
              />
              <div>
                <h4
                  class="text-xs font-semibold text-purple-700 mb-1"
                >
                  Upcoming Changes
                </h4>
                <p class="text-xs text-purple-600">
                  {{ phase.upcomingChanges }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
