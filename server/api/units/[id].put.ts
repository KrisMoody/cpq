import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Unit ID is required',
    })
  }

  const existing = await prisma.unitOfMeasure.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Unit not found',
    })
  }

  // Check for duplicate name if changed
  if (body.name && body.name !== existing.name) {
    const existingName = await prisma.unitOfMeasure.findUnique({
      where: { name: body.name },
    })
    if (existingName) {
      throw createError({
        statusCode: 400,
        message: 'A unit with this name already exists',
      })
    }
  }

  // Check for duplicate abbreviation if changed
  if (body.abbreviation && body.abbreviation !== existing.abbreviation) {
    const existingAbbr = await prisma.unitOfMeasure.findUnique({
      where: { abbreviation: body.abbreviation },
    })
    if (existingAbbr) {
      throw createError({
        statusCode: 400,
        message: 'A unit with this abbreviation already exists',
      })
    }
  }

  // Validate base unit if changed
  if (body.baseUnitId !== undefined && body.baseUnitId !== existing.baseUnitId) {
    if (body.baseUnitId) {
      // Cannot set self as base unit
      if (body.baseUnitId === id) {
        throw createError({
          statusCode: 400,
          message: 'Unit cannot be its own base unit',
        })
      }

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
  }

  const unit = await prisma.unitOfMeasure.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      abbreviation: body.abbreviation ?? existing.abbreviation,
      baseUnitId: body.baseUnitId !== undefined ? body.baseUnitId : existing.baseUnitId,
      conversionFactor: body.conversionFactor ?? existing.conversionFactor,
      isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
    },
    include: {
      baseUnit: {
        select: { id: true, name: true, abbreviation: true },
      },
    },
  })

  return unit
})
