import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Tax rate ID is required',
    })
  }

  const existingTaxRate = await prisma.taxRate.findUnique({
    where: { id },
  })

  if (!existingTaxRate) {
    throw createError({
      statusCode: 404,
      message: 'Tax rate not found',
    })
  }

  // Soft delete by deactivating instead of hard delete
  const taxRate = await prisma.taxRate.update({
    where: { id },
    data: { isActive: false },
  })

  return { success: true, id: taxRate.id }
})
