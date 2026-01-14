import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const questionnaireId = getRouterParam(event, 'id')
  const questionId = getRouterParam(event, 'questionId')

  if (!questionnaireId || !questionId) {
    throw createError({
      statusCode: 400,
      message: 'Questionnaire ID and Question ID are required',
    })
  }

  const existing = await prisma.question.findFirst({
    where: { id: questionId, questionnaireId },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Question not found',
    })
  }

  await prisma.question.delete({ where: { id: questionId } })

  return { success: true, id: questionId }
})
