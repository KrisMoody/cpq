import { usePrisma } from '../../utils/prisma'
import { getPhase } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const body = await readBody(event)

  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: 'Customer name is required',
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

  // Validate currency exists if provided
  if (body.currencyId) {
    const currency = await prisma.currency.findUnique({
      where: { id: body.currencyId },
    })
    if (!currency) {
      throw createError({
        statusCode: 400,
        message: 'Invalid currency ID',
      })
    }
  }

  const customer = await prisma.customer.create({
    data: {
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      company: body.company || null,
      street: body.street || null,
      city: body.city || null,
      state: body.state || null,
      postalCode: body.postalCode || null,
      country: body.country || null,
      priceBookId: body.priceBookId || null,
      currencyId: body.currencyId || null,
      isTaxExempt: body.isTaxExempt || false,
      taxExemptReason: body.taxExemptReason || null,
      taxExemptCertificate: body.taxExemptCertificate || null,
      taxExemptExpiry: body.taxExemptExpiry ? new Date(body.taxExemptExpiry) : null,
      introducedInPhase: phase,
    },
    include: {
      priceBook: {
        select: { id: true, name: true },
      },
      currency: {
        select: { id: true, code: true, name: true, symbol: true },
      },
    },
  })

  return customer
})
