<script setup lang="ts">
const route = useRoute()

// Section metadata
const sectionMeta: Record<string, { title: string; description: string; icon: string }> = {
  'workflow': {
    title: 'CPQ Workflow Overview',
    description: 'Understand the Configure, Price, Quote process flow',
    icon: 'i-heroicons-arrow-path',
  },
  'data-model': {
    title: 'Data Model',
    description: 'Explore the entity relationships and database schema',
    icon: 'i-heroicons-circle-stack',
  },
  'business-logic': {
    title: 'Business Logic',
    description: 'Learn how pricing, discounts, and rules work together',
    icon: 'i-heroicons-cog-6-tooth',
  },
  'formulas': {
    title: 'Formula Reference',
    description: 'Reference guide for pricing and calculation formulas',
    icon: 'i-heroicons-calculator',
  },
  'example': {
    title: 'Worked Example',
    description: 'Step-by-step walkthrough of a complete quote',
    icon: 'i-heroicons-play-circle',
  },
  'glossary': {
    title: 'Glossary',
    description: 'CPQ terminology and definitions',
    icon: 'i-heroicons-book-open',
  },
  'enums': {
    title: 'Enum Reference',
    description: 'Status values, types, and other enumerated constants',
    icon: 'i-heroicons-list-bullet',
  },
  'relationships': {
    title: 'Relationship Cards',
    description: 'Visual guide to entity relationships',
    icon: 'i-heroicons-arrows-right-left',
  },
  'quiz': {
    title: 'Test Your Knowledge',
    description: 'Quiz yourself on CPQ concepts',
    icon: 'i-heroicons-academic-cap',
  },
  'tips': {
    title: 'Quick Tips',
    description: 'Helpful tips and best practices',
    icon: 'i-heroicons-light-bulb',
  },
}

const section = computed(() => route.params.section as string)
const meta = computed(() => sectionMeta[section.value])

// Redirect to 404 if invalid section
if (!meta.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Section Not Found',
  })
}

// Set page title
useHead({
  title: computed(() => meta.value ? `${meta.value.title} - Learn CPQ` : 'Learn CPQ'),
})
</script>

<template>
  <div v-if="meta" class="space-y-6">
    <!-- Section Header -->
    <div>
      <div class="flex items-center gap-2 mb-2">
        <UIcon :name="meta.icon" class="w-6 h-6 text-ga-navy-500" />
        <h1 class="text-2xl font-bold">{{ meta.title }}</h1>
      </div>
      <p class="text-ga-gray-600">{{ meta.description }}</p>
    </div>

    <!-- Section Content -->
    <div>
      <LearnCPQFlowDiagram v-if="section === 'workflow'" />
      <LearnDataModel v-else-if="section === 'data-model'" />
      <LearnBusinessLogic v-else-if="section === 'business-logic'" />
      <LearnFormulaReference v-else-if="section === 'formulas'" />
      <LearnWorkedExample v-else-if="section === 'example'" />
      <LearnGlossary v-else-if="section === 'glossary'" />
      <LearnEnumReference v-else-if="section === 'enums'" />
      <LearnRelationshipCards v-else-if="section === 'relationships'" />
      <LearnQuiz v-else-if="section === 'quiz'" />
      <LearnTips v-else-if="section === 'tips'" />
    </div>
  </div>
</template>
