import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Affinity ID is required',
    })
  }

  const existing = await prisma.productAffinity.findUnique({ where: { id } })
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Affinity not found',
    })
  }

  await prisma.productAffinity.delete({ where: { id } })

  return { success: true, id }
})
