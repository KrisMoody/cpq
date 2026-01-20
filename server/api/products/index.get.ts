import { usePrisma } from '../../utils/prisma'
import type { Prisma } from '../../../app/generated/prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'
  const includeAttributes = query.includeAttributes === 'true'
  const categoryId = typeof query.categoryId === 'string' ? query.categoryId : undefined
  const attributeFilter = typeof query.attributeFilter === 'string' ? query.attributeFilter : undefined

  // Build where clause
  const where: Prisma.ProductWhereInput = {}
  if (!includeInactive) {
    where.isActive = true
  }
  if (categoryId) {
    where.categories = {
      some: {
        categoryId: categoryId,
      },
    }
  }

  // Apply attribute filters if provided
  if (attributeFilter) {
    try {
      const filters = JSON.parse(attributeFilter) as Array<{ code: string; value: unknown; operator?: string }>
      if (filters.length > 0) {
        // Get attribute IDs for the codes
        const codes = filters.map((f) => f.code)
        const attributes = await prisma.attribute.findMany({
          where: { code: { in: codes } },
          select: { id: true, code: true, type: true },
        })
        const attrMap = new Map(attributes.map((a) => [a.code, a]))

        // Build attribute conditions
        const attrConditions: Prisma.ProductWhereInput[] = []

        for (const f of filters) {
          const attr = attrMap.get(f.code)
          if (!attr) continue

          // For range queries on numbers
          if (attr.type === 'NUMBER' && f.operator) {
            // Handle range operators
            attrConditions.push({
              attributes: {
                some: {
                  attributeId: attr.id,
                  // Prisma JSON filtering varies by database
                  // For PostgreSQL, use path queries
                },
              },
            })
          } else {
            // Exact match
            // ASSERTION: Filter value from query string needs cast for Prisma JSON field
            attrConditions.push({
              attributes: {
                some: {
                  attributeId: attr.id,
                  value: { equals: f.value as Prisma.InputJsonValue },
                },
              },
            })
          }
        }

        if (attrConditions.length > 0) {
          const existingAnd = Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []
          where.AND = [...existingAnd, ...attrConditions]
        }
      }
    } catch {
      // Ignore invalid JSON
    }
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      description: true,
      sku: true,
      type: true,
      isTaxable: true,
      isActive: true,
      createdAt: true,
      unitOfMeasureId: true,
      unitOfMeasure: {
        select: {
          id: true,
          name: true,
          abbreviation: true,
        },
      },
      categories: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      // Include feature/option counts for bundles
      features: {
        select: {
          id: true,
          _count: {
            select: {
              options: true,
            },
          },
        },
      },
      // Include price book entry count
      _count: {
        select: {
          priceBookEntries: true,
        },
      },
      ...(includeAttributes && {
        attributes: {
          select: {
            value: true,
            attribute: {
              select: {
                id: true,
                name: true,
                code: true,
                type: true,
                group: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      }),
    },
  })

  // Flatten categories and compute bundle validation status
  return products.map((p) => {
    const featureCount = p.features.length
    const totalOptions = p.features.reduce((sum, f) => sum + f._count.options, 0)
    const hasEmptyFeatures = p.features.some((f) => f._count.options === 0)
    const hasPricing = p._count.priceBookEntries > 0

    return {
      ...p,
      categories: p.categories.map((pc) => pc.category),
      // Bundle validation info
      _bundleInfo: p.type === 'BUNDLE' ? {
        featureCount,
        totalOptions,
        hasEmptyFeatures,
        hasPricing,
        isConfigured: featureCount > 0 && totalOptions > 0 && !hasEmptyFeatures,
      } : null,
      // Remove internal fields
      features: undefined,
      _count: undefined,
    }
  })
})
