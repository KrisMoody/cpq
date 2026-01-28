import { usePrisma } from '../../utils/prisma'
import { getPhase } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const body = await readBody(event)

  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: 'Questionnaire name is required',
    })
  }

  const questionnaire = await prisma.questionnaire.create({
    data: {
      name: body.name,
      description: body.description || null,
      isActive: body.isActive ?? true,
      introducedInPhase: phase,
    },
  })

  return questionnaire
})
