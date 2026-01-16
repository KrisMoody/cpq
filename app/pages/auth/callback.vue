<script setup lang="ts">
/**
 * OAuth callback page - prepared for future OAuth provider integration
 * Currently handles session refresh after OAuth redirects
 */
definePageMeta({
  layout: 'blank'
})

const route = useRoute()
const router = useRouter()
const auth = useNeonAuth()

const error = ref<string | null>(null)
const loading = ref(true)

onMounted(async () => {
  // Check for error in URL params
  const errorParam = route.query.error as string
  if (errorParam) {
    error.value = route.query.error_description as string || 'Authentication failed'
    loading.value = false
    return
  }

  try {
    // Refresh session to pick up new auth state
    await auth.refreshSession()

    if (auth.isAuthenticated.value) {
      // Redirect to home or intended page
      const redirect = route.query.redirect as string || '/'
      router.push(redirect)
    }
    else {
      error.value = 'Authentication failed. Please try again.'
      loading.value = false
    }
  }
  catch {
    error.value = 'Failed to complete authentication'
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <div class="w-full max-w-md text-center">
      <div class="flex items-center justify-center gap-3 mb-8">
        <UIcon name="i-heroicons-squares-2x2" class="w-10 h-10 text-primary-500" />
        <span class="font-bold text-2xl">CPQ Learning</span>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="space-y-4">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary-500 animate-spin mx-auto" />
        <p class="text-gray-500">Completing authentication...</p>
      </div>

      <!-- Error state -->
      <UCard v-else-if="error">
        <div class="space-y-4">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto" />
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Authentication Failed</h2>
          <p class="text-gray-500">{{ error }}</p>
          <UButton to="/login" variant="soft">
            Back to sign in
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>
