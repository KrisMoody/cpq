import type {
  QuoteLayout,
  QuoteLayoutSection,
  SummaryConfig,
  QuoteTheme,
  LayoutColumn,
  SectionFilter,
  ColumnField,
} from '~/types/quote-layout'
import {
  DEFAULT_COLUMNS,
  DEFAULT_SUMMARY_CONFIG,
  DEFAULT_THEME,
  createDefaultSection,
} from '~/types/quote-layout'
import type { QuoteWithLineItems } from '~/composables/useQuotes'
import { generateSampleQuote } from '~/utils/sample-quote-data'

export interface LayoutBuilderState {
  layout: QuoteLayout
  originalLayout: QuoteLayout | null
  isDirty: boolean
  previewQuote: QuoteWithLineItems
  activeSection: string | null
  expandedSections: Set<string>
}

function createEmptyLayout(): QuoteLayout {
  return {
    id: '',
    entityId: 'default',
    name: '',
    description: null,
    isTemplate: true,
    sections: [createDefaultSection('main', 'Products')],
    summaryConfig: { ...DEFAULT_SUMMARY_CONFIG },
    theme: { ...DEFAULT_THEME },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function useLayoutBuilder() {
  // State
  const layout = ref<QuoteLayout>(createEmptyLayout())
  const originalLayout = ref<QuoteLayout | null>(null)
  const activeSection = ref<string | null>(null)
  const expandedSections = ref<Set<string>>(new Set(['main']))
  const saving = ref(false)
  const error = ref<string | null>(null)

  // Generate sample quote for preview
  const previewQuote = computed<QuoteWithLineItems>(() => {
    return generateSampleQuote()
  })

  // Dirty checking
  const isDirty = computed(() => {
    if (!originalLayout.value) return false
    return JSON.stringify(layout.value) !== JSON.stringify(originalLayout.value)
  })

  // Initialize with existing layout or create new
  function initLayout(existingLayout?: QuoteLayout) {
    if (existingLayout) {
      layout.value = JSON.parse(JSON.stringify(existingLayout))
      originalLayout.value = JSON.parse(JSON.stringify(existingLayout))
      // Expand the first section by default
      if (existingLayout.sections.length > 0) {
        expandedSections.value = new Set([existingLayout.sections[0]!.id])
      }
    } else {
      layout.value = createEmptyLayout()
      originalLayout.value = null
      expandedSections.value = new Set(['main'])
    }
  }

  // Reset to original
  function reset() {
    if (originalLayout.value) {
      layout.value = JSON.parse(JSON.stringify(originalLayout.value))
    } else {
      layout.value = createEmptyLayout()
    }
  }

  // Section management
  function addSection() {
    const id = `section-${Date.now()}`
    const newSection: QuoteLayoutSection = {
      id,
      name: `Section ${layout.value.sections.length + 1}`,
      columns: [...DEFAULT_COLUMNS],
      showSubtotal: false,
      sortOrder: layout.value.sections.length,
    }
    layout.value.sections.push(newSection)
    expandedSections.value.add(id)
    activeSection.value = id
  }

  function removeSection(sectionId: string) {
    const index = layout.value.sections.findIndex((s) => s.id === sectionId)
    if (index === -1) return
    if (layout.value.sections.length <= 1) return

    layout.value.sections.splice(index, 1)
    expandedSections.value.delete(sectionId)
    if (activeSection.value === sectionId) {
      activeSection.value = null
    }
    // Recalculate sort orders
    layout.value.sections.forEach((s, i) => {
      s.sortOrder = i
    })
  }

  function updateSection(sectionId: string, updates: Partial<QuoteLayoutSection>) {
    const section = layout.value.sections.find((s) => s.id === sectionId)
    if (section) {
      Object.assign(section, updates)
    }
  }

  function reorderSections(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return
    if (fromIndex < 0 || toIndex < 0) return
    if (fromIndex >= layout.value.sections.length || toIndex >= layout.value.sections.length) return

    const [removed] = layout.value.sections.splice(fromIndex, 1)
    if (removed) {
      layout.value.sections.splice(toIndex, 0, removed)
      // Update sort orders
      layout.value.sections.forEach((s, i) => {
        s.sortOrder = i
      })
    }
  }

  function toggleSection(sectionId: string) {
    if (expandedSections.value.has(sectionId)) {
      expandedSections.value.delete(sectionId)
    } else {
      expandedSections.value.add(sectionId)
    }
    expandedSections.value = new Set(expandedSections.value) // Trigger reactivity
  }

  // Column management
  function updateSectionColumns(sectionId: string, columns: LayoutColumn[]) {
    const section = layout.value.sections.find((s) => s.id === sectionId)
    if (section) {
      section.columns = columns
    }
  }

  function addColumnToSection(sectionId: string, field: ColumnField) {
    const section = layout.value.sections.find((s) => s.id === sectionId)
    if (!section) return

    // Don't add duplicate columns
    if (section.columns.some((c) => c.field === field)) return

    const defaultLabels: Record<ColumnField, { label: string; align: 'left' | 'center' | 'right'; width?: string }> = {
      productName: { label: 'Product', align: 'left' },
      sku: { label: 'SKU', align: 'left', width: '100px' },
      description: { label: 'Description', align: 'left' },
      quantity: { label: 'Qty', align: 'center', width: '80px' },
      unitPrice: { label: 'Unit Price', align: 'right', width: '120px' },
      discount: { label: 'Discount', align: 'right', width: '100px' },
      netPrice: { label: 'Net Price', align: 'right', width: '120px' },
      unit: { label: 'Unit', align: 'center', width: '80px' },
    }

    const config = defaultLabels[field]
    section.columns.push({
      field,
      label: config.label,
      align: config.align,
      width: config.width,
    })
  }

  function removeColumnFromSection(sectionId: string, field: ColumnField) {
    const section = layout.value.sections.find((s) => s.id === sectionId)
    if (!section) return

    const index = section.columns.findIndex((c) => c.field === field)
    if (index !== -1) {
      section.columns.splice(index, 1)
    }
  }

  function reorderColumns(sectionId: string, fromIndex: number, toIndex: number) {
    const section = layout.value.sections.find((s) => s.id === sectionId)
    if (!section) return
    if (fromIndex === toIndex) return
    if (fromIndex < 0 || toIndex < 0) return
    if (fromIndex >= section.columns.length || toIndex >= section.columns.length) return

    const [removed] = section.columns.splice(fromIndex, 1)
    if (removed) {
      section.columns.splice(toIndex, 0, removed)
    }
  }

  // Filter management
  function updateSectionFilter(sectionId: string, filter: SectionFilter | undefined) {
    const section = layout.value.sections.find((s) => s.id === sectionId)
    if (section) {
      section.filter = filter
    }
  }

  // Theme management
  function updateTheme(updates: Partial<QuoteTheme>) {
    Object.assign(layout.value.theme, updates)
  }

  function applyThemePreset(preset: 'professional' | 'modern' | 'minimal' | 'classic') {
    const presets: Record<string, QuoteTheme> = {
      professional: {
        primaryColor: '#1a56db',
        secondaryColor: '#6b7280',
        fontFamily: 'system-ui, sans-serif',
        headerStyle: 'simple',
        tableBorders: true,
        alternateRowColors: true,
      },
      modern: {
        primaryColor: '#7c3aed',
        secondaryColor: '#a78bfa',
        fontFamily: 'Inter, system-ui, sans-serif',
        headerStyle: 'branded',
        tableBorders: false,
        alternateRowColors: true,
      },
      minimal: {
        primaryColor: '#374151',
        secondaryColor: '#9ca3af',
        fontFamily: 'system-ui, sans-serif',
        headerStyle: 'minimal',
        tableBorders: false,
        alternateRowColors: false,
      },
      classic: {
        primaryColor: '#1e40af',
        secondaryColor: '#3b82f6',
        fontFamily: 'Georgia, serif',
        headerStyle: 'simple',
        tableBorders: true,
        alternateRowColors: true,
      },
    }

    const presetTheme = presets[preset]
    if (presetTheme) {
      layout.value.theme = { ...presetTheme }
    }
  }

  // Summary config management
  function updateSummaryConfig(updates: Partial<SummaryConfig>) {
    Object.assign(layout.value.summaryConfig, updates)
  }

  // Confirm navigation
  function confirmLeave(): boolean {
    if (!isDirty.value) return true
    return confirm('You have unsaved changes. Are you sure you want to leave?')
  }

  // Available columns for picker
  const availableColumns: { field: ColumnField; label: string; description: string }[] = [
    { field: 'productName', label: 'Product Name', description: 'Name of the product' },
    { field: 'sku', label: 'SKU', description: 'Product SKU code' },
    { field: 'description', label: 'Description', description: 'Product description' },
    { field: 'quantity', label: 'Quantity', description: 'Line item quantity' },
    { field: 'unitPrice', label: 'Unit Price', description: 'Price per unit' },
    { field: 'discount', label: 'Discount', description: 'Applied discount amount' },
    { field: 'netPrice', label: 'Net Price', description: 'Final price after discount' },
    { field: 'unit', label: 'Unit', description: 'Unit of measure' },
  ]

  return {
    // State
    layout,
    originalLayout,
    activeSection,
    expandedSections,
    previewQuote,
    isDirty,
    saving,
    error,

    // Initialization
    initLayout,
    reset,

    // Section management
    addSection,
    removeSection,
    updateSection,
    reorderSections,
    toggleSection,

    // Column management
    updateSectionColumns,
    addColumnToSection,
    removeColumnFromSection,
    reorderColumns,
    availableColumns,

    // Filter management
    updateSectionFilter,

    // Theme management
    updateTheme,
    applyThemePreset,

    // Summary config management
    updateSummaryConfig,

    // Navigation
    confirmLeave,
  }
}
