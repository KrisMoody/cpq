<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { Phase } from "~/config/phases";

const props = defineProps<{
  phases: Phase[];
  entityCounts: number[];
}>();

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: "donut",
    background: "transparent",
  },
  labels: props.phases.map((p) => `P${p.number}: ${p.name}`),
  colors: ["#10b981", "#3b82f6", "#a855f7", "#f97316", "#ec4899"],
  legend: {
    position: "bottom",
    labels: {
      colors: "#4b5563",
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (_val: number, opts: { seriesIndex: number }) => {
      return (props.entityCounts[opts.seriesIndex] ?? 0).toString();
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: "55%",
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: "14px",
            color: "#374151",
          },
          value: {
            show: true,
            fontSize: "20px",
            fontWeight: "bold",
            color: "#374151",
          },
          total: {
            show: true,
            label: "Total Entities",
            color: "#6b7280",
            formatter: () => {
              return props.entityCounts.reduce((a, b) => a + b, 0).toString();
            },
          },
        },
      },
    },
  },
  stroke: {
    width: 2,
    colors: ["#ffffff"],
  },
  tooltip: {
    enabled: true,
    theme: "light",
    y: {
      formatter: (val: number) => `${val} entities`,
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 300,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
}));

const series = computed(() => props.entityCounts);
</script>

<template>
  <ClientOnly>
    <VueApexCharts
      type="donut"
      height="350"
      :options="chartOptions"
      :series="series"
    />
    <template #fallback>
      <div class="h-[350px] flex items-center justify-center">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-6 h-6 animate-spin text-ga-gray-500"
        />
      </div>
    </template>
  </ClientOnly>
</template>
