import type {
  QuoteLayoutSection,
  SummaryConfig,
  QuoteTheme,
  LayoutColumn,
  SectionFilter,
  ColumnField,
  ColumnAlign,
  HeaderStyle,
  SectionFilterType,
} from '~/types/quote-layout'

const VALID_COLUMN_FIELDS: ColumnField[] = [
  'productName',
  'sku',
  'description',
  'quantity',
  'unitPrice',
  'discount',
  'netPrice',
  'unit',
]

const VALID_COLUMN_ALIGNS: ColumnAlign[] = ['left', 'center', 'right']

const VALID_HEADER_STYLES: HeaderStyle[] = ['simple', 'branded', 'minimal']

const VALID_FILTER_TYPES: SectionFilterType[] = ['all', 'productType', 'category', 'custom']

export function validateLayoutColumn(column: unknown): column is LayoutColumn {
  if (!column || typeof column !== 'object') return false
  const col = column as Record<string, unknown>

  if (!col.field || !VALID_COLUMN_FIELDS.includes(col.field as ColumnField)) {
    return false
  }

  if (col.label !== undefined && typeof col.label !== 'string') return false
  if (col.width !== undefined && typeof col.width !== 'string') return false
  if (col.align !== undefined && !VALID_COLUMN_ALIGNS.includes(col.align as ColumnAlign)) {
    return false
  }

  return true
}

export function validateSectionFilter(filter: unknown): filter is SectionFilter {
  if (!filter || typeof filter !== 'object') return false
  const f = filter as Record<string, unknown>

  if (!f.type || !VALID_FILTER_TYPES.includes(f.type as SectionFilterType)) {
    return false
  }

  if (f.productTypes !== undefined && !Array.isArray(f.productTypes)) return false
  if (f.categoryIds !== undefined && !Array.isArray(f.categoryIds)) return false
  if (f.customFn !== undefined && typeof f.customFn !== 'string') return false

  return true
}

export function validateSection(section: unknown): section is QuoteLayoutSection {
  if (!section || typeof section !== 'object') return false
  const s = section as Record<string, unknown>

  if (!s.id || typeof s.id !== 'string') return false
  if (!s.name || typeof s.name !== 'string') return false
  if (s.description !== undefined && s.description !== null && typeof s.description !== 'string') return false

  if (!Array.isArray(s.columns)) return false
  for (const col of s.columns) {
    if (!validateLayoutColumn(col)) return false
  }

  if (s.filter !== undefined && s.filter !== null) {
    if (!validateSectionFilter(s.filter)) return false
  }

  if (typeof s.showSubtotal !== 'boolean') return false
  if (typeof s.sortOrder !== 'number') return false

  return true
}

export function validateSummaryConfig(config: unknown): config is SummaryConfig {
  if (!config || typeof config !== 'object') return false
  const c = config as Record<string, unknown>

  if (typeof c.showSubtotal !== 'boolean') return false
  if (typeof c.showDiscounts !== 'boolean') return false
  if (typeof c.showTaxes !== 'boolean') return false
  if (typeof c.showTotal !== 'boolean') return false

  if (c.customFields !== undefined && !Array.isArray(c.customFields)) return false

  return true
}

export function validateTheme(theme: unknown): theme is QuoteTheme {
  if (!theme || typeof theme !== 'object') return false
  const t = theme as Record<string, unknown>

  if (!t.primaryColor || typeof t.primaryColor !== 'string') return false
  if (!t.secondaryColor || typeof t.secondaryColor !== 'string') return false
  if (!t.fontFamily || typeof t.fontFamily !== 'string') return false
  if (!t.headerStyle || !VALID_HEADER_STYLES.includes(t.headerStyle as HeaderStyle)) {
    return false
  }
  if (typeof t.tableBorders !== 'boolean') return false
  if (typeof t.alternateRowColors !== 'boolean') return false

  return true
}

export interface CreateLayoutInput {
  name: string
  entityId?: string
  description?: string | null
  isTemplate?: boolean
  sections: QuoteLayoutSection[]
  summaryConfig: SummaryConfig
  theme: QuoteTheme
}

export interface UpdateLayoutInput {
  name?: string
  description?: string | null
  isTemplate?: boolean
  sections?: QuoteLayoutSection[]
  summaryConfig?: SummaryConfig
  theme?: QuoteTheme
}

export function validateCreateLayoutInput(body: unknown): { valid: true; data: CreateLayoutInput } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body is required' }
  }

  const b = body as Record<string, unknown>

  if (!b.name || typeof b.name !== 'string' || b.name.trim() === '') {
    return { valid: false, error: 'Layout name is required' }
  }

  if (b.entityId !== undefined && typeof b.entityId !== 'string') {
    return { valid: false, error: 'Entity ID must be a string' }
  }

  if (b.description !== undefined && b.description !== null && typeof b.description !== 'string') {
    return { valid: false, error: 'Description must be a string' }
  }

  if (b.isTemplate !== undefined && typeof b.isTemplate !== 'boolean') {
    return { valid: false, error: 'isTemplate must be a boolean' }
  }

  if (!Array.isArray(b.sections) || b.sections.length === 0) {
    return { valid: false, error: 'At least one section is required' }
  }

  for (let i = 0; i < b.sections.length; i++) {
    if (!validateSection(b.sections[i])) {
      return { valid: false, error: `Invalid section at index ${i}` }
    }
  }

  if (!validateSummaryConfig(b.summaryConfig)) {
    return { valid: false, error: 'Invalid summaryConfig' }
  }

  if (!validateTheme(b.theme)) {
    return { valid: false, error: 'Invalid theme' }
  }

  return {
    valid: true,
    data: {
      name: b.name.trim(),
      entityId: b.entityId as string | undefined,
      description: b.description as string | null | undefined,
      isTemplate: b.isTemplate as boolean | undefined,
      sections: b.sections as QuoteLayoutSection[],
      summaryConfig: b.summaryConfig as SummaryConfig,
      theme: b.theme as QuoteTheme,
    },
  }
}

export function validateUpdateLayoutInput(body: unknown): { valid: true; data: UpdateLayoutInput } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body is required' }
  }

  const b = body as Record<string, unknown>
  const data: UpdateLayoutInput = {}

  if (b.name !== undefined) {
    if (typeof b.name !== 'string' || b.name.trim() === '') {
      return { valid: false, error: 'Layout name must be a non-empty string' }
    }
    data.name = b.name.trim()
  }

  if (b.description !== undefined) {
    if (b.description !== null && typeof b.description !== 'string') {
      return { valid: false, error: 'Description must be a string or null' }
    }
    data.description = b.description as string | null
  }

  if (b.isTemplate !== undefined) {
    if (typeof b.isTemplate !== 'boolean') {
      return { valid: false, error: 'isTemplate must be a boolean' }
    }
    data.isTemplate = b.isTemplate
  }

  if (b.sections !== undefined) {
    if (!Array.isArray(b.sections) || b.sections.length === 0) {
      return { valid: false, error: 'Sections must be a non-empty array' }
    }
    for (let i = 0; i < b.sections.length; i++) {
      if (!validateSection(b.sections[i])) {
        return { valid: false, error: `Invalid section at index ${i}` }
      }
    }
    data.sections = b.sections as QuoteLayoutSection[]
  }

  if (b.summaryConfig !== undefined) {
    if (!validateSummaryConfig(b.summaryConfig)) {
      return { valid: false, error: 'Invalid summaryConfig' }
    }
    data.summaryConfig = b.summaryConfig as SummaryConfig
  }

  if (b.theme !== undefined) {
    if (!validateTheme(b.theme)) {
      return { valid: false, error: 'Invalid theme' }
    }
    data.theme = b.theme as QuoteTheme
  }

  return { valid: true, data }
}
