import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Customer ID is required',
    })
  }

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      priceBook: {
        select: { id: true, name: true },
      },
      quotes: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          status: true,
          total: true,
          createdAt: true,
        },
      },
    },
  })

  if (!customer) {
    throw createError({
      statusCode: 404,
      message: 'Customer not found',
    })
  }

  return customer
})
