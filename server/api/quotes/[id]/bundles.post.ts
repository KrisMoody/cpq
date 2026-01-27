import { usePrisma } from '../../../utils/prisma'

interface BundleSelection {
  optionId: string
  quantity: number
}

interface BundleRequest {
  productId: string
  quantity: number
  selections: BundleSelection[]
}

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const quoteId = getRouterParam(event, 'id')
  const body = await readBody<BundleRequest>(event)

  if (!quoteId) {
    throw createError({
      statusCode: 400,
      message: 'Quote ID is required',
    })
  }

  if (!body.productId) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required',
    })
  }

  // Get the quote with its price book
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: { id: true, priceBookId: true },
  })

  if (!quote) {
    throw createError({
      statusCode: 404,
      message: 'Quote not found',
    })
  }

  // Get the bundle product with features and options
  const bundleProduct = await prisma.product.findUnique({
    where: { id: body.productId },
    include: {
      features: {
        include: {
          options: true,
        },
      },
    },
  })

  if (!bundleProduct) {
    throw createError({
      statusCode: 404,
      message: 'Bundle product not found',
    })
  }

  if (bundleProduct.type !== 'BUNDLE') {
    throw createError({
      statusCode: 400,
      message: 'Product is not a bundle',
    })
  }

  // Get bundle price from price book
  const bundlePriceEntry = await prisma.priceBookEntry.findUnique({
    where: {
      priceBookId_productId: {
        priceBookId: quote.priceBookId,
        productId: body.productId,
      },
    },
  })

  if (!bundlePriceEntry) {
    throw createError({
      statusCode: 400,
      message: 'Bundle product not found in price book',
    })
  }

  // Validate selections and gather option details
  const optionIds = body.selections.map((s) => s.optionId)
  const allOptions = bundleProduct.features.flatMap((f) => f.options)
  const selectedOptions = allOptions.filter((o) => optionIds.includes(o.id))

  // Validate all selected options exist
  if (selectedOptions.length !== body.selections.length) {
    throw createError({
      statusCode: 400,
      message: 'Invalid option selection',
    })
  }

  // Get prices for all selected option products
  const optionProductIds = selectedOptions.map((o) => o.optionProductId)
  const optionPrices = await prisma.priceBookEntry.findMany({
    where: {
      priceBookId: quote.priceBookId,
      productId: { in: optionProductIds },
    },
  })
  const priceMap = new Map(optionPrices.map((p) => [p.productId, p]))

  // Check all options have prices and collect missing ones
  const missingProducts: string[] = []
  for (const option of selectedOptions) {
    if (!priceMap.has(option.optionProductId)) {
      // Get the product name for a better error message
      const product = await prisma.product.findUnique({
        where: { id: option.optionProductId },
        select: { name: true, sku: true },
      })
      missingProducts.push(product ? `${product.name} (${product.sku})` : option.optionProductId)
    }
  }

  if (missingProducts.length > 0) {
    throw createError({
      statusCode: 400,
      message: `The following products are not in this price book: ${missingProducts.join(', ')}`,
    })
  }

  // Get next sort order
  const lastLine = await prisma.quoteLineItem.findFirst({
    where: { quoteId },
    orderBy: { sortOrder: 'desc' },
  })
  let sortOrder = (lastLine?.sortOrder || 0) + 1

  const bundleQuantity = body.quantity || 1
  const bundleListPrice = Number(bundlePriceEntry.listPrice)

  // Create parent bundle line item
  // Bundle parent has netPrice = 0 (pricing comes from selected components)
  const parentLineItem = await prisma.quoteLineItem.create({
    data: {
      quoteId,
      productId: body.productId,
      quantity: bundleQuantity,
      listPrice: bundleListPrice,
      discount: 0,
      netPrice: 0,
      sortOrder: sortOrder++,
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

  // Create child line items for selected options
  const childLineItems = []
  for (const selection of body.selections) {
    const option = selectedOptions.find((o) => o.id === selection.optionId)!
    const priceEntry = priceMap.get(option.optionProductId)!
    const optionQuantity = selection.quantity * bundleQuantity
    const listPrice = Number(priceEntry.listPrice)

    const childLine = await prisma.quoteLineItem.create({
      data: {
        quoteId,
        productId: option.optionProductId,
        parentLineId: parentLineItem.id,
        quantity: optionQuantity,
        listPrice,
        discount: 0,
        netPrice: listPrice * optionQuantity,
        sortOrder: sortOrder++,
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
    childLineItems.push(childLine)
  }

  // Recalculate quote totals
  const allLineItems = await prisma.quoteLineItem.findMany({
    where: { quoteId },
  })

  const subtotal = allLineItems.reduce((sum, item) => sum + Number(item.netPrice), 0)
  const quoteData = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: { discountTotal: true },
  })
  const total = subtotal - Number(quoteData?.discountTotal || 0)

  await prisma.quote.update({
    where: { id: quoteId },
    data: { subtotal, total },
  })

  return {
    parentLineItem,
    childLineItems,
  }
})
