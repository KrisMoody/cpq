import { appendResponseHeader, createError, getHeader, getRouterParam, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.neonAuthUrl) {
    throw createError({
      statusCode: 500,
      message: 'NEON_AUTH_URL is not configured'
    })
  }

  const path = getRouterParam(event, 'path') || ''
  const targetUrl = `${config.neonAuthUrl}/${path}`

  // Get cookies from the incoming request
  const cookie = getHeader(event, 'cookie')
  const contentType = getHeader(event, 'content-type')
  const origin = getHeader(event, 'origin')

  // Build headers to forward
  const headers: Record<string, string> = {}
  if (cookie) headers['cookie'] = cookie
  if (contentType) headers['content-type'] = contentType
  if (origin) headers['origin'] = origin

  // Get request body for POST/PUT/PATCH requests
  let body: unknown = undefined
  if (['POST', 'PUT', 'PATCH'].includes(event.method)) {
    body = await readBody(event)
  }

  try {
    const response = await $fetch.raw(targetUrl, {
      method: event.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include'
    })

    // Forward set-cookie headers from Neon Auth to the client
    const setCookieHeaders = response.headers.getSetCookie?.() || []
    for (const setCookie of setCookieHeaders) {
      appendResponseHeader(event, 'set-cookie', setCookie)
    }

    return response._data
  }
  catch (error: unknown) {
    // Forward error responses from Neon Auth
    if (error && typeof error === 'object' && 'response' in error) {
      const fetchError = error as { response?: { status?: number, _data?: unknown } }
      const status = fetchError.response?.status || 500
      const data = fetchError.response?._data

      throw createError({
        statusCode: status,
        data
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to communicate with Neon Auth service'
    })
  }
})
