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

  const attribute = await prisma.attribute.findUnique({
    where: { id },
    include: {
      group: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          productAttributes: true,
          categoryAttributes: true,
        },
      },
    },
  })

  if (!attribute) {
    throw createError({
      statusCode: 404,
      message: 'Attribute not found',
    })
  }

  return attribute
})
