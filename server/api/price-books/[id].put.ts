import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Price book ID is required',
    })
  }

  const existing = await prisma.priceBook.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Price book not found',
    })
  }

  // If setting as default, unset any existing default
  if (body.isDefault && !existing.isDefault) {
    await prisma.priceBook.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    })
  }

  const priceBook = await prisma.priceBook.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      currencyId: body.currencyId !== undefined ? (body.currencyId || null) : existing.currencyId,
      taxProfileId: body.taxProfileId !== undefined ? (body.taxProfileId || null) : existing.taxProfileId,
      isDefault: body.isDefault !== undefined ? body.isDefault : existing.isDefault,
      isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
      validFrom: body.validFrom !== undefined
        ? (body.validFrom ? new Date(body.validFrom) : null)
        : existing.validFrom,
      validTo: body.validTo !== undefined
        ? (body.validTo ? new Date(body.validTo) : null)
        : existing.validTo,
    },
    select: {
      id: true,
      name: true,
      currencyId: true,
      taxProfileId: true,
      isDefault: true,
      isActive: true,
      validFrom: true,
      validTo: true,
      currency: {
        select: {
          id: true,
          code: true,
          name: true,
          symbol: true,
        },
      },
      taxProfile: {
        select: {
          id: true,
          name: true,
          country: true,
        },
      },
      _count: {
        select: { entries: true },
      },
    },
  })

  return priceBook
})
