import type { NeonAuthUser, NeonAuthSession, SignInCredentials, SignUpCredentials } from '~/types/auth'

interface SignUpResult {
  needsVerification: boolean
  email: string
}

export function useNeonAuth() {
  // Use useNeonSession as the source of truth for SSR-hydrated session data
  const neonSession = useNeonSession()

  const loading = useState<boolean>('neon-auth-loading', () => false)
  const error = useState<string | null>('neon-auth-error', () => null)
  const pendingVerificationEmail = useState<string | null>('neon-auth-pending-email', () => null)

  // Derive user/session from the SSR-hydrated useNeonSession
  const user = computed(() => neonSession.user.value)
  const session = computed(() => neonSession.session.value)
  const isAuthenticated = computed(() => neonSession.isAuthenticated.value)

  async function refreshSession(): Promise<void> {
    // Delegate to useNeonSession's refresh to keep state in sync
    await neonSession.refresh()
  }

  async function signIn(credentials: SignInCredentials): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await $fetch<{ user: NeonAuthUser, session: NeonAuthSession }>('/api/auth/sign-in/email', {
        method: 'POST',
        body: credentials,
        credentials: 'include'
      })

      // Refresh useNeonSession to sync the new session state
      await neonSession.refresh()
    }
    catch (e: unknown) {
      const errorData = e as { data?: { message?: string } }
      error.value = errorData?.data?.message || 'Sign in failed'
      throw e
    }
    finally {
      loading.value = false
    }
  }

  async function signUp(credentials: SignUpCredentials): Promise<SignUpResult> {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ user: NeonAuthUser, session?: NeonAuthSession }>('/api/auth/sign-up/email', {
        method: 'POST',
        body: credentials,
        credentials: 'include'
      })

      // Check if email verification is required
      if (response?.user && !response.user.emailVerified) {
        pendingVerificationEmail.value = credentials.email
        return { needsVerification: true, email: credentials.email }
      }

      // If already verified, refresh useNeonSession to sync the new session state
      if (response?.user && response?.session) {
        await neonSession.refresh()
      }

      return { needsVerification: false, email: credentials.email }
    }
    catch (e: unknown) {
      const errorData = e as { data?: { message?: string } }
      error.value = errorData?.data?.message || 'Sign up failed'
      throw e
    }
    finally {
      loading.value = false
    }
  }

  async function signOut(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await $fetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include'
      })
    }
    catch {
      // Ignore errors on sign out
    }
    finally {
      // Refresh useNeonSession to clear the session state
      await neonSession.refresh()
      pendingVerificationEmail.value = null
      loading.value = false
    }
  }

  async function signInWithOAuth(provider: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ url: string }>('/api/auth/sign-in/social', {
        method: 'POST',
        body: { provider },
        credentials: 'include'
      })

      if (response?.url) {
        window.location.href = response.url
      }
    }
    catch (e: unknown) {
      const errorData = e as { data?: { message?: string } }
      error.value = errorData?.data?.message || 'OAuth sign in failed'
      loading.value = false
      throw e
    }
  }

  async function verifyEmail(email: string, code: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await $fetch<{ user: NeonAuthUser, session: NeonAuthSession }>('/api/auth/email-otp/verify-email', {
        method: 'POST',
        body: { email, otp: code },
        credentials: 'include'
      })

      // Refresh useNeonSession to sync the new verified session state
      await neonSession.refresh()
      pendingVerificationEmail.value = null
    }
    catch (e: unknown) {
      const errorData = e as { data?: { message?: string } }
      error.value = errorData?.data?.message || 'Email verification failed'
      throw e
    }
    finally {
      loading.value = false
    }
  }

  async function resendVerification(email: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await $fetch('/api/auth/email-otp/send-verification-otp', {
        method: 'POST',
        body: { email },
        credentials: 'include'
      })
    }
    catch (e: unknown) {
      const errorData = e as { data?: { message?: string } }
      error.value = errorData?.data?.message || 'Failed to resend verification code'
      throw e
    }
    finally {
      loading.value = false
    }
  }

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated,
    pendingVerificationEmail,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    refreshSession,
    verifyEmail,
    resendVerification
  }
}
