import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const body = await readBody(event)

  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: 'Unit name is required',
    })
  }

  if (!body.abbreviation) {
    throw createError({
      statusCode: 400,
      message: 'Unit abbreviation is required',
    })
  }

  // Check for duplicate name
  const existingName = await prisma.unitOfMeasure.findUnique({
    where: { name: body.name },
  })
  if (existingName) {
    throw createError({
      statusCode: 400,
      message: 'A unit with this name already exists',
    })
  }

  // Check for duplicate abbreviation
  const existingAbbr = await prisma.unitOfMeasure.findUnique({
    where: { abbreviation: body.abbreviation },
  })
  if (existingAbbr) {
    throw createError({
      statusCode: 400,
      message: 'A unit with this abbreviation already exists',
    })
  }

  // Validate base unit exists if provided
  if (body.baseUnitId) {
    const baseUnit = await prisma.unitOfMeasure.findUnique({
      where: { id: body.baseUnitId },
    })
    if (!baseUnit) {
      throw createError({
        statusCode: 400,
        message: 'Base unit not found',
      })
    }
  }

  const unit = await prisma.unitOfMeasure.create({
    data: {
      name: body.name,
      abbreviation: body.abbreviation,
      baseUnitId: body.baseUnitId || null,
      conversionFactor: body.conversionFactor ?? 1,
    },
    include: {
      baseUnit: {
        select: { id: true, name: true, abbreviation: true },
      },
    },
  })

  return unit
})
