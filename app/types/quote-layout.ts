// QuoteLayout types for the layout system

export type ColumnField =
  | 'productName'
  | 'sku'
  | 'description'
  | 'quantity'
  | 'unitPrice'
  | 'discount'
  | 'netPrice'
  | 'unit'

export type ColumnAlign = 'left' | 'center' | 'right'

export type HeaderStyle = 'simple' | 'branded' | 'minimal'

export type SectionFilterType = 'all' | 'productType' | 'category' | 'custom'

export interface LayoutColumn {
  field: ColumnField
  label?: string
  width?: string
  align?: ColumnAlign
}

export interface SectionFilter {
  type: SectionFilterType
  productTypes?: string[]
  categoryIds?: string[]
  customFn?: string
}

export interface QuoteLayoutSection {
  id: string
  name: string
  description?: string
  columns: LayoutColumn[]
  filter?: SectionFilter
  showSubtotal: boolean
  sortOrder: number
}

export interface SummaryConfig {
  showSubtotal: boolean
  showDiscounts: boolean
  showTaxes: boolean
  showTotal: boolean
  customFields?: string[]
}

export interface QuoteTheme {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  headerStyle: HeaderStyle
  tableBorders: boolean
  alternateRowColors: boolean
}

export interface QuoteLayout {
  id: string
  entityId: string
  name: string
  description?: string | null
  isTemplate: boolean
  sections: QuoteLayoutSection[]
  summaryConfig: SummaryConfig
  theme: QuoteTheme
  createdAt: string
  updatedAt: string
}

export interface CreateQuoteLayoutInput {
  name: string
  entityId?: string
  description?: string
  isTemplate?: boolean
  sections: QuoteLayoutSection[]
  summaryConfig: SummaryConfig
  theme: QuoteTheme
}

export interface UpdateQuoteLayoutInput {
  name?: string
  description?: string
  isTemplate?: boolean
  sections?: QuoteLayoutSection[]
  summaryConfig?: SummaryConfig
  theme?: QuoteTheme
}

// Default values for creating new layouts
export const DEFAULT_COLUMNS: LayoutColumn[] = [
  { field: 'productName', label: 'Product', align: 'left' },
  { field: 'quantity', label: 'Qty', align: 'center', width: '80px' },
  { field: 'unitPrice', label: 'Unit Price', align: 'right', width: '120px' },
  { field: 'netPrice', label: 'Net Price', align: 'right', width: '120px' },
]

export const DEFAULT_SUMMARY_CONFIG: SummaryConfig = {
  showSubtotal: true,
  showDiscounts: true,
  showTaxes: true,
  showTotal: true,
}

export const DEFAULT_THEME: QuoteTheme = {
  primaryColor: '#1a56db',
  secondaryColor: '#6b7280',
  fontFamily: 'system-ui, sans-serif',
  headerStyle: 'simple',
  tableBorders: true,
  alternateRowColors: true,
}

export function createDefaultSection(id: string, name: string): QuoteLayoutSection {
  return {
    id,
    name,
    columns: [...DEFAULT_COLUMNS],
    showSubtotal: false,
    sortOrder: 0,
  }
}

export function createDefaultLayout(entityId: string): Omit<QuoteLayout, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    entityId,
    name: 'Default Layout',
    isTemplate: false,
    sections: [createDefaultSection('main', 'Products')],
    summaryConfig: { ...DEFAULT_SUMMARY_CONFIG },
    theme: { ...DEFAULT_THEME },
  }
}
