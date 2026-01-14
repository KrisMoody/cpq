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

  const questionnaire = await prisma.questionnaire.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { sortOrder: 'asc' },
        include: {
          productMappings: {
            include: {
              product: {
                select: { id: true, name: true, sku: true },
              },
            },
          },
        },
      },
    },
  })

  if (!questionnaire) {
    throw createError({
      statusCode: 404,
      message: 'Questionnaire not found',
    })
  }

  return questionnaire
})
