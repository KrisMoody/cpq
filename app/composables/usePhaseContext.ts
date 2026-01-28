import { navMappings, phases, type Phase } from '~/config/phases'

const PHASE_COOKIE_NAME = 'cpq-phase'
const DEFAULT_PHASE = 5
const MIN_PHASE = 1
const MAX_PHASE = 5

/**
 * Composable for managing the selected phase context.
 * Reads and writes the phase selection to a session cookie.
 *
 * @example
 * const { currentPhase, setPhase, isPhaseVisible } = usePhaseContext()
 *
 * // Check if current phase allows showing Phase 3 content
 * if (isPhaseVisible(3)) { ... }
 *
 * // Change to Phase 2
 * setPhase(2)
 */
export function usePhaseContext() {
  // Use Nuxt's useCookie for SSR-compatible cookie management
  const phaseCookie = useCookie<number>(PHASE_COOKIE_NAME, {
    default: () => DEFAULT_PHASE,
    // Session-level: no maxAge = expires on browser close
    watch: true
  })

  /**
   * The currently selected phase (1-5).
   * Reactive and synced with the cookie.
   */
  const currentPhase = computed<number>({
    get: () => {
      const value = phaseCookie.value
      if (typeof value !== 'number' || isNaN(value)) {
        return DEFAULT_PHASE
      }
      return Math.max(MIN_PHASE, Math.min(MAX_PHASE, value))
    },
    set: (value: number) => {
      phaseCookie.value = Math.max(MIN_PHASE, Math.min(MAX_PHASE, value))
    }
  })

  /**
   * Get the current phase details (name, color, description, etc.)
   */
  const currentPhaseDetails = computed<Phase | undefined>(() => {
    return phases.find(p => p.number === currentPhase.value)
  })

  /**
   * Semantic feature flags indicating which CPQ features are available
   * at the current phase. Use these in templates for conditional rendering.
   *
   * @example
   * const { features } = usePhaseContext()
   * <CpqQuoteDiscountsCard v-if="features.discounts" />
   */
  const features = computed(() => ({
    // Phase 2 features
    bundles: currentPhase.value >= 2,
    discounts: currentPhase.value >= 2,
    unitsOfMeasure: currentPhase.value >= 2,
    // Phase 3 features
    subscriptions: currentPhase.value >= 3,
    contracts: currentPhase.value >= 3,
    taxes: currentPhase.value >= 3,
    // Phase 4 features
    attributes: currentPhase.value >= 4,
    rules: currentPhase.value >= 4,
    // Phase 5 features
    affinities: currentPhase.value >= 5,
    questionnaires: currentPhase.value >= 5,
    quoteLayouts: currentPhase.value >= 5,
  }))

  /**
   * Set the current phase.
   * @param phaseNumber - Phase to switch to (1-5)
   */
  function setPhase(phaseNumber: number) {
    currentPhase.value = phaseNumber
  }

  /**
   * Check if a phase is visible (enabled) based on current selection.
   * A phase is visible if it's <= the current phase.
   * @param phaseNumber - Phase to check
   */
  function isPhaseVisible(phaseNumber: number): boolean {
    return phaseNumber <= currentPhase.value
  }

  /**
   * Check if a navigation path is visible based on current phase.
   * Uses the navMappings from phases config.
   * @param path - Navigation path to check (e.g., '/products', '/discounts')
   */
  function isNavPathVisible(path: string): boolean {
    // Normalize path - get the base path
    const basePath = '/' + path.split('/').filter(Boolean)[0]
    const mapping = navMappings.find(m => m.path === basePath)

    // If no mapping found, default to visible (Phase 1 content)
    if (!mapping) return true

    return isPhaseVisible(mapping.phase)
  }

  /**
   * Get the minimum phase required for a navigation path.
   * @param path - Navigation path to check
   * @returns Phase number required, or 1 if not mapped
   */
  function getPhaseForNavPath(path: string): number {
    const basePath = '/' + path.split('/').filter(Boolean)[0]
    const mapping = navMappings.find(m => m.path === basePath)
    return mapping?.phase ?? 1
  }

  /**
   * Filter an array of navigation items based on current phase.
   * Items must have a `to` or `path` property.
   */
  function filterNavItems<T extends { to?: string; path?: string }>(items: T[]): T[] {
    return items.filter(item => {
      const path = item.to || item.path
      if (!path) return true
      return isNavPathVisible(path)
    })
  }

  return {
    // State
    currentPhase,
    currentPhaseDetails,
    features,

    // Actions
    setPhase,

    // Helpers
    isPhaseVisible,
    isNavPathVisible,
    getPhaseForNavPath,
    filterNavItems,

    // Constants (for components that need them)
    phases,
    PHASE_COOKIE_NAME,
    DEFAULT_PHASE,
    MIN_PHASE,
    MAX_PHASE
  }
}
