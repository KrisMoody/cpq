import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Layout ID is required',
    })
  }

  // Check if layout exists
  const existing = await prisma.quoteLayout.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Layout not found',
    })
  }

  await prisma.quoteLayout.delete({
    where: { id },
  })

  return { success: true }
})
