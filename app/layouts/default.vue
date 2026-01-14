<script setup lang="ts">
const route = useRoute()

// Mobile sidebar state
const mobileMenuOpen = ref(false)

// Track which groups are expanded (for auto-expand on active route)
const expandedGroups = ref<string[]>(['catalog', 'configuration'])

// Navigation item types
type NavItem = {
  id: string
  type?: 'section' | 'link' | 'group'
  label: string
  icon?: string
  to?: string
  children?: NavItem[]
}

// Navigation structure with section headers
const navigation: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    id: 'sales-section',
    type: 'section',
    label: 'Sales',
  },
  {
    id: 'quotes',
    label: 'Quotes',
    icon: 'i-heroicons-document-text',
    to: '/quotes',
  },
  {
    id: 'quote-layouts',
    label: 'Quote Layouts',
    icon: 'i-heroicons-squares-2x2',
    to: '/quote-layouts',
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'i-heroicons-users',
    to: '/customers',
  },
  {
    id: 'contracts',
    label: 'Contracts',
    icon: 'i-heroicons-document-check',
    to: '/contracts',
  },
  {
    id: 'admin-section',
    type: 'section',
    label: 'Admin',
  },
  {
    id: 'catalog',
    type: 'group',
    label: 'Catalog',
    icon: 'i-heroicons-squares-2x2',
    children: [
      {
        id: 'products',
        label: 'Products',
        icon: 'i-heroicons-cube',
        to: '/products',
      },
      {
        id: 'categories',
        label: 'Categories',
        icon: 'i-heroicons-folder',
        to: '/categories',
      },
      {
        id: 'price-books',
        label: 'Price Books',
        icon: 'i-heroicons-book-open',
        to: '/price-books',
      },
      {
        id: 'attributes',
        label: 'Attributes',
        icon: 'i-heroicons-tag',
        to: '/attributes',
      },
      {
        id: 'units',
        label: 'Units',
        icon: 'i-heroicons-scale',
        to: '/units',
      },
    ],
  },
  {
    id: 'configuration',
    type: 'group',
    label: 'Configuration',
    icon: 'i-heroicons-cog-6-tooth',
    children: [
      {
        id: 'rules',
        label: 'Rules',
        icon: 'i-heroicons-adjustments-horizontal',
        to: '/rules',
      },
      {
        id: 'discounts',
        label: 'Discounts',
        icon: 'i-heroicons-tag',
        to: '/discounts',
      },
      {
        id: 'tax-rates',
        label: 'Tax Rates',
        icon: 'i-heroicons-receipt-percent',
        to: '/tax-rates',
      },
      {
        id: 'currencies',
        label: 'Currencies',
        icon: 'i-heroicons-currency-dollar',
        to: '/currencies',
      },
      {
        id: 'affinities',
        label: 'Affinities',
        icon: 'i-heroicons-link',
        to: '/affinities',
      },
      {
        id: 'questionnaires',
        label: 'Questionnaires',
        icon: 'i-heroicons-clipboard-document-list',
        to: '/questionnaires',
      },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    icon: 'i-heroicons-academic-cap',
    to: '/learn',
  },
]

// Check if a route is active (exact match or starts with path)
function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path || route.path.startsWith(path + '/')
}

// Check if any child in a group is active
function isGroupActive(group: NavItem): boolean {
  if (!group.children) return false
  return group.children.some(child => child.to && isActive(child.to))
}

// Toggle group expansion
function toggleGroup(groupId: string) {
  const index = expandedGroups.value.indexOf(groupId)
  if (index === -1) {
    expandedGroups.value.push(groupId)
  } else {
    expandedGroups.value.splice(index, 1)
  }
}

// Auto-expand groups containing active routes on mount and route change
function autoExpandActiveGroup() {
  navigation.forEach(item => {
    if (item.children && isGroupActive(item)) {
      if (!expandedGroups.value.includes(item.id)) {
        expandedGroups.value.push(item.id)
      }
    }
  })
}

// Watch for route changes to auto-expand
watch(() => route.path, autoExpandActiveGroup, { immediate: true })

// Close mobile menu on navigation
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Mobile Header -->
    <header class="lg:hidden sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center justify-between h-14 px-4">
        <button
          type="button"
          class="p-2 -ml-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          @click="mobileMenuOpen = true"
        >
          <UIcon name="i-heroicons-bars-3" class="w-6 h-6" />
        </button>
        <NuxtLink to="/" class="flex items-center gap-2">
          <UIcon name="i-heroicons-squares-2x2" class="w-6 h-6 text-primary-500" />
          <span class="font-semibold">CPQ Learning</span>
        </NuxtLink>
        <UColorModeButton variant="ghost" size="sm" />
      </div>
    </header>

    <div class="flex">
      <!-- Desktop Sidebar -->
      <aside class="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <!-- Sidebar Header -->
        <div class="flex items-center gap-3 h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <NuxtLink to="/" class="flex items-center gap-3">
            <UIcon name="i-heroicons-squares-2x2" class="w-8 h-8 text-primary-500" />
            <span class="font-bold text-lg">CPQ Learning</span>
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4 px-3">
          <ul class="space-y-1">
            <template v-for="item in navigation" :key="item.id">
              <!-- Section header -->
              <li v-if="item.type === 'section'" class="pt-4 first:pt-0">
                <div class="flex items-center gap-2 px-3 pb-2">
                  <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    {{ item.label }}
                  </span>
                  <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>
              </li>

              <!-- Standalone item (no children) -->
              <li v-else-if="!item.children">
                <NuxtLink
                  :to="item.to!"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  :class="isActive(item.to!)
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
                >
                  <UIcon :name="item.icon!" class="w-5 h-5 flex-shrink-0" />
                  {{ item.label }}
                </NuxtLink>
              </li>

              <!-- Group with children -->
              <li v-else>
                <button
                  type="button"
                  class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  :class="isGroupActive(item)
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
                  @click="toggleGroup(item.id)"
                >
                  <span class="flex items-center gap-3">
                    <UIcon :name="item.icon!" class="w-5 h-5 flex-shrink-0" />
                    {{ item.label }}
                  </span>
                  <UIcon
                    name="i-heroicons-chevron-down"
                    class="w-4 h-4 transition-transform duration-200"
                    :class="expandedGroups.includes(item.id) ? 'rotate-180' : ''"
                  />
                </button>

                <!-- Children -->
                <ul
                  v-show="expandedGroups.includes(item.id)"
                  class="mt-1 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700 space-y-1"
                >
                  <li v-for="child in item.children" :key="child.id">
                    <NuxtLink
                      :to="child.to!"
                      class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                      :class="isActive(child.to!)
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
                    >
                      <UIcon :name="child.icon!" class="w-4 h-4 flex-shrink-0" />
                      {{ child.label }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </template>
          </ul>
        </nav>

        <!-- Sidebar Footer -->
        <div class="border-t border-gray-200 dark:border-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">Color Mode</span>
            <UColorModeButton variant="ghost" size="xs" />
          </div>
        </div>
      </aside>

      <!-- Mobile Sidebar (Slideover) -->
      <USlideover v-model:open="mobileMenuOpen" side="left" :ui="{ content: 'max-w-xs' }">
        <template #content>
          <div class="flex flex-col h-full bg-white dark:bg-gray-900">
            <!-- Mobile Sidebar Header -->
            <div class="flex items-center justify-between h-14 px-4 border-b border-gray-200 dark:border-gray-800">
              <NuxtLink to="/" class="flex items-center gap-2" @click="mobileMenuOpen = false">
                <UIcon name="i-heroicons-squares-2x2" class="w-6 h-6 text-primary-500" />
                <span class="font-semibold">CPQ Learning</span>
              </NuxtLink>
              <button
                type="button"
                class="p-2 -mr-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                @click="mobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
              </button>
            </div>

            <!-- Mobile Navigation -->
            <nav class="flex-1 overflow-y-auto py-4 px-3">
              <ul class="space-y-1">
                <template v-for="item in navigation" :key="item.id">
                  <!-- Section header -->
                  <li v-if="item.type === 'section'" class="pt-4 first:pt-0">
                    <div class="flex items-center gap-2 px-3 pb-2">
                      <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        {{ item.label }}
                      </span>
                      <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </li>

                  <!-- Standalone item -->
                  <li v-else-if="!item.children">
                    <NuxtLink
                      :to="item.to!"
                      class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                      :class="isActive(item.to!)
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
                    >
                      <UIcon :name="item.icon!" class="w-5 h-5 flex-shrink-0" />
                      {{ item.label }}
                    </NuxtLink>
                  </li>

                  <!-- Group -->
                  <li v-else>
                    <button
                      type="button"
                      class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                      :class="isGroupActive(item)
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
                      @click="toggleGroup(item.id)"
                    >
                      <span class="flex items-center gap-3">
                        <UIcon :name="item.icon!" class="w-5 h-5 flex-shrink-0" />
                        {{ item.label }}
                      </span>
                      <UIcon
                        name="i-heroicons-chevron-down"
                        class="w-4 h-4 transition-transform duration-200"
                        :class="expandedGroups.includes(item.id) ? 'rotate-180' : ''"
                      />
                    </button>

                    <ul
                      v-show="expandedGroups.includes(item.id)"
                      class="mt-1 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700 space-y-1"
                    >
                      <li v-for="child in item.children" :key="child.id">
                        <NuxtLink
                          :to="child.to!"
                          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                          :class="isActive(child.to!)
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
                        >
                          <UIcon :name="child.icon!" class="w-4 h-4 flex-shrink-0" />
                          {{ child.label }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </li>
                </template>
              </ul>
            </nav>

            <!-- Mobile Sidebar Footer -->
            <div class="border-t border-gray-200 dark:border-gray-800 p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Color Mode</span>
                <UColorModeButton variant="ghost" size="sm" />
              </div>
            </div>
          </div>
        </template>
      </USlideover>

      <!-- Main Content Area -->
      <div class="flex-1 lg:pl-64">
        <main class="min-h-screen">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <slot />
          </div>
        </main>

        <!-- Footer -->
        <footer class="border-t border-gray-200 dark:border-gray-800">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="flex items-center justify-between text-sm text-gray-500">
              <p>CPQ Learning Application</p>
              <p class="hidden sm:block">Built with Nuxt 4 + Prisma + Neon</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>
