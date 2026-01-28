<script setup lang="ts">
const props = defineProps<{
  strategies: {
    id: string;
    name: string;
    description: string;
    pros: string[];
    cons: string[];
    recommended?: boolean;
  }[];
  selectedStrategy: string | null;
}>();

const emit = defineEmits<{
  select: [strategyId: string | null];
}>();

function handleSelect(strategyId: string) {
  if (props.selectedStrategy === strategyId) {
    emit("select", null);
  } else {
    emit("select", strategyId);
  }
}

function clearSelection() {
  emit("select", null);
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Click a strategy to see how it affects patterns and decisions below
      </p>
      <UButton
        v-if="selectedStrategy"
        variant="ghost"
        size="xs"
        icon="i-heroicons-x-mark"
        @click="clearSelection"
      >
        Clear Selection
      </UButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <button
        v-for="strategy in strategies"
        :key="strategy.id"
        :class="[
          'text-left p-4 rounded-lg border-2 transition-all',
          selectedStrategy === strategy.id
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 ring-2 ring-primary-500 ring-offset-2'
            : selectedStrategy
              ? 'border-gray-200 dark:border-gray-700 opacity-50'
              : strategy.recommended
                ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 hover:border-primary-400'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
        ]"
        @click="handleSelect(strategy.id)"
      >
        <div class="flex items-center gap-2 mb-2">
          <h4 class="font-semibold text-sm">{{ strategy.name }}</h4>
          <UBadge v-if="strategy.recommended" color="primary" size="xs">
            Recommended
          </UBadge>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {{ strategy.description }}
        </p>

        <div class="space-y-2">
          <div>
            <p
              class="text-xs font-medium text-green-600 dark:text-green-400 mb-1"
            >
              Pros
            </p>
            <ul class="text-xs text-gray-500 space-y-0.5">
              <li v-for="pro in strategy.pros" :key="pro">+ {{ pro }}</li>
            </ul>
          </div>
          <div>
            <p class="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
              Cons
            </p>
            <ul class="text-xs text-gray-500 space-y-0.5">
              <li v-for="con in strategy.cons" :key="con">- {{ con }}</li>
            </ul>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>
