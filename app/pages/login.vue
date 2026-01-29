<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})

const route = useRoute()
const router = useRouter()
const auth = useNeonAuth()

const email = ref('')
const password = ref('')
const formError = ref<string | null>(null)

async function handleSubmit() {
  formError.value = null

  try {
    await auth.signIn({ email: email.value, password: password.value })

    // Redirect to the intended page or home
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
  }
  catch {
    formError.value = auth.error.value || 'Invalid email or password'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-ga-gray-100 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-3 mb-4">
          <UIcon name="i-heroicons-squares-2x2" class="w-10 h-10 text-ga-navy-500" />
          <span class="font-bold text-2xl">CPQ Learning</span>
        </div>
        <h1 class="text-xl font-semibold">Sign in to your account</h1>
      </div>

      <UCard>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <UAlert
            v-if="formError"
            color="error"
            variant="subtle"
            :title="formError"
            icon="i-heroicons-exclamation-circle"
          />

          <UFormField label="Email" required>
            <UInput
              v-model="email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              size="lg"
              icon="i-heroicons-envelope"
            />
          </UFormField>

          <UFormField label="Password" required>
            <UInput
              v-model="password"
              type="password"
              placeholder="Enter your password"
              autocomplete="current-password"
              size="lg"
              icon="i-heroicons-lock-closed"
            />
          </UFormField>

          <UButton
            type="submit"
            block
            size="lg"
            :loading="auth.loading.value"
          >
            Sign in
          </UButton>
        </form>

        <template #footer>
          <p class="text-center text-sm text-ga-gray-600">
            Don't have an account?
            <NuxtLink to="/register" class="text-ga-navy-500 hover:text-ga-navy-600 font-medium">
              Sign up
            </NuxtLink>
          </p>
        </template>
      </UCard>

      <div class="mt-4 text-center">
        <UColorModeButton variant="ghost" size="sm" />
      </div>
    </div>
  </div>
</template>
