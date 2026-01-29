<script setup lang="ts">
const {
  phases,
  entitiesForPhase,
  gaEntityMappings,
  integrationStrategies,
  extensibilityPatterns,
  getMermaidDiagram,
  getContentForStrategy,
  decisionsByPhase,
} = usePhase();

const selectedPhase = ref<number | null>(null);
const selectedStrategy = ref<string | null>(null);
const activeDiagramTab = ref("dataModel");

// Phase selection handler
function handlePhaseSelect(phaseNumber: number) {
  selectedPhase.value =
    selectedPhase.value === phaseNumber ? null : phaseNumber;
}

// Strategy selection handler
function handleStrategySelect(strategyId: string | null) {
  selectedStrategy.value = strategyId;
}

// Computed: Active extensibility patterns based on strategy
const activeExtensibilityPatterns = computed(() => {
  if (!selectedStrategy.value) return extensibilityPatterns;
  const strategyContent = getContentForStrategy(
    selectedStrategy.value as "extend" | "reference" | "hybrid",
  );
  return strategyContent.extensibilityPatterns;
});

// Computed: Active decisions based on strategy
const activeDecisions = computed(() => {
  if (!selectedStrategy.value) return decisionsByPhase;
  const strategyContent = getContentForStrategy(
    selectedStrategy.value as "extend" | "reference" | "hybrid",
  );
  return strategyContent.decisions.reduce(
    (acc, d) => {
      const existing = acc.find((a) => a.phase === d.phase);
      if (existing) {
        existing.decisions.push(`${d.question} (${d.options.join(", ")})`);
      } else {
        acc.push({
          phase: d.phase,
          title: `Phase ${d.phase} Decisions`,
          decisions: [`${d.question} (${d.options.join(", ")})`],
        });
      }
      return acc;
    },
    [] as { phase: number; title: string; decisions: string[] }[],
  );
});

// Computed: Entity notes for selected strategy
const strategyEntityNotes = computed(() => {
  if (!selectedStrategy.value) return {};
  const content = getContentForStrategy(
    selectedStrategy.value as "extend" | "reference" | "hybrid",
  );
  return content.entityNotes;
});

// Computed: Entity extensions for selected strategy
const strategyEntityExtensions = computed(() => {
  if (!selectedStrategy.value) return [];
  const content = getContentForStrategy(
    selectedStrategy.value as "extend" | "reference" | "hybrid",
  );
  return content.entityExtensions;
});

// Computed: Implications for selected strategy
const strategyImplications = computed(() => {
  if (!selectedStrategy.value) return null;
  const content = getContentForStrategy(
    selectedStrategy.value as "extend" | "reference" | "hybrid",
  );
  return content.implications;
});

// State for expanded extension cards
const expandedExtension = ref<string | null>(null);

function toggleExtension(gaEntity: string) {
  expandedExtension.value =
    expandedExtension.value === gaEntity ? null : gaEntity;
}

// Computed: Active diagram based on tab and phase
const activeDiagram = computed(() => {
  return getMermaidDiagram(
    activeDiagramTab.value as "dataModel" | "domainFlow" | "gaIntegration",
    selectedPhase.value || undefined,
  );
});

// Computed: Entity counts per phase for chart
const entityCounts = computed(() =>
  phases.map((p) => entitiesForPhase(p.number).length),
);

// Helper for entity routes
function getEntityRoute(entity: string): string | null {
  const routes: Record<string, string> = {
    Product: "/products",
    Category: "/categories",
    Customer: "/customers",
    PriceBook: "/price-books",
    Quote: "/quotes",
    Currency: "/currencies",
    Discount: "/discounts",
    UnitOfMeasure: "/units",
    Contract: "/contracts",
    TaxRate: "/tax-rates",
    Attribute: "/attributes",
    Rule: "/rules",
    Questionnaire: "/questionnaires",
    ProductAffinity: "/affinities",
    QuoteLayout: "/quote-layouts",
  };
  return routes[entity] || null;
}

function getRelationshipBadgeColor(
  relationship?: string,
): "success" | "info" | "warning" | "primary" | "neutral" {
  if (!relationship) return "neutral";
  const colors: Record<
    string,
    "success" | "info" | "warning" | "primary" | "neutral"
  > = {
    reference: "info",
    "outputs-to": "success",
    "maps-to": "primary",
    "different-purpose": "warning",
    new: "neutral",
  };
  return colors[relationship] || "neutral";
}

useHead({
  title: "Release Roadmap - Learn CPQ",
});
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <div class="flex items-center gap-2 mb-2">
        <NuxtLink
          to="/learn"
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <h1 class="text-2xl font-bold">Release Roadmap</h1>
      </div>
      <p class="text-gray-500 dark:text-gray-400">
        CPQ implementation phases for incremental development into GetAccept
      </p>
    </div>

    <!-- Phase Cards with Metrics -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Phase Cards -->
      <div class="lg:col-span-2 space-y-4">
        <h2 class="text-lg font-semibold">Release Phases</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Click a phase to filter diagrams below. Expand cards for details.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <RoadmapPhaseDetailCard
            v-for="phase in phases"
            :key="phase.number"
            :phase="phase"
            :entity-count="entitiesForPhase(phase.number).length"
            :is-selected="selectedPhase === phase.number"
            @select="handlePhaseSelect"
          />
        </div>
      </div>

      <!-- Entity Distribution Chart -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold">Entity Distribution</h2>
        <UCard>
          <RoadmapPhaseMetricsChart
            :phases="phases"
            :entity-counts="entityCounts"
          />
        </UCard>
      </div>
    </div>

    <!-- Entity List for Selected Phase -->
    <UCard v-if="selectedPhase">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <PhaseBadge :phase="selectedPhase" />
            <h3 class="font-semibold">
              {{ phases.find((p) => p.number === selectedPhase)?.name }}
              Entities
            </h3>
          </div>
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-x-mark"
            @click="selectedPhase = null"
          />
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="entity in entitiesForPhase(selectedPhase)"
          :key="entity.entity"
          class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
        >
          <div class="flex items-center justify-between mb-1">
            <NuxtLink
              v-if="getEntityRoute(entity.entity)"
              :to="getEntityRoute(entity.entity)!"
              class="font-medium text-primary-600 hover:underline"
            >
              {{ entity.entity }}
            </NuxtLink>
            <span v-else class="font-medium">{{ entity.entity }}</span>
            <UBadge
              v-if="entity.relationship"
              :color="getRelationshipBadgeColor(entity.relationship)"
              variant="subtle"
              size="xs"
            >
              {{ entity.relationship }}
            </UBadge>
          </div>
          <p v-if="entity.gaEntity" class="text-xs text-gray-500">
            GA: {{ entity.gaEntity }}
          </p>
          <p
            v-if="entity.extensibilityNotes"
            class="text-xs text-gray-400 mt-1"
          >
            {{ entity.extensibilityNotes }}
          </p>
          <!-- Strategy-specific notes -->
          <p
            v-if="strategyEntityNotes[entity.entity]"
            class="text-xs text-primary-600 dark:text-primary-400 mt-2 p-1.5 bg-primary-50 dark:bg-primary-900/30 rounded"
          >
            <strong>{{ selectedStrategy }} strategy:</strong>
            {{ strategyEntityNotes[entity.entity] }}
          </p>
        </div>
      </div>
    </UCard>

    <!-- Entity Relationship Diagrams -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Entity Relationship Diagrams</h3>
          <div v-if="selectedPhase" class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Showing:</span>
            <PhaseBadge :phase="selectedPhase" size="sm" />
          </div>
        </div>
      </template>

      <UTabs
        v-model="activeDiagramTab"
        :items="[
          { label: 'Data Model', value: 'dataModel' },
          { label: 'Domain Flow', value: 'domainFlow' },
          { label: 'GA Integration', value: 'gaIntegration' },
        ]"
        class="mb-4"
      />

      <div
        class="border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-900"
      >
        <RoadmapMermaidDiagram
          :id="`diagram-${activeDiagramTab}-${selectedPhase || 'all'}`"
          :diagram="activeDiagram"
        />
      </div>

      <p class="text-xs text-gray-500 mt-3">
        <template v-if="activeDiagramTab === 'dataModel'">
          Entity relationships from the Prisma schema. Shows foreign keys and
          cardinality.
        </template>
        <template v-else-if="activeDiagramTab === 'domainFlow'">
          Business process flow for the selected phase.
        </template>
        <template v-else>
          How CPQ entities map to GetAccept entities. Dashed lines indicate
          references, solid lines indicate data output.
        </template>
      </p>
    </UCard>

    <!-- GA Entity Mapping Table -->
    <UCard>
      <template #header>
        <h3 class="font-semibold">CPQ to GetAccept Entity Mapping</h3>
      </template>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
              >
                CPQ Entity
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
              >
                GA Entity
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Relationship
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Phase
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="mapping in gaEntityMappings" :key="mapping.cpqEntity">
              <td class="px-4 py-2 font-medium">{{ mapping.cpqEntity }}</td>
              <td class="px-4 py-2 text-gray-600 dark:text-gray-400">
                {{ mapping.gaEntity }}
              </td>
              <td class="px-4 py-2 text-sm text-gray-500">
                {{ mapping.relationship }}
              </td>
              <td class="px-4 py-2">
                <PhaseBadge :phase="mapping.phase" size="sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Integration Strategy Options -->
    <UCard>
      <template #header>
        <h3 class="font-semibold">Integration Strategy Options</h3>
      </template>

      <RoadmapStrategySelector
        :strategies="integrationStrategies"
        :selected-strategy="selectedStrategy"
        @select="handleStrategySelect"
      />
    </UCard>

    <!-- Entity Extension Examples (visible when strategy selected) -->
    <UCard v-if="selectedStrategy && strategyEntityExtensions.length > 0">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">
            GA Entity Extensions: {{ selectedStrategy }} Strategy
          </h3>
          <UBadge color="primary" variant="subtle">
            {{ strategyEntityExtensions.length }} entities
          </UBadge>
        </div>
      </template>

      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        How GetAccept entities would be extended or referenced under the
        <strong>{{ selectedStrategy }}</strong> strategy. Click to expand schema
        details.
      </p>

      <div class="space-y-3">
        <div
          v-for="ext in strategyEntityExtensions"
          :key="ext.gaEntity"
          class="border rounded-lg dark:border-gray-700 overflow-hidden"
        >
          <!-- Header (clickable) -->
          <button
            class="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            @click="toggleExtension(ext.gaEntity)"
          >
            <div>
              <h4 class="font-medium">{{ ext.gaEntity }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ ext.description }}
              </p>
            </div>
            <UIcon
              :name="
                expandedExtension === ext.gaEntity
                  ? 'i-heroicons-chevron-up'
                  : 'i-heroicons-chevron-down'
              "
              class="w-5 h-5 text-gray-400"
            />
          </button>

          <!-- Expanded content -->
          <div
            v-if="expandedExtension === ext.gaEntity"
            class="border-t dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50"
          >
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <!-- Current Schema -->
              <div>
                <h5
                  class="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1"
                >
                  <UIcon name="i-heroicons-document" class="w-3 h-3" />
                  Current GA Schema
                </h5>
                <pre
                  class="text-xs bg-white dark:bg-gray-900 p-3 rounded border dark:border-gray-700 overflow-x-auto"
                  >{{ ext.currentSchema }}</pre
                >
              </div>

              <!-- Extended Schema -->
              <div>
                <h5
                  class="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase mb-2 flex items-center gap-1"
                >
                  <UIcon name="i-heroicons-plus-circle" class="w-3 h-3" />
                  With {{ selectedStrategy }} Strategy
                </h5>
                <pre
                  class="text-xs bg-white dark:bg-gray-900 p-3 rounded border-2 border-primary-200 dark:border-primary-800 overflow-x-auto"
                  >{{ ext.extendedSchema }}</pre
                >
              </div>
            </div>

            <!-- Implications -->
            <div>
              <h5
                class="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1"
              >
                <UIcon
                  name="i-heroicons-exclamation-triangle"
                  class="w-3 h-3"
                />
                Implications
              </h5>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li
                  v-for="implication in ext.implications"
                  :key="implication"
                  class="flex items-start gap-2"
                >
                  <UIcon
                    name="i-heroicons-arrow-right"
                    class="w-4 h-4 mt-0.5 text-gray-400 shrink-0"
                  />
                  {{ implication }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Strategy Implications Summary (visible when strategy selected) -->
    <UCard v-if="selectedStrategy && strategyImplications">
      <template #header>
        <h3 class="font-semibold">
          {{ selectedStrategy }} Strategy: Pros, Cons & Considerations
        </h3>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Positive -->
        <div>
          <h4
            class="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-1"
          >
            <UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
            Benefits
          </h4>
          <ul class="space-y-2">
            <li
              v-for="item in strategyImplications.positive"
              :key="item"
              class="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
            >
              <span class="text-green-500">+</span>
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- Negative -->
        <div>
          <h4
            class="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-1"
          >
            <UIcon name="i-heroicons-x-circle" class="w-4 h-4" />
            Drawbacks
          </h4>
          <ul class="space-y-2">
            <li
              v-for="item in strategyImplications.negative"
              :key="item"
              class="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
            >
              <span class="text-red-500">-</span>
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- Considerations -->
        <div>
          <h4
            class="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1"
          >
            <UIcon name="i-heroicons-light-bulb" class="w-4 h-4" />
            Key Considerations
          </h4>
          <ul class="space-y-2">
            <li
              v-for="item in strategyImplications.considerations"
              :key="item"
              class="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
            >
              <span class="text-amber-500">!</span>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </UCard>

    <!-- Extensibility Patterns (reactive to strategy) -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Extensibility Patterns</h3>
          <UBadge v-if="selectedStrategy" color="primary" variant="subtle">
            {{ selectedStrategy }} strategy patterns
          </UBadge>
        </div>
      </template>

      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <template v-if="selectedStrategy">
          Patterns specific to the
          <strong>{{ selectedStrategy }}</strong> integration strategy.
        </template>
        <template v-else>
          These patterns are used throughout the POC to ensure future GetAccept
          integration is smooth.
        </template>
      </p>

      <div class="space-y-4">
        <div
          v-for="pattern in activeExtensibilityPatterns"
          :key="pattern.name"
          class="border-l-4 border-primary-500 pl-4"
        >
          <h4 class="font-medium">{{ pattern.name }}</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {{ pattern.description }}
          </p>
          <pre
            class="text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-x-auto"
            >{{ pattern.example }}</pre
          >
        </div>
      </div>
    </UCard>

    <!-- Decisions Needed (reactive to strategy) -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Decisions Needed</h3>
          <UBadge v-if="selectedStrategy" color="primary" variant="subtle">
            {{ selectedStrategy }} strategy decisions
          </UBadge>
        </div>
      </template>

      <div class="space-y-4">
        <div v-for="group in activeDecisions" :key="group.phase">
          <h4 class="font-medium text-sm mb-2 flex items-center gap-2">
            {{ group.title }}
            <PhaseBadge :phase="group.phase" size="sm" />
          </h4>
          <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li v-for="decision in group.decisions" :key="decision">
              {{ decision }}
            </li>
          </ul>
        </div>
      </div>
    </UCard>
  </div>
</template>
