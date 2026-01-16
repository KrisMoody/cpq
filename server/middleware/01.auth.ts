import { createError, getRequestURL } from 'h3'
import { getNeonSession } from '../utils/auth'

/**
 * Server middleware that protects all API routes except auth routes.
 * Runs before route handlers to enforce authentication.
 *
 * Excluded paths:
 * - /api/auth/* - Auth proxy routes must be public
 */
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const pathname = url.pathname

  // Skip non-API routes (let client middleware handle page protection)
  if (!pathname.startsWith('/api/')) {
    return
  }

  // Skip auth routes - these must be public for login/register to work
  if (pathname.startsWith('/api/auth/')) {
    return
  }

  // Check for valid session
  const session = await getNeonSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Attach session to context for use in route handlers
  event.context.neonAuth = session
})
