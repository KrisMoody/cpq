import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Discount ID is required',
    })
  }

  const existing = await prisma.discount.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Discount not found',
    })
  }

  // Validate type if provided
  if (body.type && !['PERCENTAGE', 'FIXED_AMOUNT'].includes(body.type)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid discount type',
    })
  }

  // Validate scope if provided
  if (body.scope && !['LINE_ITEM', 'QUOTE', 'PRODUCT_CATEGORY'].includes(body.scope)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid discount scope',
    })
  }

  // If tiers are provided, replace all existing tiers
  if (body.tiers !== undefined) {
    await prisma.discountTier.deleteMany({
      where: { discountId: id },
    })
  }

  const discount = await prisma.discount.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      description: body.description !== undefined ? body.description : existing.description,
      type: body.type ?? existing.type,
      value: body.value ?? existing.value,
      scope: body.scope ?? existing.scope,
      minQuantity: body.minQuantity !== undefined ? body.minQuantity : existing.minQuantity,
      maxQuantity: body.maxQuantity !== undefined ? body.maxQuantity : existing.maxQuantity,
      minOrderValue: body.minOrderValue !== undefined ? body.minOrderValue : existing.minOrderValue,
      validFrom: body.validFrom !== undefined ? (body.validFrom ? new Date(body.validFrom) : null) : existing.validFrom,
      validTo: body.validTo !== undefined ? (body.validTo ? new Date(body.validTo) : null) : existing.validTo,
      isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
      stackable: body.stackable !== undefined ? body.stackable : existing.stackable,
      priority: body.priority ?? existing.priority,
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
