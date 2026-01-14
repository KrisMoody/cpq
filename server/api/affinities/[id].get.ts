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

  const affinity = await prisma.productAffinity.findUnique({
    where: { id },
    include: {
      sourceProduct: { select: { id: true, name: true, sku: true } },
      targetProduct: { select: { id: true, name: true, sku: true } },
      sourceCategory: { select: { id: true, name: true } },
      targetCategory: { select: { id: true, name: true } },
    },
  })

  if (!affinity) {
    throw createError({
      statusCode: 404,
      message: 'Affinity not found',
    })
  }

  return affinity
})
