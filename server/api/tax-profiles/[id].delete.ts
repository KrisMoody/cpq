import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Tax profile ID is required',
    })
  }

  const existingProfile = await prisma.taxProfile.findUnique({
    where: { id },
  })

  if (!existingProfile) {
    throw createError({
      statusCode: 404,
      message: 'Tax profile not found',
    })
  }

  // Soft delete by setting isActive to false
  const taxProfile = await prisma.taxProfile.update({
    where: { id },
    data: { isActive: false },
  })

  return taxProfile
})
