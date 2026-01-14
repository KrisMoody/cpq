import { usePrisma } from '../../utils/prisma'
import { ProductType } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required',
    })
  }

  // Check product exists
  const existing = await prisma.product.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Product not found',
    })
  }

  // Validate SKU uniqueness if changed
  if (body.sku && body.sku !== existing.sku) {
    const skuExists = await prisma.product.findUnique({
      where: { sku: body.sku },
    })
    if (skuExists) {
      throw createError({
        statusCode: 400,
        message: 'A product with this SKU already exists',
      })
    }
  }

  // Validate unit of measure if changed
  if (body.unitOfMeasureId !== undefined && body.unitOfMeasureId !== existing.unitOfMeasureId) {
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
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      description: body.description !== undefined ? body.description : existing.description,
      sku: body.sku ?? existing.sku,
      type: body.type ?? existing.type,
      billingFrequency: body.billingFrequency ?? existing.billingFrequency,
      customBillingMonths: body.customBillingMonths !== undefined ? body.customBillingMonths : existing.customBillingMonths,
      defaultTermMonths: body.defaultTermMonths !== undefined ? body.defaultTermMonths : existing.defaultTermMonths,
      isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
      unitOfMeasureId: body.unitOfMeasureId !== undefined ? body.unitOfMeasureId : existing.unitOfMeasureId,
    },
    include: {
      unitOfMeasure: {
        select: { id: true, name: true, abbreviation: true },
      },
    },
  })

  return product
})
