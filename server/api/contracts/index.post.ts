import { usePrisma } from '../../utils/prisma'
import { getPhase } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const body = await readBody(event)

  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: 'Contract name is required',
    })
  }

  if (!body.customerId) {
    throw createError({
      statusCode: 400,
      message: 'Customer is required',
    })
  }

  if (!body.startDate || !body.endDate) {
    throw createError({
      statusCode: 400,
      message: 'Start date and end date are required',
    })
  }

  // Validate customer exists
  const customer = await prisma.customer.findUnique({
    where: { id: body.customerId },
  })
  if (!customer) {
    throw createError({
      statusCode: 400,
      message: 'Invalid customer ID',
    })
  }

  const contract = await prisma.contract.create({
    data: {
      name: body.name,
      customerId: body.customerId,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      status: body.status || 'DRAFT',
      discountPercent: body.discountPercent ?? null,
      introducedInPhase: phase,
    },
    include: {
      customer: {
        select: { id: true, name: true, company: true },
      },
    },
  })

  return contract
})
