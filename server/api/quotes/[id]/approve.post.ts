import { usePrisma } from '../../../utils/prisma'

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

  const quote = await prisma.quote.findUnique({
    where: { id },
  })

  if (!quote) {
    throw createError({
      statusCode: 404,
      message: 'Quote not found',
    })
  }

  // Must be in PENDING_APPROVAL status
  if (quote.status !== 'PENDING_APPROVAL') {
    throw createError({
      statusCode: 400,
      message: `Cannot approve quote with status ${quote.status}. Quote must be in PENDING_APPROVAL status.`,
    })
  }

  const updated = await prisma.quote.update({
    where: { id },
    data: {
      status: 'APPROVED',
      approvedAt: new Date(),
      approvedBy: body.approvedBy || 'admin',
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

  return updated
})
