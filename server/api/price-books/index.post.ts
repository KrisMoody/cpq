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
      isDefault: body.isDefault ?? false,
      isActive: body.isActive ?? true,
      validFrom: body.validFrom ? new Date(body.validFrom) : null,
      validTo: body.validTo ? new Date(body.validTo) : null,
    },
    select: {
      id: true,
      name: true,
      isDefault: true,
      isActive: true,
      validFrom: true,
      validTo: true,
      _count: {
        select: { entries: true },
      },
    },
  })

  return priceBook
})
