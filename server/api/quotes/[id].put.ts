import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Quote ID is required',
    })
  }

  // Validate customerId if provided
  if (body.customerId) {
    const customer = await prisma.customer.findUnique({
      where: { id: body.customerId },
    })
    if (!customer) {
      throw createError({
        statusCode: 400,
        message: 'Customer not found',
      })
    }
  }

  const quote = await prisma.quote.update({
    where: { id },
    data: {
      name: body.name,
      customerId: body.customerId !== undefined ? body.customerId : undefined,
      status: body.status,
      validTo: body.validTo ? new Date(body.validTo) : undefined,
    },
    include: {
      customer: {
        select: { id: true, name: true, company: true },
      },
      priceBook: {
        select: { id: true, name: true },
      },
    },
  })

  return quote
})
