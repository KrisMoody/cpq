import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Rule ID is required',
    })
  }

  const rule = await prisma.rule.findUnique({
    where: { id },
  })

  if (!rule) {
    throw createError({
      statusCode: 404,
      message: 'Rule not found',
    })
  }

  return rule
})
