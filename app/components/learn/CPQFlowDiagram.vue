<script setup lang="ts">
interface Step {
  icon: string
  title: string
  description: string
  phase?: 'setup' | 'build' | 'submit' | 'complete'
}

interface BranchStep {
  icon: string
  title: string
  description: string
  variant: 'success' | 'warning' | 'error'
}

const mainSteps: Step[] = [
  {
    icon: 'i-heroicons-document-plus',
    title: 'Create Quote',
    description: 'Select customer and price book',
    phase: 'setup',
  },
  {
    icon: 'i-heroicons-squares-plus',
    title: 'Add Products',
    description: 'Browse and add to quote',
    phase: 'build',
  },
  {
    icon: 'i-heroicons-adjustments-horizontal',
    title: 'Configure',
    description: 'Set bundle options',
    phase: 'build',
  },
  {
    icon: 'i-heroicons-calculator',
    title: 'Apply Pricing',
    description: 'Discounts and rules',
    phase: 'build',
  },
  {
    icon: 'i-heroicons-paper-airplane',
    title: 'Submit',
    description: 'Rules evaluation',
    phase: 'submit',
  },
]

const approvalBranch: BranchStep[] = [
  {
    icon: 'i-heroicons-clock',
    title: 'Pending',
    description: 'Awaiting approval',
    variant: 'warning',
  },
  {
    icon: 'i-heroicons-check-circle',
    title: 'Approved',
    description: 'Ready to accept',
    variant: 'success',
  },
]

const completionSteps: BranchStep[] = [
  {
    icon: 'i-heroicons-hand-thumb-up',
    title: 'Accept',
    description: 'Customer accepts',
    variant: 'success',
  },
  {
    icon: 'i-heroicons-flag',
    title: 'Finalized',
    description: 'Quote complete',
    variant: 'success',
  },
]

const rejectedStep: BranchStep = {
  icon: 'i-heroicons-x-circle',
  title: 'Rejected',
  description: 'Approval denied',
  variant: 'error',
}

const variantClasses = {
  success: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    icon: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  warning: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    icon: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
  },
  error: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    icon: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
}
</script>

<template>
  <div class="py-8">
    <h3 class="text-lg font-semibold text-center mb-2">CPQ Workflow</h3>
    <p class="text-sm text-gray-500 text-center mb-8">
      Complete flow from quote creation to finalization
    </p>

    <!-- Main Flow -->
    <div class="flex items-center justify-between max-w-5xl mx-auto mb-8">
      <template v-for="(step, index) in mainSteps" :key="step.title">
        <div class="flex flex-col items-center text-center flex-1">
          <div
            class="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-2"
          >
            <UIcon :name="step.icon" class="w-7 h-7 text-primary-600" />
          </div>
          <h4 class="font-medium text-sm">{{ step.title }}</h4>
          <p class="text-xs text-gray-500 mt-0.5">{{ step.description }}</p>
        </div>
        <div v-if="index < mainSteps.length - 1" class="flex-shrink-0 px-1">
          <UIcon
            name="i-heroicons-arrow-right"
            class="w-5 h-5 text-gray-300 dark:text-gray-600"
          />
        </div>
      </template>
    </div>

    <!-- Branching Section -->
    <div class="max-w-5xl mx-auto">
      <div class="flex justify-center mb-4">
        <UIcon
          name="i-heroicons-arrows-pointing-out"
          class="w-5 h-5 text-gray-400"
        />
      </div>

      <div class="grid grid-cols-2 gap-8">
        <!-- Auto-Approve Path -->
        <div class="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50/50 dark:bg-green-950/20">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-heroicons-bolt" class="w-4 h-4 text-green-600" />
            <span class="text-xs font-medium text-green-700 dark:text-green-400">
              Auto-Approve (no rules triggered)
            </span>
          </div>
          <div class="flex items-center justify-around">
            <template v-for="(step, index) in completionSteps" :key="step.title">
              <div class="flex flex-col items-center text-center">
                <div
                  :class="[
                    'w-12 h-12 rounded-full flex items-center justify-center mb-2',
                    variantClasses[step.variant].bg,
                  ]"
                >
                  <UIcon
                    :name="step.icon"
                    :class="['w-6 h-6', variantClasses[step.variant].icon]"
                  />
                </div>
                <h4 class="font-medium text-xs">{{ step.title }}</h4>
                <p class="text-xs text-gray-500">{{ step.description }}</p>
              </div>
              <div v-if="index < completionSteps.length - 1" class="px-2">
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="w-4 h-4 text-green-400"
                />
              </div>
            </template>
          </div>
        </div>

        <!-- Approval Required Path -->
        <div class="border border-amber-200 dark:border-amber-800 rounded-lg p-4 bg-amber-50/50 dark:bg-amber-950/20">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-amber-600" />
            <span class="text-xs font-medium text-amber-700 dark:text-amber-400">
              Approval Required (rules triggered)
            </span>
          </div>
          <div class="flex items-center justify-around">
            <template v-for="(step, index) in approvalBranch" :key="step.title">
              <div class="flex flex-col items-center text-center">
                <div
                  :class="[
                    'w-12 h-12 rounded-full flex items-center justify-center mb-2',
                    variantClasses[step.variant].bg,
                  ]"
                >
                  <UIcon
                    :name="step.icon"
                    :class="['w-6 h-6', variantClasses[step.variant].icon]"
                  />
                </div>
                <h4 class="font-medium text-xs">{{ step.title }}</h4>
                <p class="text-xs text-gray-500">{{ step.description }}</p>
              </div>
              <div v-if="index < approvalBranch.length - 1" class="px-2">
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="w-4 h-4 text-amber-400"
                />
              </div>
            </template>
            <div class="px-2">
              <UIcon
                name="i-heroicons-arrow-right"
                class="w-4 h-4 text-green-400"
              />
            </div>
            <div class="flex flex-col items-center text-center">
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center mb-2',
                  variantClasses.success.bg,
                ]"
              >
                <UIcon
                  name="i-heroicons-flag"
                  :class="['w-6 h-6', variantClasses.success.icon]"
                />
              </div>
              <h4 class="font-medium text-xs">Finalized</h4>
              <p class="text-xs text-gray-500">Complete</p>
            </div>
          </div>
          <!-- Rejected indicator -->
          <div class="mt-4 pt-3 border-t border-amber-200 dark:border-amber-700">
            <div class="flex items-center justify-center gap-2">
              <UIcon name="i-heroicons-arrow-turn-down-right" class="w-4 h-4 text-red-400" />
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  variantClasses.error.bg,
                ]"
              >
                <UIcon
                  :name="rejectedStep.icon"
                  :class="['w-4 h-4', variantClasses.error.icon]"
                />
              </div>
              <span class="text-xs text-red-600 dark:text-red-400">
                {{ rejectedStep.title }} (if denied)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
