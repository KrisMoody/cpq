/**
 * Composable for type-safe route parameter access.
 *
 * Replaces unsafe patterns like `route.params.id as string` with validated access
 * that throws appropriate errors for missing or invalid parameters.
 */

/**
 * Get a required route parameter as a string.
 * Throws a 400 error if the parameter is missing or not a string.
 *
 * @param name - The parameter name to retrieve
 * @returns The parameter value as a string
 * @throws 400 error if parameter is missing or invalid
 *
 * @example
 * ```typescript
 * // In a page component
 * const productId = useRequiredParam('id')
 * ```
 */
export function useRequiredParam(name: string): string {
  const route = useRoute()
  const param = route.params[name]

  if (typeof param !== 'string' || !param) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required route parameter: ${name}`,
    })
  }

  return param
}

/**
 * Get an optional route parameter as a string or null.
 * Returns null if the parameter is missing.
 *
 * @param name - The parameter name to retrieve
 * @returns The parameter value as a string, or null if missing
 *
 * @example
 * ```typescript
 * const tab = useOptionalParam('tab')
 * if (tab) {
 *   // Use the tab parameter
 * }
 * ```
 */
export function useOptionalParam(name: string): string | null {
  const route = useRoute()
  const param = route.params[name]

  if (typeof param === 'string' && param) {
    return param
  }

  return null
}

/**
 * Get a required route parameter and parse it as an integer.
 * Throws a 400 error if the parameter is missing or not a valid integer.
 *
 * @param name - The parameter name to retrieve
 * @returns The parameter value as an integer
 * @throws 400 error if parameter is missing or not a valid integer
 *
 * @example
 * ```typescript
 * const page = useRequiredIntParam('page')
 * ```
 */
export function useRequiredIntParam(name: string): number {
  const value = useRequiredParam(name)
  const parsed = parseInt(value, 10)

  if (isNaN(parsed)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Route parameter '${name}' must be an integer`,
    })
  }

  return parsed
}

/**
 * Get a required query parameter as a string.
 * Throws a 400 error if the query parameter is missing.
 *
 * @param name - The query parameter name to retrieve
 * @returns The query parameter value as a string
 * @throws 400 error if query parameter is missing
 */
export function useRequiredQuery(name: string): string {
  const route = useRoute()
  const query = route.query[name]

  if (typeof query !== 'string' || !query) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required query parameter: ${name}`,
    })
  }

  return query
}

/**
 * Get an optional query parameter as a string or null.
 *
 * @param name - The query parameter name to retrieve
 * @returns The query parameter value as a string, or null if missing
 */
export function useOptionalQuery(name: string): string | null {
  const route = useRoute()
  const query = route.query[name]

  if (typeof query === 'string' && query) {
    return query
  }

  return null
}
