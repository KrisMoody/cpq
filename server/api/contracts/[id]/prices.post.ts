import { usePrisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const contractId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!contractId) {
    throw createError({
      statusCode: 400,
      message: 'Contract ID is required',
    })
  }

  if (!body.productId) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required',
    })
  }

  if (body.fixedPrice === undefined || body.fixedPrice === null) {
    throw createError({
      statusCode: 400,
      message: 'Fixed price is required',
    })
  }

  // Verify contract exists
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
  })

  if (!contract) {
    throw createError({
      statusCode: 404,
      message: 'Contract not found',
    })
  }

  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: body.productId },
  })

  if (!product) {
    throw createError({
      statusCode: 400,
      message: 'Invalid product ID',
    })
  }

  // Check if entry already exists
  const existing = await prisma.contractPriceEntry.findUnique({
    where: {
      contractId_productId: {
        contractId,
        productId: body.productId,
      },
    },
  })

  if (existing) {
    throw createError({
      statusCode: 400,
      message: 'Price entry already exists for this product on this contract',
    })
  }

  const priceEntry = await prisma.contractPriceEntry.create({
    data: {
      contractId,
      productId: body.productId,
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
