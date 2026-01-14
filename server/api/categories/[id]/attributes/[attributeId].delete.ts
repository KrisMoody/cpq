import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const attributeId = getRouterParam(event, 'attributeId')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Category ID is required',
    })
  }

  if (!attributeId) {
    throw createError({
      statusCode: 400,
      message: 'Attribute ID is required',
    })
  }

  // Check if exists
  const existing = await prisma.categoryAttribute.findUnique({
    where: {
      categoryId_attributeId: {
        categoryId: id,
        attributeId: attributeId,
      },
    },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Category attribute not found',
    })
  }

  await prisma.categoryAttribute.delete({
    where: {
      categoryId_attributeId: {
        categoryId: id,
        attributeId: attributeId,
      },
    },
  })

  return { success: true }
})
