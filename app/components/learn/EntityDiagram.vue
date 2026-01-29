<script setup lang="ts">
interface Entity {
  name: string
  x: number
  y: number
  color: string
}

interface Relationship {
  from: string
  to: string
  label: string
  fromSide: 'left' | 'right' | 'top' | 'bottom'
  toSide: 'left' | 'right' | 'top' | 'bottom'
}

const entities: Entity[] = [
  // Product group
  { name: 'Product', x: 80, y: 80, color: '#3b82f6' },
  { name: 'ProductFeature', x: 80, y: 160, color: '#3b82f6' },
  { name: 'ProductOption', x: 80, y: 240, color: '#3b82f6' },
  // Pricing group
  { name: 'PriceBook', x: 280, y: 80, color: '#10b981' },
  { name: 'PriceBookEntry', x: 280, y: 160, color: '#10b981' },
  { name: 'PriceTier', x: 280, y: 240, color: '#10b981' },
  // Quote group
  { name: 'Quote', x: 480, y: 80, color: '#f59e0b' },
  { name: 'QuoteLineItem', x: 480, y: 160, color: '#f59e0b' },
  { name: 'AppliedDiscount', x: 480, y: 240, color: '#f59e0b' },
  // Customer group
  { name: 'Customer', x: 680, y: 80, color: '#8b5cf6' },
  // Rules group
  { name: 'Rule', x: 680, y: 180, color: '#ec4899' },
  // Discount group
  { name: 'Discount', x: 680, y: 280, color: '#ef4444' },
  { name: 'DiscountTier', x: 680, y: 360, color: '#ef4444' },
]

const relationships: Relationship[] = [
  // Product relationships
  { from: 'Product', to: 'ProductFeature', label: '1:N', fromSide: 'bottom', toSide: 'top' },
  { from: 'ProductFeature', to: 'ProductOption', label: '1:N', fromSide: 'bottom', toSide: 'top' },
  { from: 'Product', to: 'PriceBookEntry', label: '1:N', fromSide: 'right', toSide: 'left' },
  // Pricing relationships
  { from: 'PriceBook', to: 'PriceBookEntry', label: '1:N', fromSide: 'bottom', toSide: 'top' },
  { from: 'PriceBookEntry', to: 'PriceTier', label: '1:N', fromSide: 'bottom', toSide: 'top' },
  // Quote relationships
  { from: 'Quote', to: 'PriceBook', label: 'N:1', fromSide: 'left', toSide: 'right' },
  { from: 'Quote', to: 'QuoteLineItem', label: '1:N', fromSide: 'bottom', toSide: 'top' },
  { from: 'QuoteLineItem', to: 'Product', label: 'N:1', fromSide: 'left', toSide: 'right' },
  { from: 'QuoteLineItem', to: 'AppliedDiscount', label: '1:N', fromSide: 'bottom', toSide: 'top' },
  // Customer relationships
  { from: 'Customer', to: 'Quote', label: '1:N', fromSide: 'left', toSide: 'right' },
  { from: 'Customer', to: 'PriceBook', label: 'N:1', fromSide: 'left', toSide: 'right' },
  // Discount relationships
  { from: 'Discount', to: 'DiscountTier', label: '1:N', fromSide: 'bottom', toSide: 'top' },
  { from: 'Discount', to: 'AppliedDiscount', label: '1:N', fromSide: 'left', toSide: 'right' },
]

const boxWidth = 140
const boxHeight = 40

function getEntityByName(name: string): Entity | undefined {
  return entities.find((e) => e.name === name)
}

function getConnectionPoint(entity: Entity, side: 'left' | 'right' | 'top' | 'bottom') {
  switch (side) {
    case 'left':
      return { x: entity.x, y: entity.y + boxHeight / 2 }
    case 'right':
      return { x: entity.x + boxWidth, y: entity.y + boxHeight / 2 }
    case 'top':
      return { x: entity.x + boxWidth / 2, y: entity.y }
    case 'bottom':
      return { x: entity.x + boxWidth / 2, y: entity.y + boxHeight }
  }
}

function getPath(rel: Relationship): string {
  const from = getEntityByName(rel.from)
  const to = getEntityByName(rel.to)
  if (!from || !to) return ''

  const start = getConnectionPoint(from, rel.fromSide)
  const end = getConnectionPoint(to, rel.toSide)

  // Create orthogonal path based on connection sides
  const midX = (start.x + end.x) / 2
  const midY = (start.y + end.y) / 2

  // Vertical connections (bottom to top)
  if (rel.fromSide === 'bottom' && rel.toSide === 'top') {
    return `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`
  }
  // Horizontal connections (left to right or right to left)
  if ((rel.fromSide === 'left' || rel.fromSide === 'right') &&
      (rel.toSide === 'left' || rel.toSide === 'right')) {
    return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`
  }
  // Default: simple L-shaped path
  return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`
}

function getLabelPosition(rel: Relationship) {
  const from = getEntityByName(rel.from)
  const to = getEntityByName(rel.to)
  if (!from || !to) return { x: 0, y: 0 }

  const start = getConnectionPoint(from, rel.fromSide)
  const end = getConnectionPoint(to, rel.toSide)

  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2 - 5,
  }
}
</script>

<template>
  <div class="w-full overflow-x-auto">
    <svg viewBox="0 0 900 420" class="w-full min-w-[700px]" preserveAspectRatio="xMidYMid meet">
      <!-- Group labels -->
      <text x="150" y="50" class="fill-ga-gray-500 text-xs" text-anchor="middle">Products</text>
      <text x="350" y="50" class="fill-ga-gray-500 text-xs" text-anchor="middle">Pricing</text>
      <text x="550" y="50" class="fill-ga-gray-500 text-xs" text-anchor="middle">Quotes</text>
      <text x="750" y="50" class="fill-ga-gray-500 text-xs" text-anchor="middle">Customer</text>
      <text x="750" y="155" class="fill-ga-gray-500 text-xs" text-anchor="middle">Rules</text>
      <text x="750" y="255" class="fill-ga-gray-500 text-xs" text-anchor="middle">Discounts</text>

      <!-- Relationship lines -->
      <g v-for="rel in relationships" :key="`${rel.from}-${rel.to}`">
        <path
          :d="getPath(rel)"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          class="text-ga-gray-500"
        />
        <text
          :x="getLabelPosition(rel).x"
          :y="getLabelPosition(rel).y"
          class="fill-ga-gray-600 text-[10px]"
          text-anchor="middle"
        >
          {{ rel.label }}
        </text>
      </g>

      <!-- Entity boxes -->
      <g v-for="entity in entities" :key="entity.name">
        <rect
          :x="entity.x"
          :y="entity.y"
          :width="boxWidth"
          :height="boxHeight"
          :fill="entity.color"
          rx="6"
          class="opacity-90"
        />
        <text
          :x="entity.x + boxWidth / 2"
          :y="entity.y + boxHeight / 2 + 4"
          fill="white"
          class="text-xs font-medium"
          text-anchor="middle"
        >
          {{ entity.name }}
        </text>
      </g>
    </svg>
  </div>
</template>
