import { usePrisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const contractId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!contractId) {
    throw createError({
      statusCode: 400,
      message: 'Contract ID is required',
    })
  }

  if (!body.startDate || !body.endDate) {
    throw createError({
      statusCode: 400,
      message: 'New start date and end date are required',
    })
  }

  // Get existing contract with price entries
  const existing = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      priceEntries: true,
    },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Contract not found',
    })
  }

  // Create new contract with copied settings
  const newContract = await prisma.contract.create({
    data: {
      name: body.name || `${existing.name} (Renewed)`,
      customerId: existing.customerId,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      status: 'DRAFT',
      discountPercent: body.discountPercent !== undefined ? body.discountPercent : existing.discountPercent,
      priceEntries: body.copyPrices !== false ? {
        create: existing.priceEntries.map((entry) => ({
          productId: entry.productId,
          fixedPrice: entry.fixedPrice,
        })),
      } : undefined,
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

  return newContract
})
