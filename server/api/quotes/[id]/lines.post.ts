import { usePrisma } from '../../../utils/prisma'
import { lookupPriceWithContract, type ContractWithPrices } from '../../../services/priceLookup'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const quoteId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!quoteId) {
    throw createError({
      statusCode: 400,
      message: 'Quote ID is required',
    })
  }

  // Get the quote with customer to check for contract pricing
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: { priceBookId: true, customerId: true },
  })

  if (!quote) {
    throw createError({
      statusCode: 404,
      message: 'Quote not found',
    })
  }

  // Look up the price from the quote's price book (with tiers)
  const priceEntry = await prisma.priceBookEntry.findUnique({
    where: {
      priceBookId_productId: {
        priceBookId: quote.priceBookId,
        productId: body.productId,
      },
    },
    include: {
      priceTiers: true,
    },
  })

  if (!priceEntry) {
    throw createError({
      statusCode: 400,
      message: 'Product not found in price book',
    })
  }

  // Look up active contract for customer (if any)
  let activeContract: ContractWithPrices | null = null
  if (quote.customerId) {
    const now = new Date()
    const contract = await prisma.contract.findFirst({
      where: {
        customerId: quote.customerId,
        status: 'ACTIVE',
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        priceEntries: true,
      },
    })
    if (contract) {
      activeContract = contract
    }
  }

  const quantity = body.quantity || 1

  // Use lookupPriceWithContract to apply tier pricing and contract pricing
  const priceResult = lookupPriceWithContract(priceEntry, quantity, activeContract)
  const listPrice = priceResult.unitPrice

  const discount = body.discount || 0
  const netPrice = (listPrice * quantity) - discount

  // Get the next sort order
  const lastLine = await prisma.quoteLineItem.findFirst({
    where: { quoteId },
    orderBy: { sortOrder: 'desc' },
  })
  const sortOrder = (lastLine?.sortOrder || 0) + 1

  const lineItem = await prisma.quoteLineItem.create({
    data: {
      quoteId,
      productId: body.productId,
      parentLineId: body.parentLineId,
      quantity,
      listPrice,
      discount,
      netPrice,
      termMonths: body.termMonths || null,
      isProrated: body.isProrated || false,
      proratedAmount: body.proratedAmount || null,
      sortOrder,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
          type: true,
          billingFrequency: true,
          customBillingMonths: true,
          defaultTermMonths: true,
        },
      },
    },
  })

  // Recalculate quote totals
  const lineItems = await prisma.quoteLineItem.findMany({
    where: { quoteId },
  })

  const subtotal = lineItems.reduce((sum, item) => sum + Number(item.netPrice), 0)

  const quoteData = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: { discountTotal: true },
  })

  const total = subtotal - Number(quoteData?.discountTotal || 0)

  await prisma.quote.update({
    where: { id: quoteId },
    data: { subtotal, total },
  })

  return lineItem
})
