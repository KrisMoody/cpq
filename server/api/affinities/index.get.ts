import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'
  const type = query.type as string | undefined

  const affinities = await prisma.productAffinity.findMany({
    where: {
      ...(includeInactive ? {} : { isActive: true }),
      ...(type ? { type: type as any } : {}),
    },
    include: {
      sourceProduct: { select: { id: true, name: true, sku: true } },
      targetProduct: { select: { id: true, name: true, sku: true } },
      sourceCategory: { select: { id: true, name: true } },
      targetCategory: { select: { id: true, name: true } },
    },
    orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
  })

  return affinities
})
