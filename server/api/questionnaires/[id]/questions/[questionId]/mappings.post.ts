import { usePrisma } from '../../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const questionnaireId = getRouterParam(event, 'id')
  const questionId = getRouterParam(event, 'questionId')
  const body = await readBody(event)

  if (!questionnaireId || !questionId) {
    throw createError({
      statusCode: 400,
      message: 'Questionnaire ID and Question ID are required',
    })
  }

  const question = await prisma.question.findFirst({
    where: { id: questionId, questionnaireId },
  })

  if (!question) {
    throw createError({
      statusCode: 404,
      message: 'Question not found',
    })
  }

  if (!body.answerValue) {
    throw createError({
      statusCode: 400,
      message: 'answerValue is required',
    })
  }

  if (!body.productId) {
    throw createError({
      statusCode: 400,
      message: 'productId is required',
    })
  }

  const mapping = await prisma.questionProductMapping.create({
    data: {
      questionId,
      answerValue: body.answerValue,
      productId: body.productId,
      score: body.score ?? 100,
    },
    include: {
      product: { select: { id: true, name: true, sku: true } },
    },
  })

  return mapping
})
