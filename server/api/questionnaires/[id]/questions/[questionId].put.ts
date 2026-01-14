import { usePrisma } from '../../../../utils/prisma'

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

  const existing = await prisma.question.findFirst({
    where: { id: questionId, questionnaireId },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Question not found',
    })
  }

  const validTypes = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'RANGE', 'YES_NO']
  if (body.type && !validTypes.includes(body.type)) {
    throw createError({
      statusCode: 400,
      message: `type must be one of: ${validTypes.join(', ')}`,
    })
  }

  const question = await prisma.question.update({
    where: { id: questionId },
    data: {
      ...(body.text && { text: body.text }),
      ...(body.type && { type: body.type }),
      ...(body.options !== undefined && { options: body.options }),
      ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      ...(body.branchLogic !== undefined && { branchLogic: body.branchLogic }),
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
