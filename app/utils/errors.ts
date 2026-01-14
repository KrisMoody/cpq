/**
 * Error handling utilities for type-safe error message extraction.
 *
 * Usage:
 * ```typescript
 * try {
 *   await someOperation()
 * } catch (e: unknown) {
 *   error.value = getErrorMessage(e)
 * }
 * ```
 */

/**
 * Nuxt/H3 error shape
 */
interface NuxtError {
  data?: {
    message?: string
  }
  message?: string
  statusMessage?: string
}

/**
 * Check if a value looks like a Nuxt/H3 error
 */
function isNuxtError(error: unknown): error is NuxtError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('data' in error || 'message' in error || 'statusMessage' in error)
  )
}

/**
 * Extract a human-readable error message from an unknown error.
 *
 * Handles:
 * - Standard Error instances
 * - String errors
 * - Nuxt/H3 error format ({ data: { message }, message, statusMessage })
 * - Unknown objects with a message property
 *
 * @param error - The caught error (unknown type)
 * @param fallback - Fallback message if error cannot be parsed (default: 'An error occurred')
 * @returns A string error message
 */
export function getErrorMessage(error: unknown, fallback = 'An error occurred'): string {
  // Standard Error instance
  if (error instanceof Error) {
    return error.message
  }

  // String error
  if (typeof error === 'string') {
    return error
  }

  // Nuxt/H3 error format
  if (isNuxtError(error)) {
    return error.data?.message || error.message || error.statusMessage || fallback
  }

  // Generic object with message property
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const msg = (error as { message: unknown }).message
    if (typeof msg === 'string') {
      return msg
    }
  }

  return fallback
}

/**
 * Type guard to check if an error has a specific status code.
 * Useful for handling specific HTTP errors differently.
 *
 * @param error - The caught error
 * @param statusCode - The HTTP status code to check for
 */
export function hasStatusCode(error: unknown, statusCode: number): boolean {
  if (typeof error !== 'object' || error === null) return false
  const e = error as { statusCode?: unknown; status?: unknown; data?: { statusCode?: unknown } }
  return e.statusCode === statusCode || e.status === statusCode || e.data?.statusCode === statusCode
}

/**
 * Check if an error is a 404 Not Found error
 */
export function isNotFoundError(error: unknown): boolean {
  return hasStatusCode(error, 404)
}

/**
 * Check if an error is a 400 Bad Request error
 */
export function isBadRequestError(error: unknown): boolean {
  return hasStatusCode(error, 400)
}

/**
 * Check if an error is a 401 Unauthorized error
 */
export function isUnauthorizedError(error: unknown): boolean {
  return hasStatusCode(error, 401)
}

/**
 * Check if an error is a 403 Forbidden error
 */
export function isForbiddenError(error: unknown): boolean {
  return hasStatusCode(error, 403)
}
