import { usePrisma } from '../../utils/prisma'
import { ProductType, BillingFrequency } from '../../../app/generated/prisma/client.js'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const body = await readBody(event)

  // Validate unit of measure if provided
  if (body.unitOfMeasureId) {
    const unit = await prisma.unitOfMeasure.findUnique({
      where: { id: body.unitOfMeasureId },
    })
    if (!unit) {
      throw createError({
        statusCode: 400,
        message: 'Unit of measure not found',
      })
    }
  }

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      sku: body.sku,
      type: body.type || ProductType.STANDALONE,
      billingFrequency: body.billingFrequency || BillingFrequency.ONE_TIME,
      customBillingMonths: body.customBillingMonths || null,
      defaultTermMonths: body.defaultTermMonths || null,
      isActive: body.isActive ?? true,
      unitOfMeasureId: body.unitOfMeasureId || null,
    },
    include: {
      unitOfMeasure: {
        select: { id: true, name: true, abbreviation: true },
      },
    },
  })

  return product
})
