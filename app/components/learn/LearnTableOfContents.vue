<script setup lang="ts">
interface TocSection {
  id: string
  label: string
  icon: string
  children?: { id: string; label: string }[]
}

defineProps<{
  sections: TocSection[]
  activeSection: string
}>()

const emit = defineEmits<{
  navigate: [sectionId: string]
}>()

const isMobileMenuOpen = ref(false)
const isXlScreen = ref(false)

onMounted(() => {
  const mediaQuery = window.matchMedia('(min-width: 1280px)')
  isXlScreen.value = mediaQuery.matches

  const handler = (e: MediaQueryListEvent) => {
    isXlScreen.value = e.matches
  }
  mediaQuery.addEventListener('change', handler)

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handler)
  })
})

function handleNavigate(sectionId: string) {
  emit('navigate', sectionId)
  isMobileMenuOpen.value = false
}
</script>

<template>
  <!-- Mobile hamburger menu (< 768px) -->
  <div class="md:hidden fixed top-16 right-4 z-40">
    <UButton
      icon="i-heroicons-bars-3"
      variant="soft"
      size="lg"
      @click="isMobileMenuOpen = !isMobileMenuOpen"
    />
  </div>

  <!-- Mobile slide-out menu -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden fixed inset-0 bg-black/50 z-40"
        @click="isMobileMenuOpen = false"
      />
    </Transition>
    <Transition
      enter-active-class="transition-transform duration-200"
      leave-active-class="transition-transform duration-200"
      enter-from-class="translate-x-full"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden fixed right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl z-50 p-4 overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">Contents</h3>
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            size="sm"
            @click="isMobileMenuOpen = false"
          />
        </div>
        <nav class="space-y-1">
          <button
            v-for="section in sections"
            :key="section.id"
            class="w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center gap-2"
            :class="activeSection === section.id
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'"
            @click="handleNavigate(section.id)"
          >
            <UIcon :name="section.icon" class="w-4 h-4" />
            {{ section.label }}
          </button>
        </nav>
      </div>
    </Transition>
  </Teleport>

  <!-- Tablet sticky top bar (768px - 1279px) -->
  <div class="hidden md:block xl:hidden sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-700 -mx-4 px-4 mb-6">
    <nav class="flex gap-1 py-2 overflow-x-auto scrollbar-hide">
      <button
        v-for="section in sections"
        :key="section.id"
        class="px-3 py-1.5 rounded-lg transition-colors text-sm whitespace-nowrap flex items-center gap-1.5"
        :class="activeSection === section.id
          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'"
        @click="handleNavigate(section.id)"
      >
        <UIcon :name="section.icon" class="w-4 h-4" />
        {{ section.label }}
      </button>
    </nav>
  </div>

  <!-- Desktop sticky left sidebar (≥1280px) - positioned after main app sidebar (lg:w-64 = 16rem) -->
  <aside
    class="hidden xl:block fixed left-[17rem] top-20 w-56 max-h-[calc(100vh-6rem)] overflow-y-auto z-20"
    :inert="isXlScreen ? undefined : true"
  >
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
      <h3 class="font-semibold text-sm mb-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Contents
      </h3>
      <nav class="space-y-0.5">
        <button
          v-for="section in sections"
          :key="section.id"
          class="w-full text-left px-2 py-1.5 rounded transition-colors text-sm flex items-center gap-2"
          :class="activeSection === section.id
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'"
          @click="handleNavigate(section.id)"
        >
          <UIcon :name="section.icon" class="w-4 h-4 flex-shrink-0" />
          <span class="truncate">{{ section.label }}</span>
        </button>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
