import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Quote ID is required',
    })
  }

  const quote = await prisma.quote.findUnique({
    where: { id },
    select: { id: true, status: true },
  })

  if (!quote) {
    throw createError({
      statusCode: 404,
      message: 'Quote not found',
    })
  }

  // Prevent deletion of finalized or accepted quotes
  if (quote.status === 'FINALIZED' || quote.status === 'ACCEPTED') {
    throw createError({
      statusCode: 400,
      message: `Cannot delete a quote with status ${quote.status}. Only draft, pending, approved, or rejected quotes can be deleted.`,
    })
  }

  // Soft delete by setting status to CANCELLED
  const updated = await prisma.quote.update({
    where: { id },
    data: { status: 'CANCELLED' },
  })

  return { success: true, quote: updated }
})
