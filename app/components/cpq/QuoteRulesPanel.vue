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
            :class="hasIssues ? 'text-ga-yellow-500' : 'text-ga-gray-500'"
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
          class="w-5 h-5 text-ga-gray-500"
        />
      </button>
    </template>

    <div v-if="isExpanded" class="space-y-4">
      <!-- Approval Required -->
      <div v-if="evaluation.requiresApproval" class="p-3 bg-ga-yellow-50 rounded-lg">
        <div class="flex items-start gap-2">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-ga-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-ga-yellow-700">Approval Required</p>
            <ul class="mt-1 text-sm text-ga-yellow-600 list-disc list-inside">
              <li v-for="reason in evaluation.approvalReasons" :key="reason">
                {{ reason }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Errors -->
      <div v-if="evaluation.errors.length > 0" class="p-3 bg-ga-red-50 rounded-lg">
        <div class="flex items-start gap-2">
          <UIcon name="i-heroicons-x-circle" class="w-5 h-5 text-ga-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-ga-red-700">Errors</p>
            <ul class="mt-1 text-sm text-ga-red-600 list-disc list-inside">
              <li v-for="errorMsg in evaluation.errors" :key="errorMsg">
                {{ errorMsg }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Warnings -->
      <div v-if="evaluation.warnings.length > 0" class="p-3 bg-ga-yellow-50 rounded-lg">
        <div class="flex items-start gap-2">
          <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5 text-ga-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-ga-yellow-700">Warnings</p>
            <ul class="mt-1 text-sm text-ga-yellow-600 list-disc list-inside">
              <li v-for="warning in evaluation.warnings" :key="warning">
                {{ warning }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Triggered Rules Details -->
      <div v-if="triggeredRules.length > 0">
        <p class="text-sm font-medium text-ga-gray-600 mb-2">Triggered Rules</p>
        <div class="space-y-2">
          <div
            v-for="rule in triggeredRules"
            :key="rule.ruleId"
            class="p-2 bg-ga-gray-100 rounded-lg flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-ga-green-500" />
              <span class="text-sm">{{ rule.ruleName }}</span>
            </div>
            <UBadge variant="subtle" size="xs">
              {{ rule.ruleType }}
            </UBadge>
          </div>
        </div>
      </div>

      <!-- No rules triggered -->
      <div v-if="triggeredRules.length === 0 && !hasIssues" class="text-center py-2 text-ga-gray-600 text-sm">
        No rules triggered
      </div>
    </div>
  </UCard>
</template>
