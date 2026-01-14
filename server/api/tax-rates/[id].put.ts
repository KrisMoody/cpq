import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Tax rate ID is required',
    })
  }

  const existingTaxRate = await prisma.taxRate.findUnique({
    where: { id },
  })

  if (!existingTaxRate) {
    throw createError({
      statusCode: 404,
      message: 'Tax rate not found',
    })
  }

  // Validate rate if provided
  if (body.rate !== undefined) {
    const rate = parseFloat(body.rate)
    if (isNaN(rate) || rate < 0 || rate > 1) {
      throw createError({
        statusCode: 400,
        message: 'Rate must be a decimal between 0 and 1 (e.g., 0.0825 for 8.25%)',
      })
    }
  }

  // Validate category exists if provided
  if (body.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: body.categoryId },
    })
    if (!category) {
      throw createError({
        statusCode: 400,
        message: 'Invalid category ID',
      })
    }
  }

  const updateData: Record<string, unknown> = {}

  if (body.name !== undefined) updateData.name = body.name
  if (body.rate !== undefined) updateData.rate = parseFloat(body.rate)
  if (body.country !== undefined) updateData.country = body.country
  if (body.state !== undefined) updateData.state = body.state || null
  if (body.categoryId !== undefined) updateData.categoryId = body.categoryId || null
  if (body.validFrom !== undefined) {
    updateData.validFrom = body.validFrom ? new Date(body.validFrom) : null
  }
  if (body.validTo !== undefined) {
    updateData.validTo = body.validTo ? new Date(body.validTo) : null
  }
  if (body.isActive !== undefined) updateData.isActive = body.isActive

  const taxRate = await prisma.taxRate.update({
    where: { id },
    data: updateData,
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  })

  return taxRate
})
