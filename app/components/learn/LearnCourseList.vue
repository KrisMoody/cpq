<script setup lang="ts">
import { useCourseProgress, type CourseModule } from '~/composables/useCourseProgress'

const router = useRouter()

const { modules, getModuleProgress, overallProgress } = useCourseProgress()

function navigateToModule(module: CourseModule) {
  router.push(`/learn/course/${module.id}`)
}

function getLevelColor(level: CourseModule['level']) {
  switch (level) {
    case 'Beginner':
      return 'success'
    case 'Intermediate':
      return 'warning'
    case 'Beginner-Intermediate':
      return 'info'
    case 'Intermediate-Advanced':
      return 'warning'
    case 'Advanced':
      return 'error'
    default:
      return 'neutral'
  }
}

function getStatusIcon(status: 'not_started' | 'in_progress' | 'completed') {
  switch (status) {
    case 'completed':
      return 'i-heroicons-check-circle-solid'
    case 'in_progress':
      return 'i-heroicons-play-circle'
    default:
      return 'i-heroicons-circle'
  }
}

function getStatusColor(status: 'not_started' | 'in_progress' | 'completed') {
  switch (status) {
    case 'completed':
      return 'text-green-500'
    case 'in_progress':
      return 'text-blue-500'
    default:
      return 'text-ga-gray-500'
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Overall Progress -->
    <div class="flex items-center justify-between p-4 bg-ga-gray-100 rounded-lg">
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-academic-cap" class="w-6 h-6 text-primary" />
        <div>
          <p class="font-medium">Course Progress</p>
          <p class="text-sm text-ga-gray-600">
            {{ modules.filter(m => getModuleProgress(m.id).status === 'completed').length }} of {{ modules.length }} modules completed
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-32 h-2 bg-ga-gray-300 rounded-full overflow-hidden">
          <div
            class="h-full bg-primary rounded-full transition-all duration-300"
            :style="{ width: `${overallProgress}%` }"
          />
        </div>
        <span class="text-sm font-medium">{{ overallProgress }}%</span>
      </div>
    </div>

    <!-- Module Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard
        v-for="module in modules"
        :key="module.id"
        class="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
        @click="navigateToModule(module)"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-sm font-mono text-ga-gray-600">{{ module.number }}</span>
            <UBadge :color="getLevelColor(module.level)" variant="subtle" size="xs">
              {{ module.level }}
            </UBadge>
          </div>
          <UIcon
            :name="getStatusIcon(getModuleProgress(module.id).status)"
            :class="['w-5 h-5', getStatusColor(getModuleProgress(module.id).status)]"
          />
        </div>
        <h3 class="font-semibold mb-1">{{ module.title }}</h3>
        <p class="text-sm text-ga-gray-600">{{ module.focus }}</p>
      </UCard>
    </div>
  </div>
</template>
