<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})

const route = useRoute()
const router = useRouter()
const auth = useNeonAuth()

const email = computed(() => (route.query.email as string) || auth.pendingVerificationEmail.value || '')
const code = ref('')
const formError = ref<string | null>(null)
const resendCooldown = ref(0)
const resendSuccess = ref(false)

// Cooldown timer for resend button
let cooldownInterval: ReturnType<typeof setInterval> | null = null

function startCooldown() {
  resendCooldown.value = 60
  if (cooldownInterval) clearInterval(cooldownInterval)
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownInterval) {
      clearInterval(cooldownInterval)
      cooldownInterval = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval)
})

async function handleSubmit() {
  formError.value = null
  resendSuccess.value = false

  if (!email.value) {
    formError.value = 'Email is required'
    return
  }

  if (!code.value || code.value.length < 4) {
    formError.value = 'Please enter a valid verification code'
    return
  }

  try {
    await auth.verifyEmail(email.value, code.value)
    router.push('/')
  }
  catch {
    formError.value = auth.error.value || 'Invalid verification code'
  }
}

async function handleResend() {
  formError.value = null
  resendSuccess.value = false

  if (!email.value) {
    formError.value = 'Email is required'
    return
  }

  try {
    await auth.resendVerification(email.value)
    resendSuccess.value = true
    startCooldown()
  }
  catch {
    formError.value = auth.error.value || 'Failed to resend verification code'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-3 mb-4">
          <UIcon name="i-heroicons-squares-2x2" class="w-10 h-10 text-primary-500" />
          <span class="font-bold text-2xl">CPQ Learning</span>
        </div>
        <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Verify your email</h1>
        <p v-if="email" class="text-gray-500 mt-2">
          We sent a verification code to <strong>{{ email }}</strong>
        </p>
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

          <UAlert
            v-if="resendSuccess"
            color="success"
            variant="subtle"
            title="Verification code sent!"
            icon="i-heroicons-check-circle"
          />

          <UFormField v-if="!email" label="Email" required>
            <UInput
              :model-value="email"
              type="email"
              placeholder="you@example.com"
              size="lg"
              icon="i-heroicons-envelope"
              disabled
            />
          </UFormField>

          <UFormField label="Verification Code" required>
            <UInput
              v-model="code"
              type="text"
              placeholder="Enter the code from your email"
              autocomplete="one-time-code"
              size="lg"
              icon="i-heroicons-key"
            />
          </UFormField>

          <UButton
            type="submit"
            block
            size="lg"
            :loading="auth.loading.value"
          >
            Verify email
          </UButton>

          <div class="text-center">
            <UButton
              variant="ghost"
              size="sm"
              :disabled="resendCooldown > 0 || auth.loading.value"
              @click="handleResend"
            >
              <template v-if="resendCooldown > 0">
                Resend code in {{ resendCooldown }}s
              </template>
              <template v-else>
                Resend verification code
              </template>
            </UButton>
          </div>
        </form>

        <template #footer>
          <p class="text-center text-sm text-gray-500">
            <NuxtLink to="/login" class="text-primary-500 hover:text-primary-600 font-medium">
              Back to sign in
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
