<script setup lang="ts">
import { getPhase, type Phase } from "~/config/phases";

const props = withDefaults(
  defineProps<{
    phase: number | Phase;
    size?: "sm" | "md";
    showTooltip?: boolean;
  }>(),
  {
    size: "md",
    showTooltip: true,
  },
);

const phaseData = computed(() => {
  if (typeof props.phase === "number") {
    return getPhase(props.phase);
  }
  return props.phase;
});

const sizeClasses = computed(() => {
  return props.size === "sm" ? "text-xs px-1.5 py-0.5" : "text-sm px-2 py-1";
});

const tooltipText = computed(() => {
  if (!phaseData.value) return "";
  return `Phase ${phaseData.value.number}: ${phaseData.value.name} - ${phaseData.value.description}`;
});
</script>

<template>
  <UTooltip v-if="phaseData && showTooltip" :text="tooltipText">
    <span
      :class="[
        'inline-flex items-center font-medium rounded-md border',
        sizeClasses,
        phaseData.color,
        phaseData.bgColor,
        phaseData.borderColor,
      ]"
    >
      P{{ phaseData.number }}
    </span>
  </UTooltip>
  <span
    v-else-if="phaseData"
    :class="[
      'inline-flex items-center font-medium rounded-md border',
      sizeClasses,
      phaseData.color,
      phaseData.bgColor,
      phaseData.borderColor,
    ]"
  >
    P{{ phaseData.number }}
  </span>
</template>
