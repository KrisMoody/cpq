<script setup lang="ts">
const router = useRouter()
const auth = useNeonAuth()

const menuOpen = ref(false)

const userInitials = computed(() => {
  if (!auth.user.value) return '?'
  const name = auth.user.value.name || auth.user.value.email
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const displayName = computed(() => {
  if (!auth.user.value) return ''
  return auth.user.value.name || auth.user.value.email
})

async function handleSignOut() {
  menuOpen.value = false
  await auth.signOut()
  router.push('/login')
}
</script>

<template>
  <UPopover v-model:open="menuOpen">
    <button
      type="button"
      class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <div
        v-if="auth.user.value?.image"
        class="w-8 h-8 rounded-full overflow-hidden"
      >
        <img
          :src="auth.user.value.image"
          :alt="displayName"
          class="w-full h-full object-cover"
        >
      </div>
      <div
        v-else
        class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-medium text-primary-700 dark:text-primary-300"
      >
        {{ userInitials }}
      </div>
      <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 text-gray-500" />
    </button>

    <template #content>
      <div class="w-56 p-2">
        <!-- User info -->
        <div class="px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
          <p class="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
            {{ displayName }}
          </p>
          <p v-if="auth.user.value?.name" class="text-xs text-gray-500 truncate">
            {{ auth.user.value.email }}
          </p>
        </div>

        <!-- Sign out -->
        <button
          type="button"
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          @click="handleSignOut"
        >
          <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4" />
          Sign out
        </button>
      </div>
    </template>
  </UPopover>
</template>
