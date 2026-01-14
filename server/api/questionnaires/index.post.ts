import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
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
    },
  })

  return questionnaire
})
