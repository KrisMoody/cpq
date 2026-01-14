import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)
  const includeAttributes = query.includeAttributes === 'true'

  const groups = await prisma.attributeGroup.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: includeAttributes
      ? {
          attributes: {
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          },
        }
      : undefined,
  })

  return groups
})
