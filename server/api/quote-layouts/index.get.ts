import { usePrisma } from '../../utils/prisma'
import { getPhase, phaseWhere } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const query = getQuery(event)

  const where: Record<string, unknown> = {
    ...phaseWhere(phase),
  }

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
