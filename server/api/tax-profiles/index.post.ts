import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const body = await readBody(event)

  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: 'Tax profile name is required',
    })
  }

  if (!body.country) {
    throw createError({
      statusCode: 400,
      message: 'Country is required',
    })
  }

  const taxProfile = await prisma.taxProfile.create({
    data: {
      name: body.name,
      description: body.description || null,
      country: body.country,
      isActive: body.isActive !== false,
    },
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
