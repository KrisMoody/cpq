import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const body = await readBody(event)

  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: 'Category name is required',
    })
  }

  // Validate parent exists if provided
  if (body.parentId) {
    const parent = await prisma.category.findUnique({
      where: { id: body.parentId },
    })
    if (!parent) {
      throw createError({
        statusCode: 400,
        message: 'Parent category not found',
      })
    }
  }

  const category = await prisma.category.create({
    data: {
      name: body.name,
      description: body.description || null,
      parentId: body.parentId || null,
      sortOrder: body.sortOrder ?? 0,
    },
    include: {
      parent: {
        select: { id: true, name: true },
      },
    },
  })

  return category
})
