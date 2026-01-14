import { usePrisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const questionnaireId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!questionnaireId) {
    throw createError({
      statusCode: 400,
      message: 'Questionnaire ID is required',
    })
  }

  const questionnaire = await prisma.questionnaire.findUnique({
    where: { id: questionnaireId },
  })

  if (!questionnaire) {
    throw createError({
      statusCode: 404,
      message: 'Questionnaire not found',
    })
  }

  if (!body.text) {
    throw createError({
      statusCode: 400,
      message: 'Question text is required',
    })
  }

  const validTypes = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'RANGE', 'YES_NO']
  if (!body.type || !validTypes.includes(body.type)) {
    throw createError({
      statusCode: 400,
      message: `type is required and must be one of: ${validTypes.join(', ')}`,
    })
  }

  // Get highest sort order
  const lastQuestion = await prisma.question.findFirst({
    where: { questionnaireId },
    orderBy: { sortOrder: 'desc' },
  })
  const sortOrder = body.sortOrder ?? (lastQuestion ? lastQuestion.sortOrder + 1 : 0)

  const question = await prisma.question.create({
    data: {
      questionnaireId,
      text: body.text,
      type: body.type,
      options: body.options || null,
      sortOrder,
      branchLogic: body.branchLogic || null,
    },
    include: {
      productMappings: {
        include: {
          product: { select: { id: true, name: true, sku: true } },
        },
      },
    },
  })

  return question
})
