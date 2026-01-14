import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Tax rate ID is required',
    })
  }

  const taxRate = await prisma.taxRate.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  })

  if (!taxRate) {
    throw createError({
      statusCode: 404,
      message: 'Tax rate not found',
    })
  }

  return taxRate
})
