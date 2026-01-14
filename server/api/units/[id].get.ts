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
      baseUnit: {
        select: { id: true, name: true, abbreviation: true },
      },
      derived: {
        select: { id: true, name: true, abbreviation: true, conversionFactor: true },
      },
      _count: {
        select: { products: true },
      },
    },
  })

  if (!unit) {
    throw createError({
      statusCode: 404,
      message: 'Unit not found',
    })
  }

  return {
    ...unit,
    productCount: unit._count.products,
    _count: undefined,
  }
})
