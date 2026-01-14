import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'

  const questionnaires = await prisma.questionnaire.findMany({
    where: includeInactive ? {} : { isActive: true },
    include: {
      questions: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          text: true,
          type: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  return questionnaires.map((q) => ({
    ...q,
    questionCount: q.questions.length,
  }))
})
