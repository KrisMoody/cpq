import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

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

  await prisma.questionnaire.delete({ where: { id } })

  return { success: true, id }
})
