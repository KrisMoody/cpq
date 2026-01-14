import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Contract ID is required',
    })
  }

  const contract = await prisma.contract.findUnique({
    where: { id },
    include: {
      customer: {
        select: { id: true, name: true, company: true },
      },
      priceEntries: {
        include: {
          product: {
            select: { id: true, name: true, sku: true },
          },
        },
        orderBy: { product: { name: 'asc' } },
      },
    },
  })

  if (!contract) {
    throw createError({
      statusCode: 404,
      message: 'Contract not found',
    })
  }

  return contract
})
