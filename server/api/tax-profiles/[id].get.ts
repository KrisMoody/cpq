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

  const taxProfile = await prisma.taxProfile.findUnique({
    where: { id },
    include: {
      rates: {
        include: {
          taxRate: {
            include: {
              category: {
                select: { id: true, name: true },
              },
            },
          },
        },
      },
    },
  })

  if (!taxProfile) {
    throw createError({
      statusCode: 404,
      message: 'Tax profile not found',
    })
  }

  return {
    ...taxProfile,
    rates: taxProfile.rates.map((r) => r.taxRate),
  }
})
