import type { AttributeValue } from '../../../../app/types/domain'
import { usePrisma } from '../../../utils/prisma'

interface AttributeInput {
  attributeId: string
  value: AttributeValue
}

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const productId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!productId) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required',
    })
  }

  // Validate product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw createError({
      statusCode: 404,
      message: 'Product not found',
    })
  }

  // Body should be an array of { attributeId, value }
  if (!Array.isArray(body.attributes)) {
    throw createError({
      statusCode: 400,
      message: 'Attributes must be an array of { attributeId, value }',
    })
  }

  // Fetch all attributes to validate values
  const attributeIds = (body.attributes as AttributeInput[]).map((a) => a.attributeId)
  const attributes = await prisma.attribute.findMany({
    where: { id: { in: attributeIds } },
  })

  const attributeMap = new Map(attributes.map((a) => [a.id, a]))

  // Validate each attribute value
  for (const { attributeId, value } of body.attributes) {
    const attr = attributeMap.get(attributeId)
    if (!attr) {
      throw createError({
        statusCode: 400,
        message: `Attribute ${attributeId} not found`,
      })
    }

    // Required validation
    if (attr.isRequired && (value === null || value === undefined || value === '')) {
      throw createError({
        statusCode: 400,
        message: `Attribute ${attr.name} is required`,
      })
    }

    // Type-specific validation
    if (value !== null && value !== undefined && value !== '') {
      switch (attr.type) {
        case 'NUMBER': {
          if (typeof value !== 'number' || isNaN(value)) {
            throw createError({
              statusCode: 400,
              message: `Attribute ${attr.name} must be a number`,
            })
          }
          const constraints = attr.constraints as { min?: number; max?: number } | null
          if (constraints) {
            if (constraints.min !== undefined && value < constraints.min) {
              throw createError({
                statusCode: 400,
                message: `Attribute ${attr.name} must be at least ${constraints.min}`,
              })
            }
            if (constraints.max !== undefined && value > constraints.max) {
              throw createError({
                statusCode: 400,
                message: `Attribute ${attr.name} must be at most ${constraints.max}`,
              })
            }
          }
          break
        }
        case 'BOOLEAN':
          if (typeof value !== 'boolean') {
            throw createError({
              statusCode: 400,
              message: `Attribute ${attr.name} must be a boolean`,
            })
          }
          break
        case 'SELECT': {
          const options = attr.options as Array<{ label: string; value: string }> | null
          if (options && !options.some((o) => o.value === value)) {
            throw createError({
              statusCode: 400,
              message: `Attribute ${attr.name} value must be one of the valid options`,
            })
          }
          break
        }
        case 'DATE':
          if (typeof value !== 'string' || isNaN(Date.parse(value))) {
            throw createError({
              statusCode: 400,
              message: `Attribute ${attr.name} must be a valid date`,
            })
          }
          break
        case 'TEXT': {
          if (typeof value !== 'string') {
            throw createError({
              statusCode: 400,
              message: `Attribute ${attr.name} must be a string`,
            })
          }
          const constraints = attr.constraints as { minLength?: number; maxLength?: number } | null
          if (constraints) {
            if (constraints.minLength !== undefined && value.length < constraints.minLength) {
              throw createError({
                statusCode: 400,
                message: `Attribute ${attr.name} must be at least ${constraints.minLength} characters`,
              })
            }
            if (constraints.maxLength !== undefined && value.length > constraints.maxLength) {
              throw createError({
                statusCode: 400,
                message: `Attribute ${attr.name} must be at most ${constraints.maxLength} characters`,
              })
            }
          }
          break
        }
      }
    }
  }

  // Perform upserts for all attributes
  await prisma.$transaction(
    (body.attributes as AttributeInput[]).map(({ attributeId, value }) => {
      // Skip null/empty values by deleting any existing value
      if (value === null || value === undefined || value === '') {
        return prisma.productAttribute.deleteMany({
          where: {
            productId,
            attributeId,
          },
        })
      }

      return prisma.productAttribute.upsert({
        where: {
          productId_attributeId: {
            productId,
            attributeId,
          },
        },
        update: {
          value,
        },
        create: {
          productId,
          attributeId,
          value,
        },
      })
    })
  )

  // Fetch updated product with attributes
  const updatedProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      attributes: {
        include: {
          attribute: {
            include: {
              group: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          attribute: {
            sortOrder: 'asc',
          },
        },
      },
    },
  })

  return updatedProduct
})
