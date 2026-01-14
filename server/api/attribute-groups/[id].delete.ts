import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Group ID is required',
    })
  }

  const existing = await prisma.attributeGroup.findUnique({
    where: { id },
    include: {
      _count: {
        select: { attributes: true },
      },
    },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Attribute group not found',
    })
  }

  // Prevent deletion if group has attributes
  if (existing._count.attributes > 0) {
    throw createError({
      statusCode: 400,
      message: `Cannot delete group with ${existing._count.attributes} attribute(s). Remove or reassign attributes first.`,
    })
  }

  await prisma.attributeGroup.delete({
    where: { id },
  })

  return { success: true }
})
