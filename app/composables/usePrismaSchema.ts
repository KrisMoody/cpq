export interface ParsedField {
  name: string
  type: string
  isRequired: boolean
  isPrimaryKey: boolean
  isForeignKey: boolean
  isUnique: boolean
  hasDefault: boolean
  relatedModel?: string
}

export interface ParsedRelation {
  fieldName: string
  relatedModel: string
  relationType: '1:1' | '1:N' | 'N:1' | 'N:N'
  foreignKey?: string
}

export interface ParsedModel {
  name: string
  fields: ParsedField[]
  relations: ParsedRelation[]
}

export interface ParsedEnum {
  name: string
  values: string[]
}

export interface ParsedSchema {
  models: ParsedModel[]
  enums: ParsedEnum[]
}

// Domain color mapping (matches EntityDiagram.vue)
export const domainColors: Record<string, string> = {
  // Product domain
  Product: '#3b82f6',
  ProductFeature: '#3b82f6',
  ProductOption: '#3b82f6',
  ProductCategory: '#3b82f6',
  Category: '#3b82f6',
  // Pricing domain
  PriceBook: '#10b981',
  PriceBookEntry: '#10b981',
  PriceTier: '#10b981',
  Currency: '#10b981',
  ExchangeRate: '#10b981',
  // Quote domain
  Quote: '#f59e0b',
  QuoteLineItem: '#f59e0b',
  AppliedDiscount: '#f59e0b',
  // Customer domain
  Customer: '#8b5cf6',
  Contract: '#8b5cf6',
  ContractPriceEntry: '#8b5cf6',
  // Rules domain
  Rule: '#ec4899',
  // Discount domain
  Discount: '#ef4444',
  DiscountTier: '#ef4444',
  // Reference/Attribute domain
  Attribute: '#6b7280',
  AttributeGroup: '#6b7280',
  ProductAttribute: '#6b7280',
  CategoryAttribute: '#6b7280',
  UnitOfMeasure: '#6b7280',
  TaxRate: '#6b7280',
}

// Domain grouping for layout
export const domainGroups: Record<string, string[]> = {
  Product: ['Product', 'ProductFeature', 'ProductOption', 'Category', 'ProductCategory'],
  Pricing: ['PriceBook', 'PriceBookEntry', 'PriceTier', 'Currency', 'ExchangeRate'],
  Quote: ['Quote', 'QuoteLineItem', 'AppliedDiscount'],
  Customer: ['Customer', 'Contract', 'ContractPriceEntry'],
  Rules: ['Rule'],
  Discount: ['Discount', 'DiscountTier'],
  Reference: ['Attribute', 'AttributeGroup', 'ProductAttribute', 'CategoryAttribute', 'UnitOfMeasure', 'TaxRate'],
}

function parseFields(modelContent: string): ParsedField[] {
  const fields: ParsedField[] = []
  const lines = modelContent.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('@@')) continue

    // Match field declarations: fieldName Type modifiers
    const fieldMatch = trimmed.match(/^(\w+)\s+(\w+)(\[\])?\??(.*)$/)
    if (!fieldMatch) continue

    const name = fieldMatch[1]!
    const type = fieldMatch[2]!
    const isArray = fieldMatch[3]
    const rest = fieldMatch[4] || ''
    const fullType = isArray ? `${type}[]` : type

    // Skip if it's a relation field (has @relation)
    const isRelationField = rest.includes('@relation')

    // Check for various attributes
    const isPrimaryKey = rest.includes('@id')
    const isUnique = rest.includes('@unique')
    const hasDefault = rest.includes('@default')
    const isOptional = trimmed.includes(`${type}?`) || trimmed.includes(`${type}[]?`)

    // Determine if it's a foreign key by checking if there's a corresponding relation field
    const isForeignKey = /Id$/.test(name) && !isPrimaryKey

    // For relation fields, extract the related model
    let relatedModel: string | undefined
    if (isRelationField || (isArray && !['String', 'Int', 'Float', 'Boolean', 'DateTime', 'Decimal', 'Json'].includes(type))) {
      relatedModel = type
    }

    // Skip implicit relation fields (they reference other models directly)
    const builtInTypes = ['String', 'Int', 'Float', 'Boolean', 'DateTime', 'Decimal', 'Json', 'Bytes', 'BigInt']
    if (!builtInTypes.includes(type) && !isRelationField) {
      // This might be an enum or a relation - check if type ends with common enum patterns
      const enumPatterns = ['Type', 'Status', 'Trigger', 'Scope', 'Frequency']
      const isLikelyEnum = enumPatterns.some((p) => type.endsWith(p)) || type.toUpperCase() === type
      if (!isLikelyEnum) {
        relatedModel = type
      }
    }

    fields.push({
      name,
      type: fullType,
      isRequired: !isOptional,
      isPrimaryKey,
      isForeignKey,
      isUnique,
      hasDefault,
      relatedModel,
    })
  }

  return fields
}

function parseRelations(modelName: string, modelContent: string): ParsedRelation[] {
  const relations: ParsedRelation[] = []
  const lines = modelContent.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed.includes('@relation')) continue

    // Match relation field: fieldName RelatedModel? @relation(...)
    // or fieldName RelatedModel[] @relation(...)
    const fieldMatch = trimmed.match(/^(\w+)\s+(\w+)(\[\])?\??/)
    if (!fieldMatch) continue

    const fieldName = fieldMatch[1]!
    const relatedModel = fieldMatch[2]!
    const isArray = fieldMatch[3]

    // Determine relation type
    // If this side has [], it's the "many" side
    // We need to check the related model to determine full cardinality
    let relationType: '1:1' | '1:N' | 'N:1' | 'N:N' = '1:1'
    if (isArray) {
      // This model has many of the related model
      relationType = '1:N'
    }
    else {
      // This model has one of the related model (could be N:1 or 1:1)
      // Check if there's a foreign key field (indicates N:1)
      const fkPattern = new RegExp(`@relation\\(.*fields:\\s*\\[${fieldName}Id\\]`, 'i')
      const hasFk = lines.some((l) => l.includes(`${fieldName}Id`) || fkPattern.test(l))
      if (hasFk || trimmed.includes('fields:')) {
        relationType = 'N:1'
      }
    }

    // Extract foreign key from @relation
    let foreignKey: string | undefined
    const fkMatch = trimmed.match(/fields:\s*\[(\w+)\]/)
    if (fkMatch && fkMatch[1]) {
      foreignKey = fkMatch[1]
    }

    relations.push({
      fieldName,
      relatedModel,
      relationType,
      foreignKey,
    })
  }

  return relations
}

function parseEnums(schemaContent: string): ParsedEnum[] {
  const enums: ParsedEnum[] = []
  const enumRegex = /enum\s+(\w+)\s*\{([^}]+)\}/g

  let match
  while ((match = enumRegex.exec(schemaContent)) !== null) {
    const name = match[1]
    const content = match[2]
    if (!name || !content) continue

    const values = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('//'))

    enums.push({ name, values })
  }

  return enums
}

function parseModels(schemaContent: string): ParsedModel[] {
  const models: ParsedModel[] = []
  const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g

  let match
  while ((match = modelRegex.exec(schemaContent)) !== null) {
    const name = match[1]
    const content = match[2]
    if (!name || !content) continue

    const fields = parseFields(content)
    const relations = parseRelations(name, content)

    models.push({
      name,
      fields: fields.filter((f) => !f.relatedModel), // Only non-relation fields for display
      relations,
    })
  }

  return models
}

export function parsePrismaSchema(schemaContent: string): ParsedSchema {
  return {
    models: parseModels(schemaContent),
    enums: parseEnums(schemaContent),
  }
}

export function usePrismaSchema() {
  const schema = ref<ParsedSchema | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  async function fetchSchema() {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('/api/schema')
      if (!response.ok) {
        throw new Error('Failed to fetch schema')
      }
      const content = await response.text()
      schema.value = parsePrismaSchema(content)
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    schema,
    isLoading,
    error,
    fetchSchema,
    domainColors,
    domainGroups,
  }
}
