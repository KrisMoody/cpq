import type { H3Event } from 'h3'

/**
 * Get the current phase from the event context.
 * Falls back to Phase 5 if not set (should be set by middleware).
 */
export function getPhase(event: H3Event): number {
  return event.context.phase ?? 5
}

/**
 * Returns a Prisma where clause that filters records by phase.
 * Records with introducedInPhase <= phase will be included.
 *
 * @example
 * const products = await prisma.product.findMany({
 *   where: {
 *     ...phaseWhere(phase),
 *     isActive: true
 *   }
 * })
 */
export function phaseWhere(phase: number) {
  return {
    introducedInPhase: {
      lte: phase
    }
  }
}

/**
 * Adds phase filtering to existing Prisma query args.
 * Merges the phase filter into the where clause while preserving existing conditions.
 *
 * @example
 * const args = { where: { isActive: true }, include: { categories: true } }
 * const filtered = withPhaseFilter(args, phase)
 * const products = await prisma.product.findMany(filtered)
 */
export function withPhaseFilter<T extends { where?: Record<string, unknown> }>(
  args: T,
  phase: number
): T {
  return {
    ...args,
    where: {
      ...args.where,
      ...phaseWhere(phase)
    }
  }
}

/**
 * Checks if a record's phase is visible in the current phase context.
 * A record is visible if its introducedInPhase <= currentPhase.
 */
export function isRecordVisible(recordPhase: number, currentPhase: number): boolean {
  return recordPhase <= currentPhase
}

/**
 * Type augmentation for H3Event context to include phase.
 */
declare module 'h3' {
  interface H3EventContext {
    phase?: number
  }
}
