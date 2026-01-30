import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

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

  const updateData: Record<string, unknown> = {}

  if (body.name !== undefined) updateData.name = body.name
  if (body.description !== undefined) updateData.description = body.description || null
  if (body.country !== undefined) updateData.country = body.country
  if (body.isActive !== undefined) updateData.isActive = body.isActive

  const taxProfile = await prisma.taxProfile.update({
    where: { id },
    data: updateData,
    include: {
      _count: {
        select: { rates: true },
      },
    },
  })

  return {
    ...taxProfile,
    ratesCount: taxProfile._count.rates,
    _count: undefined,
  }
})
