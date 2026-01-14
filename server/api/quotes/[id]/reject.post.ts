import { usePrisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const _body = await readBody(event)

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

  // Can reject from PENDING_APPROVAL or APPROVED status
  if (!['PENDING_APPROVAL', 'APPROVED'].includes(quote.status)) {
    throw createError({
      statusCode: 400,
      message: `Cannot reject quote with status ${quote.status}. Quote must be in PENDING_APPROVAL or APPROVED status.`,
    })
  }

  const updated = await prisma.quote.update({
    where: { id },
    data: {
      status: 'REJECTED',
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
