import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const body = await readBody(event)

  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: 'Price book name is required',
    })
  }

  // If setting as default, unset any existing default
  if (body.isDefault) {
    await prisma.priceBook.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    })
  }

  const priceBook = await prisma.priceBook.create({
    data: {
      name: body.name,
      currencyId: body.currencyId || null,
      taxProfileId: body.taxProfileId || null,
      isDefault: body.isDefault ?? false,
      isActive: body.isActive ?? true,
      validFrom: body.validFrom ? new Date(body.validFrom) : null,
      validTo: body.validTo ? new Date(body.validTo) : null,
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
