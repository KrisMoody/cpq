import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'
  const includeAttributes = query.includeAttributes === 'true'
  const categoryId = query.categoryId as string | undefined
  const attributeFilter = query.attributeFilter as string | undefined // JSON string: [{ code: string, value: any }]

  // Build where clause
  const where: any = {}
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
      const filters = JSON.parse(attributeFilter) as Array<{ code: string; value: any; operator?: string }>
      if (filters.length > 0) {
        // Get attribute IDs for the codes
        const codes = filters.map((f) => f.code)
        const attributes = await prisma.attribute.findMany({
          where: { code: { in: codes } },
          select: { id: true, code: true, type: true },
        })
        const attrMap = new Map(attributes.map((a) => [a.code, a]))

        // Build attribute conditions
        const attrConditions = filters
          .map((f) => {
            const attr = attrMap.get(f.code)
            if (!attr) return null

            // For range queries on numbers
            if (attr.type === 'NUMBER' && f.operator) {
              // Handle range operators
              return {
                attributes: {
                  some: {
                    attributeId: attr.id,
                    // Prisma JSON filtering varies by database
                    // For PostgreSQL, use path queries
                  },
                },
              }
            }

            // Exact match
            return {
              attributes: {
                some: {
                  attributeId: attr.id,
                  value: { equals: f.value },
                },
              },
            }
          })
          .filter(Boolean)

        if (attrConditions.length > 0) {
          where.AND = [...(where.AND || []), ...attrConditions]
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

  // Flatten categories for easier consumption
  return products.map((p) => ({
    ...p,
    categories: p.categories.map((pc) => pc.category),
  }))
})
