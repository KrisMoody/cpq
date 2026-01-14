import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

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

  // Delete the contract (price entries will cascade delete)
  await prisma.contract.delete({
    where: { id },
  })

  return { success: true }
})
