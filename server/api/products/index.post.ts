import { usePrisma } from '../../utils/prisma'
import { getPhase } from '../../utils/phase'
import { ProductType, BillingFrequency } from '../../../app/generated/prisma/client'

interface FeatureInput {
  name: string
  minOptions?: number
  maxOptions?: number
  sortOrder?: number
  options?: Array<{
    optionProductId: string
    isRequired?: boolean
    isDefault?: boolean
    minQty?: number
    maxQty?: number
    sortOrder?: number
  }>
}

interface AttributeInput {
  attributeId: string
  value: unknown
}

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
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

  // Validate features are only provided for BUNDLE type
  const productType = body.type || ProductType.STANDALONE
  if (body.features?.length && productType !== ProductType.BUNDLE) {
    throw createError({
      statusCode: 400,
      message: 'Features can only be added to BUNDLE type products',
    })
  }

  // Validate option products exist and are STANDALONE if features are provided
  if (body.features?.length) {
    const optionProductIds = body.features
      .flatMap((f: FeatureInput) => f.options || [])
      .map((o: { optionProductId: string }) => o.optionProductId)

    if (optionProductIds.length > 0) {
      const existingProducts = await prisma.product.findMany({
        where: { id: { in: optionProductIds } },
        select: { id: true, type: true },
      })

      const existingIds = new Set(existingProducts.map((p) => p.id))
      const missingIds = optionProductIds.filter((id: string) => !existingIds.has(id))
      if (missingIds.length > 0) {
        throw createError({
          statusCode: 400,
          message: `Option products not found: ${missingIds.join(', ')}`,
        })
      }

      const nonStandaloneProducts = existingProducts.filter((p) => p.type !== ProductType.STANDALONE)
      if (nonStandaloneProducts.length > 0) {
        throw createError({
          statusCode: 400,
          message: 'Option products must be STANDALONE type',
        })
      }
    }
  }

  // Validate categories exist if provided
  if (body.categoryIds?.length) {
    const categories = await prisma.category.findMany({
      where: { id: { in: body.categoryIds } },
      select: { id: true },
    })
    const existingIds = new Set(categories.map((c) => c.id))
    const missingIds = body.categoryIds.filter((id: string) => !existingIds.has(id))
    if (missingIds.length > 0) {
      throw createError({
        statusCode: 400,
        message: `Categories not found: ${missingIds.join(', ')}`,
      })
    }
  }

  // Validate attributes exist if provided
  if (body.attributes?.length) {
    const attributeIds = body.attributes.map((a: AttributeInput) => a.attributeId)
    const attributes = await prisma.attribute.findMany({
      where: { id: { in: attributeIds } },
      select: { id: true },
    })
    const existingIds = new Set(attributes.map((a) => a.id))
    const missingIds = attributeIds.filter((id: string) => !existingIds.has(id))
    if (missingIds.length > 0) {
      throw createError({
        statusCode: 400,
        message: `Attributes not found: ${missingIds.join(', ')}`,
      })
    }
  }

  // Create product with all associations in a transaction
  const product = await prisma.$transaction(async (tx) => {
    // Create the product with current phase
    const newProduct = await tx.product.create({
      data: {
        name: body.name,
        description: body.description,
        sku: body.sku,
        type: productType,
        billingFrequency: body.billingFrequency || BillingFrequency.ONE_TIME,
        customBillingMonths: body.customBillingMonths || null,
        defaultTermMonths: body.defaultTermMonths || null,
        isActive: body.isActive ?? true,
        unitOfMeasureId: body.unitOfMeasureId || null,
        introducedInPhase: phase,
      },
    })

    // Create category associations
    if (body.categoryIds?.length) {
      await tx.productCategory.createMany({
        data: body.categoryIds.map((categoryId: string) => ({
          productId: newProduct.id,
          categoryId,
        })),
      })
    }

    // Create attribute values
    if (body.attributes?.length) {
      await tx.productAttribute.createMany({
        data: body.attributes
          .filter((a: AttributeInput) => a.value !== null && a.value !== undefined)
          .map((a: AttributeInput) => ({
            productId: newProduct.id,
            attributeId: a.attributeId,
            value: a.value,
          })),
      })
    }

    // Create features and options
    if (body.features?.length) {
      for (let i = 0; i < body.features.length; i++) {
        const featureInput = body.features[i] as FeatureInput
        const feature = await tx.productFeature.create({
          data: {
            productId: newProduct.id,
            name: featureInput.name,
            minOptions: featureInput.minOptions ?? 0,
            maxOptions: featureInput.maxOptions ?? 1,
            sortOrder: featureInput.sortOrder ?? i,
          },
        })

        // Create options for this feature
        if (featureInput.options?.length) {
          await tx.productOption.createMany({
            data: featureInput.options.map((opt, j) => ({
              featureId: feature.id,
              optionProductId: opt.optionProductId,
              isRequired: opt.isRequired ?? false,
              isDefault: opt.isDefault ?? false,
              minQty: opt.minQty ?? 1,
              maxQty: opt.maxQty ?? 1,
              sortOrder: opt.sortOrder ?? j,
            })),
          })
        }
      }
    }

    // Fetch and return the complete product
    return tx.product.findUnique({
      where: { id: newProduct.id },
      include: {
        unitOfMeasure: {
          select: { id: true, name: true, abbreviation: true },
        },
        categories: {
          include: {
            category: {
              select: { id: true, name: true },
            },
          },
        },
        attributes: {
          include: {
            attribute: {
              select: {
                id: true,
                name: true,
                code: true,
                type: true,
                groupId: true,
              },
            },
          },
        },
        features: {
          orderBy: { sortOrder: 'asc' },
          include: {
            options: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    })
  })

  return product
})
