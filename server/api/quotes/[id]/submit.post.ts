import { usePrisma } from '../../../utils/prisma'

const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['PENDING_APPROVAL', 'APPROVED'],
  PENDING_APPROVAL: ['APPROVED', 'REJECTED'],
  APPROVED: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: ['FINALIZED'],
}

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
    include: {
      customer: true,
    },
  })

  if (!quote) {
    throw createError({
      statusCode: 404,
      message: 'Quote not found',
    })
  }

  // Must be in DRAFT status to submit
  if (quote.status !== 'DRAFT') {
    throw createError({
      statusCode: 400,
      message: `Cannot submit quote with status ${quote.status}. Quote must be in DRAFT status.`,
    })
  }

  // Customer is required for submission
  if (!quote.customerId) {
    throw createError({
      statusCode: 400,
      message: 'Customer is required to submit a quote. Please assign a customer first.',
    })
  }

  // Determine target status based on whether approval is required
  const targetStatus = quote.requiresApproval ? 'PENDING_APPROVAL' : 'APPROVED'

  const updated = await prisma.quote.update({
    where: { id },
    data: {
      status: targetStatus,
      ...(targetStatus === 'APPROVED' ? {
        approvedAt: new Date(),
        approvedBy: 'system', // Auto-approved
      } : {}),
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
