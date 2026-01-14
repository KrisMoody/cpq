import { usePrisma } from '../../utils/prisma'
import { lookupPrice } from '../../services/priceLookup'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)

  const productId = query.productId as string
  const priceBookId = query.priceBookId as string
  const quantity = parseInt(query.quantity as string) || 1

  if (!productId) {
    throw createError({
      statusCode: 400,
      message: 'productId is required',
    })
  }

  if (!priceBookId) {
    throw createError({
      statusCode: 400,
      message: 'priceBookId is required',
    })
  }

  // Find the price book entry
  const entry = await prisma.priceBookEntry.findUnique({
    where: {
      priceBookId_productId: {
        priceBookId,
        productId,
      },
    },
    include: {
      priceTiers: {
        orderBy: { minQuantity: 'asc' },
      },
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
        },
      },
    },
  })

  if (!entry) {
    throw createError({
      statusCode: 404,
      message: 'Price not found for this product in the specified price book',
    })
  }

  const result = lookupPrice(entry, quantity)

  return {
    product: entry.product,
    priceBookId,
    quantity,
    listPrice: Number(entry.listPrice),
    ...result,
    totalPrice: result.unitPrice * quantity,
  }
})
