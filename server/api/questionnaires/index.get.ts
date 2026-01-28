import { usePrisma } from '../../utils/prisma'
import { getPhase, phaseWhere } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'

  const questionnaires = await prisma.questionnaire.findMany({
    where: {
      ...phaseWhere(phase),
      ...(includeInactive ? {} : { isActive: true }),
    },
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
