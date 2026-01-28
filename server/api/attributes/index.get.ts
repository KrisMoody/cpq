import type { Prisma } from '../../../app/generated/prisma/client'
import { usePrisma } from '../../utils/prisma'
import { getPhase, phaseWhere } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const query = getQuery(event)
  const groupId = query.groupId as string | undefined
  const includeGroup = query.includeGroup === 'true'

  const where: Prisma.AttributeWhereInput = {
    ...phaseWhere(phase),
  }
  if (groupId) {
    where.groupId = groupId
  }

  const attributes = await prisma.attribute.findMany({
    where,
    orderBy: [{ groupId: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    include: includeGroup
      ? {
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        }
      : undefined,
  })

  return attributes
})
