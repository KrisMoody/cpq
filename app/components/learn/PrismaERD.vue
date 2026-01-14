<script setup lang="ts">
const isLoading = ref(true)
const hasError = ref(false)

function onLoad() {
  isLoading.value = false
}

function onError() {
  isLoading.value = false
  hasError.value = true
}
</script>

<template>
  <div class="w-full">
    <div v-if="isLoading" class="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-400 animate-spin" />
        <p class="mt-2 text-sm text-gray-500">Loading database schema...</p>
      </div>
    </div>

    <div v-if="hasError" class="flex items-center justify-center h-96 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <div class="text-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-400" />
        <p class="mt-2 text-sm text-red-600 dark:text-red-400">Failed to load database schema diagram.</p>
        <p class="mt-1 text-xs text-gray-500">Run `prisma generate` to regenerate.</p>
      </div>
    </div>

    <div v-show="!isLoading && !hasError" class="overflow-auto max-h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-4">
      <img
        src="/prisma-erd.svg"
        alt="Prisma Entity-Relationship Diagram"
        class="w-full min-w-[1000px]"
        @load="onLoad"
        @error="onError"
      >
    </div>

    <p class="mt-3 text-xs text-gray-500 text-center">
      Auto-generated from Prisma schema. Shows all database entities and their relationships.
    </p>
  </div>
</template>
