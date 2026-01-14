import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Unit ID is required',
    })
  }

  const unit = await prisma.unitOfMeasure.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true, derived: true },
      },
    },
  })

  if (!unit) {
    throw createError({
      statusCode: 404,
      message: 'Unit not found',
    })
  }

  // Check if unit is in use by products
  if (unit._count.products > 0) {
    throw createError({
      statusCode: 400,
      message: `Cannot delete unit: ${unit._count.products} product(s) are using this unit`,
    })
  }

  // Check if unit is used as base unit for other units
  if (unit._count.derived > 0) {
    throw createError({
      statusCode: 400,
      message: `Cannot delete unit: ${unit._count.derived} other unit(s) use this as their base unit`,
    })
  }

  // Soft delete by deactivating
  const updated = await prisma.unitOfMeasure.update({
    where: { id },
    data: { isActive: false },
  })

  return {
    success: true,
    message: 'Unit deactivated',
    unit: updated,
  }
})
