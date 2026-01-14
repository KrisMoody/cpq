import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Category ID is required',
    })
  }

  const existing = await prisma.category.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Category not found',
    })
  }

  // Validate parent if changing
  if (body.parentId !== undefined && body.parentId !== existing.parentId) {
    if (body.parentId) {
      // Cannot set self as parent
      if (body.parentId === id) {
        throw createError({
          statusCode: 400,
          message: 'Category cannot be its own parent',
        })
      }

      const parent = await prisma.category.findUnique({
        where: { id: body.parentId },
      })
      if (!parent) {
        throw createError({
          statusCode: 400,
          message: 'Parent category not found',
        })
      }

      // Prevent circular references by checking if new parent is a descendant
      const descendants = await getDescendantIds(prisma, id)
      if (descendants.includes(body.parentId)) {
        throw createError({
          statusCode: 400,
          message: 'Cannot set a descendant as parent (circular reference)',
        })
      }
    }
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      description: body.description !== undefined ? body.description : existing.description,
      parentId: body.parentId !== undefined ? body.parentId : existing.parentId,
      sortOrder: body.sortOrder ?? existing.sortOrder,
      isActive: body.isActive ?? existing.isActive,
    },
    include: {
      parent: {
        select: { id: true, name: true },
      },
    },
  })

  return category
})

async function getDescendantIds(prisma: ReturnType<typeof usePrisma>, categoryId: string): Promise<string[]> {
  const children = await prisma.category.findMany({
    where: { parentId: categoryId },
    select: { id: true },
  })

  const ids = children.map((c) => c.id)
  for (const child of children) {
    const grandchildren = await getDescendantIds(prisma, child.id)
    ids.push(...grandchildren)
  }

  return ids
}
