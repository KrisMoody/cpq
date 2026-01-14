import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const contractId = getRouterParam(event, 'id')
  const entryId = getRouterParam(event, 'entryId')
  const body = await readBody(event)

  if (!contractId || !entryId) {
    throw createError({
      statusCode: 400,
      message: 'Contract ID and entry ID are required',
    })
  }

  if (body.fixedPrice === undefined || body.fixedPrice === null) {
    throw createError({
      statusCode: 400,
      message: 'Fixed price is required',
    })
  }

  // Verify entry exists and belongs to the contract
  const existing = await prisma.contractPriceEntry.findFirst({
    where: {
      id: entryId,
      contractId,
    },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Price entry not found',
    })
  }

  const priceEntry = await prisma.contractPriceEntry.update({
    where: { id: entryId },
    data: {
      fixedPrice: body.fixedPrice,
    },
    include: {
      product: {
        select: { id: true, name: true, sku: true },
      },
    },
  })

  return priceEntry
})
