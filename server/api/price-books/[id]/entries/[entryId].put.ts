import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const entryId = getRouterParam(event, 'entryId')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Price book ID is required',
    })
  }

  if (!entryId) {
    throw createError({
      statusCode: 400,
      message: 'Entry ID is required',
    })
  }

  // Check entry exists and belongs to price book
  const existing = await prisma.priceBookEntry.findFirst({
    where: {
      id: entryId,
      priceBookId: id,
    },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Price book entry not found',
    })
  }

  // Handle tiers if provided
  if (body.tiers !== undefined) {
    // Delete existing tiers
    await prisma.priceTier.deleteMany({
      where: { priceBookEntryId: entryId },
    })

    // Create new tiers if any
    if (body.tiers && body.tiers.length > 0) {
      await prisma.priceTier.createMany({
        data: body.tiers.map((tier: { minQuantity: number; maxQuantity?: number | null; tierPrice: number; tierType: string }) => ({
          priceBookEntryId: entryId,
          minQuantity: tier.minQuantity,
          maxQuantity: tier.maxQuantity ?? null,
          tierPrice: tier.tierPrice,
          tierType: tier.tierType || 'UNIT_PRICE',
        })),
      })
    }
  }

  const entry = await prisma.priceBookEntry.update({
    where: { id: entryId },
    data: {
      listPrice: body.listPrice !== undefined ? body.listPrice : existing.listPrice,
      cost: body.cost !== undefined ? body.cost : existing.cost,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
          type: true,
        },
      },
      priceTiers: {
        orderBy: { minQuantity: 'asc' },
      },
    },
  })

  return entry
})
