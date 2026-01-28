import { getCookie } from 'h3'

const PHASE_COOKIE_NAME = 'cpq-phase'
const DEFAULT_PHASE = 5
const MIN_PHASE = 1
const MAX_PHASE = 5

/**
 * Server middleware that extracts the selected phase from the cpq-phase cookie.
 * The phase is stored in event.context.phase for use in API route handlers.
 *
 * Default behavior:
 * - If no cookie exists, defaults to Phase 5 (full experience)
 * - Invalid values are clamped to valid range (1-5)
 */
export default defineEventHandler((event) => {
  const cookieValue = getCookie(event, PHASE_COOKIE_NAME)

  let phase = DEFAULT_PHASE

  if (cookieValue) {
    const parsed = parseInt(cookieValue, 10)
    if (!isNaN(parsed)) {
      phase = Math.max(MIN_PHASE, Math.min(MAX_PHASE, parsed))
    }
  }

  event.context.phase = phase
})
