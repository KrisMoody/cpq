import { usePrisma } from '../../../utils/prisma'
import { lookupPriceWithContract, type ContractWithPrices, type ContractPriceInfo } from '../../../services/priceLookup'
import { calculateQuoteTotal } from '../../../services/pricingEngine'

interface RuleCondition {
  field: string
  operator: string
  value: unknown
}

interface RuleAction {
  type: string
  message?: string
  field?: string
  value?: unknown
}

interface RuleEvaluationResult {
  ruleId: string
  ruleName: string
  ruleType: string
  triggered: boolean
  actions: RuleAction[]
}

interface EvaluationSummary {
  rules: RuleEvaluationResult[]
  warnings: string[]
  errors: string[]
  requiresApproval: boolean
  approvalReasons: string[]
  contractPricing?: {
    contractId: string
    contractName: string
    lineItems: { [lineItemId: string]: ContractPriceInfo }
  }
}

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const quoteId = getRouterParam(event, 'id')

  if (!quoteId) {
    throw createError({
      statusCode: 400,
      message: 'Quote ID is required',
    })
  }

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      customer: true,
      lineItems: {
        include: {
          product: true,
          appliedDiscounts: true,
        },
      },
      appliedDiscounts: {
        where: { lineItemId: null },
      },
      priceBook: {
        include: {
          entries: {
            include: {
              priceTiers: true,
            },
          },
        },
      },
    },
  })

  if (!quote) {
    throw createError({
      statusCode: 404,
      message: 'Quote not found',
    })
  }

  // Look up active contract for customer (if any)
  let activeContract: ContractWithPrices | null = null
  const contractLineItemInfo: { [lineItemId: string]: ContractPriceInfo } = {}

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

  // Recalculate line item prices with tier pricing and contract pricing
  for (const lineItem of quote.lineItems) {
    const priceEntry = quote.priceBook.entries.find(
      (e) => e.productId === lineItem.productId
    )

    if (priceEntry) {
      // Use lookupPriceWithContract to handle tier pricing and contract pricing
      const priceResult = lookupPriceWithContract(
        { ...priceEntry, priceTiers: priceEntry.priceTiers },
        lineItem.quantity,
        activeContract
      )

      const listPrice = priceResult.unitPrice

      // Track contract pricing info for this line item
      if (priceResult.contractApplied && priceResult.contractInfo) {
        contractLineItemInfo[lineItem.id] = priceResult.contractInfo
      }

      // Calculate line item discounts
      const lineDiscountAmount = lineItem.appliedDiscounts.reduce((sum, ad) => {
        if (ad.type === 'PERCENTAGE') {
          return sum + (listPrice * lineItem.quantity * Number(ad.value)) / 100
        }
        return sum + Number(ad.calculatedAmount)
      }, 0)

      const netPrice = listPrice * lineItem.quantity - lineDiscountAmount

      await prisma.quoteLineItem.update({
        where: { id: lineItem.id },
        data: {
          listPrice,
          discount: lineDiscountAmount,
          netPrice: Math.max(0, netPrice),
        },
      })

      // Update percentage-based discount calculated amounts
      for (const discount of lineItem.appliedDiscounts) {
        if (discount.type === 'PERCENTAGE') {
          await prisma.appliedDiscount.update({
            where: { id: discount.id },
            data: {
              calculatedAmount: (listPrice * lineItem.quantity * Number(discount.value)) / 100,
            },
          })
        }
      }
    }
  }

  // Calculate subtotal from all line items
  const updatedLineItems = await prisma.quoteLineItem.findMany({
    where: { quoteId },
  })
  const subtotal = updatedLineItems.reduce((sum, item) => sum + Number(item.netPrice), 0)

  // Calculate gross subtotal (sum of listPrice × quantity before discounts)
  const grossSubtotal = updatedLineItems.reduce(
    (sum, item) => sum + Number(item.listPrice) * item.quantity,
    0
  )

  // Calculate per-line discount percentages and find the maximum
  const lineDiscountPercents = updatedLineItems.map((item) => {
    const lineGross = Number(item.listPrice) * item.quantity
    if (lineGross === 0) return 0
    return (Number(item.discount) / lineGross) * 100
  })
  const maxLineDiscountPercent = lineDiscountPercents.length > 0
    ? Math.max(...lineDiscountPercents)
    : 0

  // Recalculate quote-level discounts
  for (const discount of quote.appliedDiscounts) {
    if (discount.type === 'PERCENTAGE') {
      await prisma.appliedDiscount.update({
        where: { id: discount.id },
        data: {
          calculatedAmount: (subtotal * Number(discount.value)) / 100,
        },
      })
    }
  }

  // Get updated quote-level discounts
  const updatedQuoteDiscounts = await prisma.appliedDiscount.findMany({
    where: { quoteId, lineItemId: null },
  })
  const discountTotal = updatedQuoteDiscounts.reduce(
    (sum, ad) => sum + Number(ad.calculatedAmount),
    0
  )

  // Calculate total
  const total = Math.max(0, subtotal - discountTotal)

  // Calculate aggregate discount percent (total discount as % of gross subtotal)
  const discountPercent = grossSubtotal > 0
    ? ((grossSubtotal - total) / grossSubtotal) * 100
    : 0

  // Evaluate rules
  const rules = await prisma.rule.findMany({
    where: {
      isActive: true,
      trigger: { in: ['ON_QUOTE_SAVE', 'ON_FINALIZE'] },
    },
    orderBy: { priority: 'asc' },
  })

  const evaluationSummary: EvaluationSummary = {
    rules: [],
    warnings: [],
    errors: [],
    requiresApproval: false,
    approvalReasons: [],
    contractPricing: activeContract && Object.keys(contractLineItemInfo).length > 0
      ? {
          contractId: activeContract.id,
          contractName: activeContract.name,
          lineItems: contractLineItemInfo,
        }
      : undefined,
  }

  // Build context for rule evaluation
  const context = {
    quote: {
      subtotal,
      discountTotal,
      total,
      lineItemCount: updatedLineItems.length,
      totalQuantity: updatedLineItems.reduce((sum, li) => sum + li.quantity, 0),
      maxLineDiscountPercent,
      discountPercent,
    },
    customer: quote.customer,
    lineItems: updatedLineItems,
  }

  for (const rule of rules) {
    const condition = rule.condition as unknown as RuleCondition
    const action = rule.action as unknown as RuleAction
    const triggered = evaluateCondition(condition, context)

    const result: RuleEvaluationResult = {
      ruleId: rule.id,
      ruleName: rule.name,
      ruleType: rule.type,
      triggered,
      actions: triggered ? [action] : [],
    }

    evaluationSummary.rules.push(result)

    if (triggered) {
      // Process action
      switch (action.type) {
        case 'REQUIRE_APPROVAL':
          evaluationSummary.requiresApproval = true
          evaluationSummary.approvalReasons.push(action.message || rule.name)
          break
        case 'WARNING':
          evaluationSummary.warnings.push(action.message || rule.name)
          break
        case 'ERROR':
          evaluationSummary.errors.push(action.message || rule.name)
          break
      }
    }
  }

  // Calculate full quote totals including recurring revenue metrics (MRR, ARR, TCV)
  await calculateQuoteTotal(quoteId)

  // Update approval status based on rules evaluation
  const updatedQuote = await prisma.quote.update({
    where: { id: quoteId },
    data: {
      requiresApproval: evaluationSummary.requiresApproval,
    },
    include: {
      customer: {
        select: { id: true, name: true, company: true, email: true },
      },
      priceBook: {
        select: { id: true, name: true },
      },
      lineItems: {
        orderBy: { sortOrder: 'asc' },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              type: true,
            },
          },
          appliedDiscounts: {
            include: {
              discount: { select: { id: true, name: true } },
            },
          },
        },
      },
      appliedDiscounts: {
        where: { lineItemId: null },
        include: {
          discount: { select: { id: true, name: true } },
        },
      },
    },
  })

  return {
    quote: updatedQuote,
    evaluation: evaluationSummary,
  }
})

function evaluateCondition(condition: RuleCondition, context: Record<string, unknown>): boolean {
  const { field, operator, value } = condition

  // Guard against invalid conditions
  if (!field) {
    return false
  }

  // Parse field path (e.g., "quote.total" or "lineItems.length")
  const fieldParts = field.split('.')
  let fieldValue: unknown = context

  for (const part of fieldParts) {
    if (fieldValue && typeof fieldValue === 'object') {
      fieldValue = (fieldValue as Record<string, unknown>)[part]
    } else {
      return false
    }
  }

  // Convert to number if needed
  const numericFieldValue = typeof fieldValue === 'number' ? fieldValue : Number(fieldValue)
  const numericValue = typeof value === 'number' ? value : Number(value)

  switch (operator) {
    case 'GREATER_THAN':
    case '>':
      return numericFieldValue > numericValue
    case 'LESS_THAN':
    case '<':
      return numericFieldValue < numericValue
    case 'GREATER_THAN_OR_EQUAL':
    case '>=':
      return numericFieldValue >= numericValue
    case 'LESS_THAN_OR_EQUAL':
    case '<=':
      return numericFieldValue <= numericValue
    case 'EQUALS':
    case '==':
      return fieldValue === value
    case 'NOT_EQUALS':
    case '!=':
      return fieldValue !== value
    case 'CONTAINS':
      return String(fieldValue).includes(String(value))
    default:
      return false
  }
}
