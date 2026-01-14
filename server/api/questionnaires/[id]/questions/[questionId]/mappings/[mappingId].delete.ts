import { usePrisma } from '../../../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const mappingId = getRouterParam(event, 'mappingId')

  if (!mappingId) {
    throw createError({
      statusCode: 400,
      message: 'Mapping ID is required',
    })
  }

  const existing = await prisma.questionProductMapping.findUnique({
    where: { id: mappingId },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Mapping not found',
    })
  }

  await prisma.questionProductMapping.delete({ where: { id: mappingId } })

  return { success: true, id: mappingId }
})
