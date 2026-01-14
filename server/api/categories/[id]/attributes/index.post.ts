import { usePrisma } from '../../../../utils/prisma'

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

  if (!body.attributeId) {
    throw createError({
      statusCode: 400,
      message: 'Attribute ID is required',
    })
  }

  // Check category exists
  const category = await prisma.category.findUnique({
    where: { id },
  })

  if (!category) {
    throw createError({
      statusCode: 404,
      message: 'Category not found',
    })
  }

  // Check attribute exists
  const attribute = await prisma.attribute.findUnique({
    where: { id: body.attributeId },
  })

  if (!attribute) {
    throw createError({
      statusCode: 404,
      message: 'Attribute not found',
    })
  }

  // Check if already assigned
  const existing = await prisma.categoryAttribute.findUnique({
    where: {
      categoryId_attributeId: {
        categoryId: id,
        attributeId: body.attributeId,
      },
    },
  })

  if (existing) {
    throw createError({
      statusCode: 400,
      message: 'Attribute is already assigned to this category',
    })
  }

  const categoryAttribute = await prisma.categoryAttribute.create({
    data: {
      categoryId: id,
      attributeId: body.attributeId,
    },
    include: {
      attribute: {
        include: {
          group: true,
        },
      },
    },
  })

  return categoryAttribute
})
