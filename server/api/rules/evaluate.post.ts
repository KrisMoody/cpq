import { usePrisma } from '../../utils/prisma'
import { evaluateRules, type RuleContext } from '../../services/ruleEngine'
import type { RuleTrigger, RuleType } from '../../../app/generated/prisma/client.js'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const body = await readBody(event)

  if (!body.trigger) {
    throw createError({
      statusCode: 400,
      message: 'Trigger is required',
    })
  }

  if (!body.context || typeof body.context !== 'object') {
    throw createError({
      statusCode: 400,
      message: 'Context is required and must be an object',
    })
  }

  // Fetch all active rules
  const rules = await prisma.rule.findMany({
    where: { isActive: true },
    orderBy: { priority: 'asc' },
  })

  const context: RuleContext = body.context
  const trigger = body.trigger as RuleTrigger
  const type = body.type as RuleType | undefined

  const result = evaluateRules(rules, trigger, context, type)

  return result
})
