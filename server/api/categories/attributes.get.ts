import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)

  // Accept comma-separated category IDs
  const categoryIdsParam = query.categoryIds as string | undefined
  if (!categoryIdsParam) {
    return []
  }

  const categoryIds = categoryIdsParam.split(',').filter(Boolean)
  if (categoryIds.length === 0) {
    return []
  }

  // Fetch all category-attribute associations for the given categories
  const categoryAttributes = await prisma.categoryAttribute.findMany({
    where: {
      categoryId: { in: categoryIds },
    },
    include: {
      attribute: {
        include: {
          group: {
            select: { id: true, name: true },
          },
        },
      },
      category: {
        select: { id: true, name: true },
      },
    },
  })

  // Deduplicate attributes (same attribute might be in multiple categories)
  const attributeMap = new Map<
    string,
    {
      attribute: (typeof categoryAttributes)[0]['attribute']
      categoryIds: string[]
      categoryNames: string[]
    }
  >()

  for (const ca of categoryAttributes) {
    const existing = attributeMap.get(ca.attributeId)
    if (existing) {
      existing.categoryIds.push(ca.categoryId)
      existing.categoryNames.push(ca.category.name)
    } else {
      attributeMap.set(ca.attributeId, {
        attribute: ca.attribute,
        categoryIds: [ca.categoryId],
        categoryNames: [ca.category.name],
      })
    }
  }

  // Return attributes with category information
  return Array.from(attributeMap.values()).map(({ attribute, categoryIds, categoryNames }) => ({
    ...attribute,
    suggestedByCategoryIds: categoryIds,
    suggestedByCategoryNames: categoryNames,
  }))
})
