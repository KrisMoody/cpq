import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Questionnaire ID is required',
    })
  }

  const existing = await prisma.questionnaire.findUnique({ where: { id } })
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Questionnaire not found',
    })
  }

  const questionnaire = await prisma.questionnaire.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
    },
  })

  return questionnaire
})
