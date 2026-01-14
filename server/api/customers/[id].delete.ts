import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Customer ID is required',
    })
  }

  // Check customer exists
  const existing = await prisma.customer.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Customer not found',
    })
  }

  // Soft delete - set isActive to false
  const customer = await prisma.customer.update({
    where: { id },
    data: { isActive: false },
  })

  return { success: true, id: customer.id }
})
