import { usePrisma } from '../utils/prisma'

export interface TaxBreakdownItem {
  name: string
  rate: number // Decimal rate (e.g., 0.0825 for 8.25%)
  amount: number
}

export interface TaxCalculationResult {
  taxAmount: number
  taxBreakdown: TaxBreakdownItem[]
  isTaxExempt: boolean
  exemptionExpired: boolean
}

/**
 * Get applicable tax rates for a customer based on their location
 */
export async function getApplicableTaxRates(
  customerId: string | null,
  date: Date = new Date()
) {
  const prisma = usePrisma()

  if (!customerId) {
    return []
  }

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { country: true, state: true },
  })

  if (!customer || !customer.country) {
    return []
  }

  // Find all active tax rates that match the customer's location
  // More specific (state-level) rates take precedence over country-level
  const taxRates = await prisma.taxRate.findMany({
    where: {
      isActive: true,
      country: customer.country,
      OR: [
        // Country-level tax (state is null)
        { state: null },
        // State-level tax (matches customer's state)
        { state: customer.state },
      ],
      AND: [
        // Valid date range check
        {
          OR: [{ validFrom: null }, { validFrom: { lte: date } }],
        },
        {
          OR: [{ validTo: null }, { validTo: { gte: date } }],
        },
      ],
    },
    orderBy: [
      { state: 'asc' }, // State-level rates first (non-null values sort before null in asc)
      { rate: 'desc' },
    ],
  })

  return taxRates
}

/**
 * Calculate tax amounts given a taxable subtotal and applicable tax rates
 */
export function calculateTax(
  taxableSubtotal: number,
  taxRates: Array<{ name: string; rate: number | string }>
): { taxAmount: number; taxBreakdown: TaxBreakdownItem[] } {
  if (taxableSubtotal <= 0 || taxRates.length === 0) {
    return { taxAmount: 0, taxBreakdown: [] }
  }

  const taxBreakdown: TaxBreakdownItem[] = []
  let totalTax = 0

  for (const taxRate of taxRates) {
    const rate = typeof taxRate.rate === 'string' ? parseFloat(taxRate.rate) : taxRate.rate
    const taxAmount = taxableSubtotal * rate

    taxBreakdown.push({
      name: taxRate.name,
      rate: rate,
      amount: Math.round(taxAmount * 100) / 100, // Round to 2 decimal places
    })

    totalTax += taxAmount
  }

  return {
    taxAmount: Math.round(totalTax * 100) / 100,
    taxBreakdown,
  }
}

/**
 * Check if a customer is tax exempt and if their exemption is still valid
 */
export async function checkTaxExemption(customerId: string | null): Promise<{
  isTaxExempt: boolean
  exemptionExpired: boolean
  exemptionReason: string | null
}> {
  const prisma = usePrisma()

  if (!customerId) {
    return { isTaxExempt: false, exemptionExpired: false, exemptionReason: null }
  }

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: {
      isTaxExempt: true,
      taxExemptReason: true,
      taxExemptExpiry: true,
    },
  })

  if (!customer) {
    return { isTaxExempt: false, exemptionExpired: false, exemptionReason: null }
  }

  if (!customer.isTaxExempt) {
    return { isTaxExempt: false, exemptionExpired: false, exemptionReason: null }
  }

  // Check if exemption has expired
  const now = new Date()
  const exemptionExpired = customer.taxExemptExpiry !== null && customer.taxExemptExpiry < now

  return {
    isTaxExempt: !exemptionExpired, // Only truly exempt if not expired
    exemptionExpired,
    exemptionReason: customer.taxExemptReason,
  }
}

/**
 * Calculate tax for a quote, considering customer exemption and product taxability
 */
export async function calculateQuoteTax(
  quoteId: string,
  _taxableSubtotal: number
): Promise<TaxCalculationResult> {
  const prisma = usePrisma()

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: {
      customerId: true,
      lineItems: {
        include: {
          product: {
            select: { isTaxable: true },
          },
        },
      },
    },
  })

  if (!quote) {
    return {
      taxAmount: 0,
      taxBreakdown: [],
      isTaxExempt: false,
      exemptionExpired: false,
    }
  }

  // Check customer tax exemption
  const exemptionStatus = await checkTaxExemption(quote.customerId)

  if (exemptionStatus.isTaxExempt) {
    return {
      taxAmount: 0,
      taxBreakdown: [],
      isTaxExempt: true,
      exemptionExpired: false,
    }
  }

  // Calculate taxable subtotal (only taxable products)
  const actualTaxableSubtotal = quote.lineItems.reduce((sum, item) => {
    if (item.product.isTaxable) {
      return sum + Number(item.netPrice)
    }
    return sum
  }, 0)

  // Get applicable tax rates
  const taxRates = await getApplicableTaxRates(quote.customerId)

  if (taxRates.length === 0) {
    return {
      taxAmount: 0,
      taxBreakdown: [],
      isTaxExempt: false,
      exemptionExpired: exemptionStatus.exemptionExpired,
    }
  }

  // Calculate tax
  const { taxAmount, taxBreakdown } = calculateTax(
    actualTaxableSubtotal,
    taxRates.map((tr) => ({ name: tr.name, rate: tr.rate.toString() }))
  )

  return {
    taxAmount,
    taxBreakdown,
    isTaxExempt: false,
    exemptionExpired: exemptionStatus.exemptionExpired,
  }
}
