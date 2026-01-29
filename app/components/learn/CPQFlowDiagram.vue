<script setup lang="ts">
interface Helper {
  icon: string
  label: string
  tooltip: string
}

interface Step {
  icon: string
  title: string
  description: string
  phase?: 'setup' | 'build' | 'submit' | 'complete'
  helpers?: Helper[]
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
    helpers: [
      {
        icon: 'i-heroicons-document-check',
        label: 'Contract',
        tooltip: 'Contract pricing applies automatically for customers with active contracts',
      },
    ],
  },
  {
    icon: 'i-heroicons-squares-plus',
    title: 'Add Products',
    description: 'Browse and add to quote',
    phase: 'build',
    helpers: [
      {
        icon: 'i-heroicons-sparkles',
        label: 'Guided',
        tooltip: 'Use questionnaires and product affinities for smart recommendations',
      },
    ],
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
    helpers: [
      {
        icon: 'i-heroicons-currency-dollar',
        label: 'Currency',
        tooltip: 'Multi-currency support with automatic conversion to base currency',
      },
    ],
  },
  {
    icon: 'i-heroicons-paper-airplane',
    title: 'Submit',
    description: 'Rules evaluation',
    phase: 'submit',
    helpers: [
      {
        icon: 'i-heroicons-eye',
        label: 'Preview',
        tooltip: 'Preview quote as a professional document before sending',
      },
    ],
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
    bg: 'bg-green-100',
    icon: 'text-green-600',
    border: 'border-green-200',
  },
  warning: {
    bg: 'bg-amber-100',
    icon: 'text-amber-600',
    border: 'border-amber-200',
  },
  error: {
    bg: 'bg-red-100',
    icon: 'text-red-600',
    border: 'border-red-200',
  },
}
</script>

<template>
  <div class="py-4 md:py-8">
    <h3 class="text-lg font-semibold text-center mb-2">CPQ Workflow</h3>
    <p class="text-sm text-ga-gray-600 text-center mb-6 md:mb-8">
      Complete flow from quote creation to finalization
    </p>

    <!-- Main Flow - Desktop: Horizontal, Mobile: Vertical -->
    <!-- Desktop Layout -->
    <div class="hidden md:flex items-center justify-between max-w-5xl mx-auto mb-8">
      <template v-for="(step, index) in mainSteps" :key="step.title">
        <div class="flex flex-col items-center text-center flex-1">
          <div
            class="w-14 h-14 rounded-full bg-ga-navy-100 flex items-center justify-center mb-2"
          >
            <UIcon :name="step.icon" class="w-7 h-7 text-ga-navy-600" />
          </div>
          <h4 class="font-medium text-sm">{{ step.title }}</h4>
          <p class="text-xs text-ga-gray-600 mt-0.5">{{ step.description }}</p>
          <!-- Helper badges -->
          <div v-if="step.helpers?.length" class="flex gap-1 mt-2">
            <UTooltip
              v-for="helper in step.helpers"
              :key="helper.label"
              :text="helper.tooltip"
            >
              <div
                class="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-ga-gray-200 text-ga-gray-600 text-[10px] cursor-help hover:bg-ga-gray-300 transition-colors"
              >
                <UIcon :name="helper.icon" class="w-3 h-3" />
                <span>{{ helper.label }}</span>
              </div>
            </UTooltip>
          </div>
        </div>
        <div v-if="index < mainSteps.length - 1" class="flex-shrink-0 px-1">
          <UIcon
            name="i-heroicons-arrow-right"
            class="w-5 h-5 text-ga-gray-400"
          />
        </div>
      </template>
    </div>

    <!-- Mobile Layout - Vertical Timeline -->
    <div class="md:hidden relative mb-6">
      <!-- Vertical line -->
      <div class="absolute left-6 top-6 bottom-6 w-0.5 bg-ga-gray-300" />

      <div class="space-y-4">
        <div
          v-for="(step, index) in mainSteps"
          :key="step.title"
          class="relative flex items-start gap-4 pl-2"
        >
          <!-- Step circle -->
          <div
            class="relative z-10 w-10 h-10 rounded-full bg-ga-navy-100 flex items-center justify-center flex-shrink-0"
          >
            <UIcon :name="step.icon" class="w-5 h-5 text-ga-navy-600" />
          </div>
          <!-- Step content -->
          <div class="flex-1 pb-2">
            <h4 class="font-medium text-sm">{{ step.title }}</h4>
            <p class="text-xs text-ga-gray-600 mt-0.5">{{ step.description }}</p>
            <!-- Helper badges -->
            <div v-if="step.helpers?.length" class="flex flex-wrap gap-1 mt-2">
              <UTooltip
                v-for="helper in step.helpers"
                :key="helper.label"
                :text="helper.tooltip"
              >
                <div
                  class="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-ga-gray-200 text-ga-gray-600 text-[10px] cursor-help"
                >
                  <UIcon :name="helper.icon" class="w-3 h-3" />
                  <span>{{ helper.label }}</span>
                </div>
              </UTooltip>
            </div>
          </div>
          <!-- Arrow indicator (except last) -->
          <UIcon
            v-if="index < mainSteps.length - 1"
            name="i-heroicons-arrow-down"
            class="absolute left-[18px] -bottom-1 w-4 h-4 text-ga-gray-400"
          />
        </div>
      </div>
    </div>

    <!-- Branching Section -->
    <div class="max-w-5xl mx-auto">
      <div class="flex justify-center mb-4">
        <UIcon
          name="i-heroicons-arrows-pointing-out"
          class="w-5 h-5 text-ga-gray-500"
        />
      </div>

      <!-- Desktop: 2-column grid, Mobile: Stacked -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <!-- Auto-Approve Path -->
        <div class="border border-green-200 rounded-lg p-3 md:p-4 bg-green-50/50">
          <div class="flex items-center gap-2 mb-3 md:mb-4">
            <UIcon name="i-heroicons-bolt" class="w-4 h-4 text-green-600" />
            <span class="text-xs font-medium text-green-700">
              Auto-Approve (no rules triggered)
            </span>
          </div>
          <div class="flex items-center justify-around">
            <template v-for="(step, index) in completionSteps" :key="step.title">
              <div class="flex flex-col items-center text-center">
                <div
                  :class="[
                    'w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1 md:mb-2',
                    variantClasses[step.variant].bg,
                  ]"
                >
                  <UIcon
                    :name="step.icon"
                    :class="['w-5 h-5 md:w-6 md:h-6', variantClasses[step.variant].icon]"
                  />
                </div>
                <h4 class="font-medium text-xs">{{ step.title }}</h4>
                <p class="text-xs text-ga-gray-600 hidden sm:block">{{ step.description }}</p>
              </div>
              <div v-if="index < completionSteps.length - 1" class="px-1 md:px-2">
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="w-4 h-4 text-green-400"
                />
              </div>
            </template>
          </div>
        </div>

        <!-- Approval Required Path -->
        <div class="border border-amber-200 rounded-lg p-3 md:p-4 bg-amber-50/50">
          <div class="flex items-center gap-2 mb-3 md:mb-4">
            <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-amber-600" />
            <span class="text-xs font-medium text-amber-700">
              Approval Required (rules triggered)
            </span>
          </div>
          <!-- Desktop: Horizontal flow -->
          <div class="hidden sm:flex items-center justify-around">
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
                <p class="text-xs text-ga-gray-600">{{ step.description }}</p>
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
              <p class="text-xs text-ga-gray-600">Complete</p>
            </div>
          </div>
          <!-- Mobile: Compact horizontal with smaller icons -->
          <div class="sm:hidden flex items-center justify-between px-2">
            <template v-for="step in approvalBranch" :key="step.title">
              <div class="flex flex-col items-center text-center">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center mb-1',
                    variantClasses[step.variant].bg,
                  ]"
                >
                  <UIcon
                    :name="step.icon"
                    :class="['w-5 h-5', variantClasses[step.variant].icon]"
                  />
                </div>
                <h4 class="font-medium text-[10px]">{{ step.title }}</h4>
              </div>
              <UIcon
                name="i-heroicons-arrow-right"
                class="w-3 h-3 text-amber-400 flex-shrink-0"
              />
            </template>
            <div class="flex flex-col items-center text-center">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center mb-1',
                  variantClasses.success.bg,
                ]"
              >
                <UIcon
                  name="i-heroicons-flag"
                  :class="['w-5 h-5', variantClasses.success.icon]"
                />
              </div>
              <h4 class="font-medium text-[10px]">Finalized</h4>
            </div>
          </div>
          <!-- Rejected indicator -->
          <div class="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-amber-200">
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
              <span class="text-xs text-red-600">
                {{ rejectedStep.title }} (if denied)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
