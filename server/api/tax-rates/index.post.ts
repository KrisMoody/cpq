import { usePrisma } from '../../utils/prisma'
import { getPhase } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const body = await readBody(event)

  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: 'Tax rate name is required',
    })
  }

  if (body.rate === undefined || body.rate === null) {
    throw createError({
      statusCode: 400,
      message: 'Tax rate percentage is required',
    })
  }

  if (!body.country) {
    throw createError({
      statusCode: 400,
      message: 'Country is required',
    })
  }

  // Validate rate is between 0 and 1 (0% to 100%)
  const rate = parseFloat(body.rate)
  if (isNaN(rate) || rate < 0 || rate > 1) {
    throw createError({
      statusCode: 400,
      message: 'Rate must be a decimal between 0 and 1 (e.g., 0.0825 for 8.25%)',
    })
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

  const taxRate = await prisma.taxRate.create({
    data: {
      name: body.name,
      rate: rate,
      country: body.country,
      state: body.state || null,
      categoryId: body.categoryId || null,
      validFrom: body.validFrom ? new Date(body.validFrom) : null,
      validTo: body.validTo ? new Date(body.validTo) : null,
      isActive: body.isActive !== false,
      introducedInPhase: phase,
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  })

  return taxRate
})
