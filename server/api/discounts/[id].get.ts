import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Discount ID is required',
    })
  }

  const discount = await prisma.discount.findUnique({
    where: { id },
    include: {
      tiers: {
        orderBy: { tierNumber: 'asc' },
      },
    },
  })

  if (!discount) {
    throw createError({
      statusCode: 404,
      message: 'Discount not found',
    })
  }

  return discount
})
