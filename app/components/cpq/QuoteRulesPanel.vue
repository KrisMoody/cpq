<script setup lang="ts">
interface RuleAction {
  type: string
  message?: string
}

interface RuleEvaluationResult {
  ruleId: string
  ruleName: string
  ruleType: string
  triggered: boolean
  actions: RuleAction[]
}

interface EvaluationSummary {
  rules: RuleEvaluationResult[]
  warnings: string[]
  errors: string[]
  requiresApproval: boolean
  approvalReasons: string[]
}

const props = defineProps<{
  evaluation?: EvaluationSummary | null
}>()

const isExpanded = ref(false)

// Auto-expand when there are warnings or errors
watch(
  () => props.evaluation,
  (evaluation) => {
    if (evaluation) {
      if (evaluation.warnings.length > 0 || evaluation.errors.length > 0 || evaluation.requiresApproval) {
        isExpanded.value = true
      }
    }
  },
  { immediate: true }
)

const triggeredRules = computed(() => {
  return props.evaluation?.rules.filter((r) => r.triggered) || []
})

const hasIssues = computed(() => {
  if (!props.evaluation) return false
  return (
    props.evaluation.warnings.length > 0 ||
    props.evaluation.errors.length > 0 ||
    props.evaluation.requiresApproval
  )
})
</script>

<template>
  <UCard v-if="evaluation">
    <template #header>
      <button
        class="w-full flex items-center justify-between"
        @click="isExpanded = !isExpanded"
      >
        <div class="flex items-center gap-2">
          <UIcon
            name="i-heroicons-cog-6-tooth"
            class="w-5 h-5"
            :class="hasIssues ? 'text-amber-500' : 'text-gray-400'"
          />
          <h3 class="font-semibold">Rules Evaluation</h3>
          <UBadge
            v-if="triggeredRules.length > 0"
            :color="hasIssues ? 'warning' : 'neutral'"
            variant="subtle"
            size="xs"
          >
            {{ triggeredRules.length }} triggered
          </UBadge>
        </div>
        <UIcon
          :name="isExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          class="w-5 h-5 text-gray-400"
        />
      </button>
    </template>

    <div v-if="isExpanded" class="space-y-4">
      <!-- Approval Required -->
      <div v-if="evaluation.requiresApproval" class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <div class="flex items-start gap-2">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-amber-800 dark:text-amber-200">Approval Required</p>
            <ul class="mt-1 text-sm text-amber-700 dark:text-amber-300 list-disc list-inside">
              <li v-for="reason in evaluation.approvalReasons" :key="reason">
                {{ reason }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Errors -->
      <div v-if="evaluation.errors.length > 0" class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div class="flex items-start gap-2">
          <UIcon name="i-heroicons-x-circle" class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-red-800 dark:text-red-200">Errors</p>
            <ul class="mt-1 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
              <li v-for="errorMsg in evaluation.errors" :key="errorMsg">
                {{ errorMsg }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Warnings -->
      <div v-if="evaluation.warnings.length > 0" class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <div class="flex items-start gap-2">
          <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-yellow-800 dark:text-yellow-200">Warnings</p>
            <ul class="mt-1 text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside">
              <li v-for="warning in evaluation.warnings" :key="warning">
                {{ warning }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Triggered Rules Details -->
      <div v-if="triggeredRules.length > 0">
        <p class="text-sm font-medium text-gray-500 mb-2">Triggered Rules</p>
        <div class="space-y-2">
          <div
            v-for="rule in triggeredRules"
            :key="rule.ruleId"
            class="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
              <span class="text-sm">{{ rule.ruleName }}</span>
            </div>
            <UBadge variant="subtle" size="xs">
              {{ rule.ruleType }}
            </UBadge>
          </div>
        </div>
      </div>

      <!-- No rules triggered -->
      <div v-if="triggeredRules.length === 0 && !hasIssues" class="text-center py-2 text-gray-500 text-sm">
        No rules triggered
      </div>
    </div>
  </UCard>
</template>
