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
        select: { id: true, name: true, company: true, priceBookId: true },
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

  // Get customer's price book ID (or default)
  let priceBookId = contract.customer.priceBookId
  if (!priceBookId) {
    const defaultPriceBook = await prisma.priceBook.findFirst({
      where: { isDefault: true, isActive: true },
      select: { id: true },
    })
    priceBookId = defaultPriceBook?.id || null
  }

  // Fetch standard prices for all products in price entries
  if (priceBookId && contract.priceEntries.length > 0) {
    const productIds = contract.priceEntries.map((e) => e.productId)
    const standardPrices = await prisma.priceBookEntry.findMany({
      where: {
        priceBookId,
        productId: { in: productIds },
      },
      select: { productId: true, listPrice: true },
    })

    const priceMap = new Map(standardPrices.map((p) => [p.productId, p.listPrice]))

    // Attach standard price to each entry
    const entriesWithStandardPrice = contract.priceEntries.map((entry) => ({
      ...entry,
      standardPrice: priceMap.get(entry.productId)?.toString() || null,
    }))

    return {
      ...contract,
      priceEntries: entriesWithStandardPrice,
    }
  }

  return contract
})
