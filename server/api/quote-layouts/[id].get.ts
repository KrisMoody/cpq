import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Layout ID is required',
    })
  }

  const layout = await prisma.quoteLayout.findUnique({
    where: { id },
  })

  if (!layout) {
    throw createError({
      statusCode: 404,
      message: 'Layout not found',
    })
  }

  return layout
})
