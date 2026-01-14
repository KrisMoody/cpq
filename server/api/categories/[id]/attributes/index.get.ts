import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Category ID is required',
    })
  }

  const categoryAttributes = await prisma.categoryAttribute.findMany({
    where: { categoryId: id },
    include: {
      attribute: {
        include: {
          group: true,
        },
      },
    },
    orderBy: {
      attribute: { sortOrder: 'asc' },
    },
  })

  return categoryAttributes
})
