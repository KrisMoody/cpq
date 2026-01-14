import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const entryId = getRouterParam(event, 'entryId')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Price book ID is required',
    })
  }

  if (!entryId) {
    throw createError({
      statusCode: 400,
      message: 'Entry ID is required',
    })
  }

  // Check entry exists and belongs to price book
  const existing = await prisma.priceBookEntry.findFirst({
    where: {
      id: entryId,
      priceBookId: id,
    },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Price book entry not found',
    })
  }

  await prisma.priceBookEntry.delete({
    where: { id: entryId },
  })

  return { success: true }
})
