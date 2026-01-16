import { getHeader, appendResponseHeader } from 'h3'
import type { NeonAuthUser, NeonAuthSession } from '~/types/auth'

/**
 * Server plugin that fetches the session during SSR
 * and stores it in useState for client hydration
 */
export default defineNuxtPlugin(async () => {
  // Get the session state - this will be hydrated to the client
  const user = useState<NeonAuthUser | null>('neon-auth-user', () => null)
  const session = useState<NeonAuthSession | null>('neon-auth-session', () => null)

  // Get the request event to access cookies
  const event = useRequestEvent()
  if (!event) return

  const config = useRuntimeConfig()
  if (!config.neonAuthUrl) return

  // Get cookies from the request
  const cookie = getHeader(event, 'cookie')
  if (!cookie) return

  try {
    // Fetch session directly from Neon Auth (server-to-server)
    const response = await $fetch.raw<{ user: NeonAuthUser; session: NeonAuthSession }>(
      `${config.neonAuthUrl}/get-session`,
      {
        method: 'GET',
        headers: { cookie }
      }
    )

    // Forward any set-cookie headers (session refresh)
    const setCookieHeaders = response.headers.getSetCookie?.() || []
    for (const setCookie of setCookieHeaders) {
      appendResponseHeader(event, 'set-cookie', setCookie)
    }

    const data = response._data
    if (data?.user && data?.session) {
      user.value = data.user
      session.value = data.session
    }
  }
  catch {
    // Session fetch failed - user is not authenticated
    user.value = null
    session.value = null
  }
})
