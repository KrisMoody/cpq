import type { NeonAuthUser, NeonAuthSession, SignInCredentials, SignUpCredentials } from '~/types/auth'

interface SignUpResult {
  needsVerification: boolean
  email: string
}

export function useNeonAuth() {
  const user = useState<NeonAuthUser | null>('neon-auth-user', () => null)
  const session = useState<NeonAuthSession | null>('neon-auth-session', () => null)
  const loading = useState<boolean>('neon-auth-loading', () => false)
  const error = useState<string | null>('neon-auth-error', () => null)
  const pendingVerificationEmail = useState<string | null>('neon-auth-pending-email', () => null)

  const isAuthenticated = computed(() => !!user.value && !!session.value)

  async function refreshSession(): Promise<void> {
    try {
      const response = await $fetch<{ user: NeonAuthUser, session: NeonAuthSession }>('/api/auth/get-session', {
        credentials: 'include'
      })

      if (response?.user && response?.session) {
        user.value = response.user
        session.value = response.session
      }
      else {
        user.value = null
        session.value = null
      }
    }
    catch {
      user.value = null
      session.value = null
    }
  }

  async function signIn(credentials: SignInCredentials): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ user: NeonAuthUser, session: NeonAuthSession }>('/api/auth/sign-in/email', {
        method: 'POST',
        body: credentials,
        credentials: 'include'
      })

      if (response?.user && response?.session) {
        user.value = response.user
        session.value = response.session
      }
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

      // If already verified, set the session
      if (response?.user && response?.session) {
        user.value = response.user
        session.value = response.session
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
      user.value = null
      session.value = null
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
      const response = await $fetch<{ user: NeonAuthUser, session: NeonAuthSession }>('/api/auth/email-otp/verify-email', {
        method: 'POST',
        body: { email, otp: code },
        credentials: 'include'
      })

      if (response?.user && response?.session) {
        user.value = response.user
        session.value = response.session
        pendingVerificationEmail.value = null
      }
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

  async function initialize(): Promise<void> {
    if (import.meta.server) return

    loading.value = true
    await refreshSession()
    loading.value = false
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
    resendVerification,
    initialize
  }
}
