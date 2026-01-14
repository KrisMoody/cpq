import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Contract ID is required',
    })
  }

  // Verify contract exists
  const existing = await prisma.contract.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Contract not found',
    })
  }

  // If changing customer, validate new customer exists
  if (body.customerId && body.customerId !== existing.customerId) {
    const customer = await prisma.customer.findUnique({
      where: { id: body.customerId },
    })
    if (!customer) {
      throw createError({
        statusCode: 400,
        message: 'Invalid customer ID',
      })
    }
  }

  const contract = await prisma.contract.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      customerId: body.customerId ?? existing.customerId,
      startDate: body.startDate ? new Date(body.startDate) : existing.startDate,
      endDate: body.endDate ? new Date(body.endDate) : existing.endDate,
      status: body.status ?? existing.status,
      discountPercent: body.discountPercent !== undefined ? body.discountPercent : existing.discountPercent,
    },
    include: {
      customer: {
        select: { id: true, name: true, company: true },
      },
      priceEntries: {
        include: {
          product: {
            select: { id: true, name: true, sku: true },
          },
        },
      },
    },
  })

  return contract
})
