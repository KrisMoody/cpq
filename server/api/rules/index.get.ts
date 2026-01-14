import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)
  const type = query.type as string | undefined

  const rules = await prisma.rule.findMany({
    where: {
      ...(type ? { type: type as any } : {}),
    },
    orderBy: [{ priority: 'asc' }, { name: 'asc' }],
  })

  return rules
})
