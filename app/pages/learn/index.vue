<script setup lang="ts">
// Learn hub page - provides an overview of all learning sections
const sections = [
  {
    id: 'course',
    title: 'Interactive Course',
    description: 'Step-by-step learning modules covering CPQ fundamentals',
    icon: 'i-heroicons-book-open',
    to: '/learn/course',
    color: 'primary',
  },
  {
    id: 'workflow',
    title: 'Workflow Overview',
    description: 'Understand the Configure, Price, Quote process flow',
    icon: 'i-heroicons-arrow-path',
    to: '/learn/workflow',
    color: 'blue',
  },
  {
    id: 'data-model',
    title: 'Data Model',
    description: 'Explore entity relationships and database schema',
    icon: 'i-heroicons-circle-stack',
    to: '/learn/data-model',
    color: 'purple',
  },
  {
    id: 'business-logic',
    title: 'Business Logic',
    description: 'Learn how pricing, discounts, and rules work',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/learn/business-logic',
    color: 'pink',
  },
  {
    id: 'formulas',
    title: 'Formula Reference',
    description: 'Pricing and calculation formula guide',
    icon: 'i-heroicons-calculator',
    to: '/learn/formulas',
    color: 'orange',
  },
  {
    id: 'example',
    title: 'Worked Example',
    description: 'Step-by-step walkthrough of a complete quote',
    icon: 'i-heroicons-play-circle',
    to: '/learn/example',
    color: 'green',
  },
  {
    id: 'glossary',
    title: 'Glossary',
    description: 'CPQ terminology and definitions',
    icon: 'i-heroicons-book-open',
    to: '/learn/glossary',
    color: 'cyan',
  },
  {
    id: 'enums',
    title: 'Enum Reference',
    description: 'Status values and enumerated constants',
    icon: 'i-heroicons-list-bullet',
    to: '/learn/enums',
    color: 'gray',
  },
  {
    id: 'relationships',
    title: 'Relationship Cards',
    description: 'Visual guide to entity relationships',
    icon: 'i-heroicons-arrows-right-left',
    to: '/learn/relationships',
    color: 'indigo',
  },
  {
    id: 'quiz',
    title: 'Quiz',
    description: 'Test your CPQ knowledge',
    icon: 'i-heroicons-academic-cap',
    to: '/learn/quiz',
    color: 'yellow',
  },
  {
    id: 'tips',
    title: 'Quick Tips',
    description: 'Helpful tips and best practices',
    icon: 'i-heroicons-light-bulb',
    to: '/learn/tips',
    color: 'amber',
  },
]

useHead({
  title: 'Learn CPQ',
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Learn CPQ</h1>
      <p class="text-gray-500 dark:text-gray-400">
        Master Configure, Price, Quote concepts through interactive learning modules
      </p>
    </div>

    <!-- Featured: Course -->
    <NuxtLink
      to="/learn/course"
      class="block p-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white hover:from-primary-600 hover:to-primary-700 transition-all"
    >
      <div class="flex items-start gap-4">
        <div class="p-3 bg-white/20 rounded-lg">
          <UIcon name="i-heroicons-book-open" class="w-8 h-8" />
        </div>
        <div>
          <h2 class="text-xl font-bold mb-1">Start the Interactive Course</h2>
          <p class="text-primary-100">
            Begin with structured learning modules that guide you through CPQ fundamentals step by step.
          </p>
        </div>
      </div>
    </NuxtLink>

    <!-- Other Sections Grid -->
    <div>
      <h2 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Reference Materials</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="section in sections.slice(1)"
          :key="section.id"
          :to="section.to"
          class="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all"
        >
          <div class="flex items-start gap-3">
            <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <UIcon :name="section.icon" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ section.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ section.description }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
