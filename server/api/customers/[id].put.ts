import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Customer ID is required',
    })
  }

  // Check customer exists
  const existing = await prisma.customer.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Customer not found',
    })
  }

  // Validate price book exists if provided
  if (body.priceBookId) {
    const priceBook = await prisma.priceBook.findUnique({
      where: { id: body.priceBookId },
    })
    if (!priceBook) {
      throw createError({
        statusCode: 400,
        message: 'Invalid price book ID',
      })
    }
  }

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      email: body.email !== undefined ? body.email : existing.email,
      phone: body.phone !== undefined ? body.phone : existing.phone,
      company: body.company !== undefined ? body.company : existing.company,
      street: body.street !== undefined ? body.street : existing.street,
      city: body.city !== undefined ? body.city : existing.city,
      state: body.state !== undefined ? body.state : existing.state,
      postalCode: body.postalCode !== undefined ? body.postalCode : existing.postalCode,
      country: body.country !== undefined ? body.country : existing.country,
      priceBookId: body.priceBookId !== undefined ? body.priceBookId : existing.priceBookId,
      isTaxExempt: body.isTaxExempt !== undefined ? body.isTaxExempt : existing.isTaxExempt,
      taxExemptReason: body.taxExemptReason !== undefined ? body.taxExemptReason : existing.taxExemptReason,
      taxExemptCertificate: body.taxExemptCertificate !== undefined ? body.taxExemptCertificate : existing.taxExemptCertificate,
      taxExemptExpiry: body.taxExemptExpiry !== undefined
        ? (body.taxExemptExpiry ? new Date(body.taxExemptExpiry) : null)
        : existing.taxExemptExpiry,
      isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
    },
    include: {
      priceBook: {
        select: { id: true, name: true },
      },
    },
  })

  return customer
})
