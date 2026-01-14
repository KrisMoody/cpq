import type { QuoteWithLineItems, QuoteLineItem, AppliedDiscount } from '~/composables/useQuotes'

/**
 * Generates realistic sample quote data for layout preview.
 * Includes various product types, bundles, and discounts to showcase all layout features.
 */
export function generateSampleQuote(): QuoteWithLineItems {
  const now = new Date()
  const validTo = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

  const lineItems: QuoteLineItem[] = [
    // Standard products
    {
      id: 'line-1',
      quoteId: 'sample-quote',
      productId: 'prod-1',
      parentLineId: null,
      quantity: 2,
      listPrice: '1499.00',
      discount: '149.90',
      netPrice: '1349.10',
      sortOrder: 0,
      product: {
        id: 'prod-1',
        name: 'Professional Software License',
        sku: 'SW-PRO-001',
        type: 'LICENSE',
      },
      appliedDiscounts: [],
    },
    {
      id: 'line-2',
      quoteId: 'sample-quote',
      productId: 'prod-2',
      parentLineId: null,
      quantity: 5,
      listPrice: '299.00',
      discount: '0.00',
      netPrice: '299.00',
      sortOrder: 1,
      product: {
        id: 'prod-2',
        name: 'User Seat Add-on',
        sku: 'SW-SEAT-001',
        type: 'ADDON',
      },
      appliedDiscounts: [],
    },
    // Bundle with child items
    {
      id: 'line-3',
      quoteId: 'sample-quote',
      productId: 'prod-3',
      parentLineId: null,
      quantity: 1,
      listPrice: '4999.00',
      discount: '499.90',
      netPrice: '4499.10',
      sortOrder: 2,
      product: {
        id: 'prod-3',
        name: 'Enterprise Bundle',
        sku: 'BND-ENT-001',
        type: 'BUNDLE',
      },
      childLines: [
        {
          id: 'line-3a',
          quoteId: 'sample-quote',
          productId: 'prod-3a',
          parentLineId: 'line-3',
          quantity: 1,
          listPrice: '2499.00',
          discount: '0.00',
          netPrice: '2499.00',
          sortOrder: 0,
          product: {
            id: 'prod-3a',
            name: 'Enterprise License',
            sku: 'SW-ENT-001',
            type: 'LICENSE',
          },
        },
        {
          id: 'line-3b',
          quoteId: 'sample-quote',
          productId: 'prod-3b',
          parentLineId: 'line-3',
          quantity: 1,
          listPrice: '1500.00',
          discount: '0.00',
          netPrice: '1500.00',
          sortOrder: 1,
          product: {
            id: 'prod-3b',
            name: 'Premium Support (1 Year)',
            sku: 'SVC-SUP-001',
            type: 'SERVICE',
          },
        },
        {
          id: 'line-3c',
          quoteId: 'sample-quote',
          productId: 'prod-3c',
          parentLineId: 'line-3',
          quantity: 1,
          listPrice: '1000.00',
          discount: '0.00',
          netPrice: '1000.00',
          sortOrder: 2,
          product: {
            id: 'prod-3c',
            name: 'Training Package',
            sku: 'SVC-TRN-001',
            type: 'SERVICE',
          },
        },
      ],
      appliedDiscounts: [],
    },
    // Service item
    {
      id: 'line-4',
      quoteId: 'sample-quote',
      productId: 'prod-4',
      parentLineId: null,
      quantity: 10,
      listPrice: '150.00',
      discount: '0.00',
      netPrice: '150.00',
      sortOrder: 3,
      product: {
        id: 'prod-4',
        name: 'Consulting Hours',
        sku: 'SVC-CON-001',
        type: 'SERVICE',
      },
      appliedDiscounts: [],
    },
    // Hardware item
    {
      id: 'line-5',
      quoteId: 'sample-quote',
      productId: 'prod-5',
      parentLineId: null,
      quantity: 3,
      listPrice: '799.00',
      discount: '79.90',
      netPrice: '719.10',
      sortOrder: 4,
      product: {
        id: 'prod-5',
        name: 'Security Token Device',
        sku: 'HW-TOK-001',
        type: 'PHYSICAL',
      },
      appliedDiscounts: [],
    },
  ]

  const appliedDiscounts: AppliedDiscount[] = [
    {
      id: 'disc-1',
      type: 'PERCENTAGE',
      value: '10',
      calculatedAmount: '729.70',
      reason: 'Volume discount',
      discount: {
        id: 'discount-vol',
        name: 'Volume Discount (10%)',
      },
    },
  ]

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => {
    const itemTotal = parseFloat(item.netPrice) * item.quantity
    const childTotal = (item.childLines || []).reduce(
      (cs, child) => cs + parseFloat(child.netPrice) * child.quantity,
      0
    )
    return sum + itemTotal + childTotal
  }, 0)

  const discountTotal = appliedDiscounts.reduce(
    (sum, d) => sum + parseFloat(d.calculatedAmount),
    0
  )

  const taxAmount = (subtotal - discountTotal) * 0.0825 // 8.25% tax
  const total = subtotal - discountTotal + taxAmount

  return {
    id: 'sample-quote-12345678',
    name: 'Sample Enterprise Quote',
    customerId: 'cust-1',
    currencyId: null,
    status: 'DRAFT',
    requiresApproval: false,
    priceBookId: 'pb-1',
    validFrom: now.toISOString(),
    validTo: validTo.toISOString(),
    subtotal: subtotal.toFixed(2),
    discountTotal: discountTotal.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    taxBreakdown: [
      { name: 'State Tax', rate: 0.0625, amount: (subtotal - discountTotal) * 0.0625 },
      { name: 'Local Tax', rate: 0.02, amount: (subtotal - discountTotal) * 0.02 },
    ],
    total: total.toFixed(2),
    createdAt: now.toISOString(),
    customer: {
      id: 'cust-1',
      name: 'Acme Corporation',
      company: 'Acme Corp',
      isTaxExempt: false,
    },
    priceBook: {
      id: 'pb-1',
      name: 'Standard Price Book',
    },
    currency: {
      id: 'usd',
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      isBase: true,
      isActive: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    lineItems,
    appliedDiscounts,
  }
}
