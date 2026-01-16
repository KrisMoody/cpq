<script setup lang="ts">
const activeTab = ref('interactive')
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-2">
      <UButton
        :variant="activeTab === 'interactive' ? 'solid' : 'ghost'"
        size="sm"
        @click="activeTab = 'interactive'"
      >
        Interactive ER
      </UButton>
      <UButton
        :variant="activeTab === 'hierarchy' ? 'solid' : 'ghost'"
        size="sm"
        @click="activeTab = 'hierarchy'"
      >
        Hierarchy
      </UButton>
      <UButton
        :variant="activeTab === 'schema' ? 'solid' : 'ghost'"
        size="sm"
        @click="activeTab = 'schema'"
      >
        Database Schema
      </UButton>
    </div>
    <ClientOnly>
      <LearnERDiagram v-if="activeTab === 'interactive'" />
    </ClientOnly>
    <LearnEntityHierarchy v-if="activeTab === 'hierarchy'" />
    <LearnPrismaERD v-if="activeTab === 'schema'" />
  </div>
</template>
