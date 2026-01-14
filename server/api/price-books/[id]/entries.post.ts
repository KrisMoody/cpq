import { usePrisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Price book ID is required',
    })
  }

  if (!body.productId) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required',
    })
  }

  if (body.listPrice === undefined || body.listPrice === null) {
    throw createError({
      statusCode: 400,
      message: 'List price is required',
    })
  }

  // Check price book exists
  const priceBook = await prisma.priceBook.findUnique({
    where: { id },
  })

  if (!priceBook) {
    throw createError({
      statusCode: 404,
      message: 'Price book not found',
    })
  }

  // Check product exists
  const product = await prisma.product.findUnique({
    where: { id: body.productId },
  })

  if (!product) {
    throw createError({
      statusCode: 400,
      message: 'Product not found',
    })
  }

  // Check for duplicate entry
  const existingEntry = await prisma.priceBookEntry.findUnique({
    where: {
      priceBookId_productId: {
        priceBookId: id,
        productId: body.productId,
      },
    },
  })

  if (existingEntry) {
    throw createError({
      statusCode: 409,
      message: 'Product already exists in this price book',
    })
  }

  const entry = await prisma.priceBookEntry.create({
    data: {
      priceBookId: id,
      productId: body.productId,
      listPrice: body.listPrice,
      cost: body.cost ?? null,
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
    },
  })

  return entry
})
