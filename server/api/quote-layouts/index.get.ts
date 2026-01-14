import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)

  const where: Record<string, unknown> = {}

  // Filter by template
  if (query.template === 'true') {
    where.isTemplate = true
  } else if (query.template === 'false') {
    where.isTemplate = false
  }

  // Filter by entityId
  if (query.entityId && typeof query.entityId === 'string') {
    where.entityId = query.entityId
  }

  const layouts = await prisma.quoteLayout.findMany({
    where,
    orderBy: [{ isTemplate: 'desc' }, { name: 'asc' }],
  })

  return layouts
})
