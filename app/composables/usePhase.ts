import {
  getPhase,
  getPhaseByEntity,
  getPhaseByPath,
  getEntityMapping,
  getEntitiesForPhase,
  phases,
  entityMappings,
  gaEntityMappings,
  integrationStrategies,
  extensibilityPatterns,
  mermaidDiagrams,
  strategyContent,
  decisionsByPhase,
  type Phase,
  type EntityMapping,
  type StrategyContent,
} from "~/config/phases";

/**
 * Composable for accessing phase information throughout the app.
 *
 * @example
 * // Get phase by entity name
 * const { phaseForEntity } = usePhase()
 * const productPhase = phaseForEntity('Product') // Phase 1
 *
 * @example
 * // Get phase from current route
 * const { phaseForCurrentRoute } = usePhase()
 * const currentPhase = phaseForCurrentRoute() // Based on route path
 */
export function usePhase() {
  const route = useRoute();

  /**
   * Get phase for a specific entity name
   */
  function phaseForEntity(entityName: string): Phase | undefined {
    return getPhaseByEntity(entityName);
  }

  /**
   * Get phase for a specific path
   */
  function phaseForPath(path: string): Phase | undefined {
    return getPhaseByPath(path);
  }

  /**
   * Get phase for the current route
   */
  function phaseForCurrentRoute(): Phase | undefined {
    return getPhaseByPath(route.path);
  }

  /**
   * Get entity mapping with GA integration info
   */
  function entityMapping(entityName: string): EntityMapping | undefined {
    return getEntityMapping(entityName);
  }

  /**
   * Get all entities for a specific phase
   */
  function entitiesForPhase(phaseNumber: number): EntityMapping[] {
    return getEntitiesForPhase(phaseNumber);
  }

  /**
   * Get phase by number
   */
  function phase(phaseNumber: number): Phase | undefined {
    return getPhase(phaseNumber);
  }

  /**
   * Check if current route is in a specific phase
   */
  function isCurrentRouteInPhase(phaseNumber: number): boolean {
    const currentPhase = phaseForCurrentRoute();
    return currentPhase?.number === phaseNumber;
  }

  /**
   * Get content filtered by strategy selection
   */
  function getContentForStrategy(
    strategyId: "extend" | "reference" | "hybrid",
  ): StrategyContent {
    return strategyContent[strategyId] as StrategyContent;
  }

  /**
   * Get Mermaid diagram by type and optional phase
   */
  function getMermaidDiagram(
    type: "dataModel" | "domainFlow" | "gaIntegration",
    phaseNumber?: number,
  ): string {
    if (type === "gaIntegration") {
      return mermaidDiagrams.gaIntegration;
    }
    const diagrams = mermaidDiagrams[type] as Record<number | string, string>;
    if (phaseNumber && diagrams[phaseNumber]) {
      return diagrams[phaseNumber];
    }
    // Return "all" diagram for dataModel if no phase selected
    if (type === "dataModel" && !phaseNumber) {
      return mermaidDiagrams.dataModel.all;
    }
    // For domainFlow without phase, return phase 1 as default
    return diagrams[1] || "";
  }

  /**
   * Get phase details including goals and deliverables
   */
  function getPhaseDetails(phaseNumber: number) {
    const p = getPhase(phaseNumber);
    if (!p) return null;
    return {
      ...p,
      entityCount: getEntitiesForPhase(phaseNumber).length,
    };
  }

  return {
    // Functions
    phaseForEntity,
    phaseForPath,
    phaseForCurrentRoute,
    entityMapping,
    entitiesForPhase,
    phase,
    isCurrentRouteInPhase,
    getContentForStrategy,
    getMermaidDiagram,
    getPhaseDetails,

    // Static data (for roadmap page)
    phases,
    entityMappings,
    gaEntityMappings,
    integrationStrategies,
    extensibilityPatterns,
    mermaidDiagrams,
    strategyContent,
    decisionsByPhase,
  };
}
