import type { NeonAuthUser, NeonAuthSession } from '~/types/auth'

interface SessionResponse {
  user: NeonAuthUser
  session: NeonAuthSession
}

/**
 * SSR-compatible session fetching composable
 * Uses useFetch for proper server hydration
 */
export function useNeonSession() {
  const { data, pending, error, refresh } = useFetch<SessionResponse>('/api/auth/get-session', {
    credentials: 'include',
    key: 'neon-session'
  })

  const user = computed(() => data.value?.user || null)
  const session = computed(() => data.value?.session || null)
  const isAuthenticated = computed(() => !!user.value && !!session.value)

  return {
    data,
    user,
    session,
    isAuthenticated,
    pending,
    error,
    refresh
  }
}
