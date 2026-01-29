<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})

const router = useRouter()
const auth = useNeonAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const formError = ref<string | null>(null)

async function handleSubmit() {
  formError.value = null

  // Validate passwords match
  if (password.value !== confirmPassword.value) {
    formError.value = 'Passwords do not match'
    return
  }

  // Validate password length
  if (password.value.length < 8) {
    formError.value = 'Password must be at least 8 characters'
    return
  }

  try {
    const result = await auth.signUp({
      email: email.value,
      password: password.value,
      name: name.value || undefined
    })

    if (result.needsVerification) {
      // Redirect to email verification page
      router.push({
        path: '/verify-email',
        query: { email: result.email }
      })
    }
    else {
      // Already verified, go to home
      router.push('/')
    }
  }
  catch {
    formError.value = auth.error.value || 'Registration failed'
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
        <h1 class="text-xl font-semibold">Create your account</h1>
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

          <UFormField label="Name">
            <UInput
              v-model="name"
              type="text"
              placeholder="Your name (optional)"
              autocomplete="name"
              size="lg"
              icon="i-heroicons-user"
            />
          </UFormField>

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

          <UFormField label="Password" required hint="At least 8 characters">
            <UInput
              v-model="password"
              type="password"
              placeholder="Create a password"
              autocomplete="new-password"
              size="lg"
              icon="i-heroicons-lock-closed"
            />
          </UFormField>

          <UFormField label="Confirm Password" required>
            <UInput
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              autocomplete="new-password"
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
            Create account
          </UButton>
        </form>

        <template #footer>
          <p class="text-center text-sm text-ga-gray-600">
            Already have an account?
            <NuxtLink to="/login" class="text-ga-navy-500 hover:text-ga-navy-600 font-medium">
              Sign in
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
