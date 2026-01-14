import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Discount ID is required',
    })
  }

  const existing = await prisma.discount.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Discount not found',
    })
  }

  await prisma.discount.delete({
    where: { id },
  })

  return { success: true, id }
})
