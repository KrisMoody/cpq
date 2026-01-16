import type { NeonAuthUser, NeonAuthSession } from '~/types/auth'

/**
 * SSR-compatible session composable
 *
 * The session state is populated by the auth.server.ts plugin during SSR,
 * then hydrated to the client automatically via useState.
 */
export function useNeonSession() {
  // These states are populated by auth.server.ts plugin during SSR
  const user = useState<NeonAuthUser | null>('neon-auth-user', () => null)
  const session = useState<NeonAuthSession | null>('neon-auth-session', () => null)

  const isAuthenticated = computed(() => !!user.value && !!session.value)

  async function refresh(): Promise<void> {
    // Client-side refresh
    try {
      const response = await $fetch<{ user: NeonAuthUser; session: NeonAuthSession }>(
        '/api/auth/get-session',
        { credentials: 'include' }
      )

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

  return {
    user,
    session,
    isAuthenticated,
    refresh
  }
}
