import type { H3Event } from 'h3'
import { appendResponseHeader, createError, getHeader } from 'h3'
import type { NeonAuthResponse } from '~/types/auth'

/**
 * Get the current session from Neon Auth by forwarding cookies
 * Returns null if no valid session exists
 */
export async function getNeonSession(event: H3Event): Promise<NeonAuthResponse | null> {
  const config = useRuntimeConfig()

  if (!config.neonAuthUrl) {
    return null
  }

  const cookie = getHeader(event, 'cookie')
  if (!cookie) {
    return null
  }

  try {
    const response = await $fetch.raw<NeonAuthResponse>(`${config.neonAuthUrl}/get-session`, {
      method: 'GET',
      headers: {
        cookie
      },
      credentials: 'include'
    })

    // Forward any set-cookie headers (session refresh)
    const setCookieHeaders = response.headers.getSetCookie?.() || []
    for (const setCookie of setCookieHeaders) {
      appendResponseHeader(event, 'set-cookie', setCookie)
    }

    const data = response._data
    if (data?.user && data?.session) {
      return data
    }

    return null
  }
  catch {
    return null
  }
}

/**
 * Require authentication for an API route
 * Returns the user ID if authenticated, throws 401 if not
 * Attaches the session to event.context.neonAuth for use in handlers
 */
export async function requireAuth(event: H3Event): Promise<string> {
  const session = await getNeonSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Attach session to event context for use in handlers
  event.context.neonAuth = session

  return session.user.id
}

/**
 * Get the JWT token from the current session for Data API access
 * Returns null if no valid session exists
 */
export async function getNeonJWT(event: H3Event): Promise<string | null> {
  // Check if session is already in context
  if (event.context.neonAuth?.session?.token) {
    return event.context.neonAuth.session.token
  }

  const session = await getNeonSession(event)
  return session?.session?.token || null
}
