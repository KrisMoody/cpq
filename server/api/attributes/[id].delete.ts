import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Attribute ID is required',
    })
  }

  const existing = await prisma.attribute.findUnique({
    where: { id },
    include: {
      _count: {
        select: { productAttributes: true },
      },
    },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Attribute not found',
    })
  }

  // Prevent deletion if values exist
  if (existing._count.productAttributes > 0) {
    throw createError({
      statusCode: 400,
      message: `Cannot delete attribute with ${existing._count.productAttributes} product value(s). Remove values first.`,
    })
  }

  await prisma.attribute.delete({
    where: { id },
  })

  return { success: true }
})
