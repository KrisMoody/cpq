import { RuleType } from '../../../app/generated/prisma/client.js'
import { usePrisma } from '../../utils/prisma'

function isValidRuleType(value: string): value is RuleType {
  return Object.values(RuleType).includes(value as RuleType)
}

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)
  const type = query.type as string | undefined

  const rules = await prisma.rule.findMany({
    where: {
      ...(type && isValidRuleType(type) ? { type } : {}),
    },
    orderBy: [{ priority: 'asc' }, { name: 'asc' }],
  })

  return rules
})
