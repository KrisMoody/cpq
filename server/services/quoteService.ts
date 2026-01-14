import { usePrisma } from '../utils/prisma'
import { calculateLinePrice, calculateQuoteTotal } from './pricingEngine'
import { validateBundleConfiguration, type SelectedOption } from './configurationValidator'

interface AddProductOptions {
  quoteId: string
  productId: string
  quantity?: number
  selectedOptions?: SelectedOption[] // For bundles
}

/**
 * Add a product to a quote with proper pricing
 *
 * Bundle Pricing Strategy (Component Sum Model):
 * - Bundle parent line item has netPrice = 0 (no direct cost)
 * - Total bundle cost = sum of selected component netPrices
 * - This makes pricing transparent and easy to itemize on invoices
 */
export async function addProductToQuote(options: AddProductOptions) {
  const prisma = usePrisma()
  const { quoteId, productId, quantity = 1, selectedOptions } = options

  // Get quote and its price book
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: { priceBookId: true },
  })

  if (!quote) {
    throw new Error('Quote not found')
  }

  // Get product details
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      features: {
        include: { options: true },
      },
    },
  })

  if (!product) {
    throw new Error('Product not found')
  }

  const isBundle = product.type === 'BUNDLE'

  // For bundles, validate configuration
  if (isBundle && selectedOptions) {
    const validation = await validateBundleConfiguration(productId, selectedOptions)
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors.map((e) => e.message).join(', ')}`)
    }
  }

  // Get price for the main product (used for standalone products or bundle reference)
  const pricing = await calculateLinePrice(productId, quantity, quote.priceBookId)
  if (!pricing) {
    throw new Error('Product not in price book')
  }

  // Get next sort order
  const lastLine = await prisma.quoteLineItem.findFirst({
    where: { quoteId },
    orderBy: { sortOrder: 'desc' },
  })
  let sortOrder = (lastLine?.sortOrder || 0) + 1

  // Create main line item
  // For bundles: netPrice = 0 (pricing comes from components)
  // For standalone: netPrice = tier-aware calculated price
  const mainLineItem = await prisma.quoteLineItem.create({
    data: {
      quoteId,
      productId,
      quantity,
      listPrice: pricing.listPrice,
      discount: 0,
      netPrice: isBundle ? 0 : pricing.netPrice,
      sortOrder: sortOrder++,
    },
  })

  // For bundles, create child line items for selected options
  if (isBundle && selectedOptions && selectedOptions.length > 0) {
    for (const selection of selectedOptions) {
      // Find the option to get the optionProductId
      const option = product.features
        .flatMap((f) => f.options)
        .find((o) => o.id === selection.optionId)

      if (!option) continue

      // Calculate tier-aware pricing for each component
      const optionPricing = await calculateLinePrice(
        option.optionProductId,
        selection.quantity,
        quote.priceBookId
      )

      if (optionPricing) {
        await prisma.quoteLineItem.create({
          data: {
            quoteId,
            productId: option.optionProductId,
            parentLineId: mainLineItem.id,
            quantity: selection.quantity,
            listPrice: optionPricing.listPrice,
            discount: 0,
            netPrice: optionPricing.netPrice,
            sortOrder: sortOrder++,
          },
        })
      }
    }
  }

  // Recalculate quote totals
  await calculateQuoteTotal(quoteId)

  return mainLineItem
}

/**
 * Recalculate all line item prices and quote totals
 *
 * Handles both standalone products and bundles:
 * - Standalone: netPrice = (unitPrice × quantity) - discount
 * - Bundle parent: netPrice = 0 (pricing comes from components)
 * - Bundle components: netPrice = (unitPrice × quantity) - discount
 */
export async function recalculateQuote(quoteId: string) {
  const prisma = usePrisma()
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      lineItems: {
        include: { product: true },
      },
    },
  })

  if (!quote) {
    throw new Error('Quote not found')
  }

  // Update each line item's price from price book
  for (const lineItem of quote.lineItems) {
    const isBundle = lineItem.product.type === 'BUNDLE'

    const pricing = await calculateLinePrice(
      lineItem.productId,
      lineItem.quantity,
      quote.priceBookId
    )

    if (pricing) {
      // For bundles: netPrice = 0 (pricing comes from components)
      // For standalone/components: netPrice = tier-aware price - discount
      const netPrice = isBundle ? 0 : pricing.netPrice - Number(lineItem.discount)

      await prisma.quoteLineItem.update({
        where: { id: lineItem.id },
        data: {
          listPrice: pricing.listPrice,
          netPrice,
        },
      })
    }
  }

  // Recalculate totals
  return calculateQuoteTotal(quoteId)
}
