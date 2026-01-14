import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const contractId = getRouterParam(event, 'id')
  const entryId = getRouterParam(event, 'entryId')

  if (!contractId || !entryId) {
    throw createError({
      statusCode: 400,
      message: 'Contract ID and entry ID are required',
    })
  }

  // Verify entry exists and belongs to the contract
  const existing = await prisma.contractPriceEntry.findFirst({
    where: {
      id: entryId,
      contractId,
    },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Price entry not found',
    })
  }

  await prisma.contractPriceEntry.delete({
    where: { id: entryId },
  })

  return { success: true }
})
