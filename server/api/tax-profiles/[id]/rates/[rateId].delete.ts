import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const rateId = getRouterParam(event, 'rateId')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Tax profile ID is required',
    })
  }

  if (!rateId) {
    throw createError({
      statusCode: 400,
      message: 'Tax rate ID is required',
    })
  }

  // Verify the assignment exists
  const existing = await prisma.taxProfileRate.findUnique({
    where: {
      taxProfileId_taxRateId: {
        taxProfileId: id,
        taxRateId: rateId,
      },
    },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Tax rate is not assigned to this profile',
    })
  }

  // Delete the assignment
  await prisma.taxProfileRate.delete({
    where: {
      taxProfileId_taxRateId: {
        taxProfileId: id,
        taxRateId: rateId,
      },
    },
  })

  // Return the updated profile with remaining rates
  const updatedProfile = await prisma.taxProfile.findUnique({
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

  return {
    ...updatedProfile,
    rates: updatedProfile!.rates.map((r) => r.taxRate),
  }
})
