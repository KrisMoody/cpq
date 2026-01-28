import { usePrisma } from '../../utils/prisma'
import { getPhase } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const body = await readBody(event)

  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: 'Discount name is required',
    })
  }

  if (!body.type || !['PERCENTAGE', 'FIXED_AMOUNT'].includes(body.type)) {
    throw createError({
      statusCode: 400,
      message: 'Valid discount type is required (PERCENTAGE or FIXED_AMOUNT)',
    })
  }

  if (body.value === undefined || body.value === null) {
    throw createError({
      statusCode: 400,
      message: 'Discount value is required',
    })
  }

  if (!body.scope || !['LINE_ITEM', 'QUOTE', 'PRODUCT_CATEGORY'].includes(body.scope)) {
    throw createError({
      statusCode: 400,
      message: 'Valid discount scope is required',
    })
  }

  const discount = await prisma.discount.create({
    data: {
      name: body.name,
      description: body.description || null,
      type: body.type,
      value: body.value,
      scope: body.scope,
      minQuantity: body.minQuantity ?? null,
      maxQuantity: body.maxQuantity ?? null,
      minOrderValue: body.minOrderValue ?? null,
      validFrom: body.validFrom ? new Date(body.validFrom) : null,
      validTo: body.validTo ? new Date(body.validTo) : null,
      isActive: body.isActive ?? true,
      stackable: body.stackable ?? false,
      priority: body.priority ?? 100,
      introducedInPhase: phase,
      tiers: body.tiers ? {
        create: (body.tiers as Array<{ minQuantity: number; maxQuantity?: number | null; value: number }>).map((tier, index) => ({
          tierNumber: index + 1,
          minQuantity: tier.minQuantity,
          maxQuantity: tier.maxQuantity ?? null,
          value: tier.value,
        })),
      } : undefined,
    },
    include: {
      tiers: {
        orderBy: { tierNumber: 'asc' },
      },
    },
  })

  return discount
})
