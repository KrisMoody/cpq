import { usePrisma } from '../../../utils/prisma'

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

  if (!body.taxRateId) {
    throw createError({
      statusCode: 400,
      message: 'Tax rate ID is required',
    })
  }

  // Verify profile exists
  const profile = await prisma.taxProfile.findUnique({
    where: { id },
  })

  if (!profile) {
    throw createError({
      statusCode: 404,
      message: 'Tax profile not found',
    })
  }

  // Verify tax rate exists
  const taxRate = await prisma.taxRate.findUnique({
    where: { id: body.taxRateId },
  })

  if (!taxRate) {
    throw createError({
      statusCode: 400,
      message: 'Tax rate not found',
    })
  }

  // Check if already assigned
  const existing = await prisma.taxProfileRate.findUnique({
    where: {
      taxProfileId_taxRateId: {
        taxProfileId: id,
        taxRateId: body.taxRateId,
      },
    },
  })

  if (existing) {
    throw createError({
      statusCode: 400,
      message: 'Tax rate is already assigned to this profile',
    })
  }

  // Create the assignment
  await prisma.taxProfileRate.create({
    data: {
      taxProfileId: id,
      taxRateId: body.taxRateId,
    },
  })

  // Return the updated profile with all rates
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
