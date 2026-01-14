import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'
  const flat = query.flat === 'true'

  const categories = await prisma.category.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      parent: {
        select: { id: true, name: true },
      },
      _count: {
        select: { products: true, children: true },
      },
    },
  })

  const mapped = categories.map((category) => ({
    ...category,
    productCount: category._count.products,
    childCount: category._count.children,
    _count: undefined,
  }))

  // Return flat list or build tree
  if (flat) {
    return mapped
  }

  // Build hierarchical tree
  const categoryMap = new Map(mapped.map((c) => [c.id, { ...c, children: [] as typeof mapped }]))
  const roots: typeof mapped = []

  for (const category of mapped) {
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId)
      if (parent) {
        parent.children.push(categoryMap.get(category.id)!)
      }
    } else {
      roots.push(categoryMap.get(category.id)!)
    }
  }

  return roots
})
