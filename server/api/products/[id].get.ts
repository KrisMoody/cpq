import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required',
    })
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      unitOfMeasure: {
        select: { id: true, name: true, abbreviation: true, conversionFactor: true, baseUnitId: true },
      },
      features: {
        orderBy: { sortOrder: 'asc' },
        include: {
          options: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
      priceBookEntries: {
        include: {
          priceBook: {
            select: {
              id: true,
              name: true,
              isDefault: true,
            },
          },
        },
      },
      categories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
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

  if (!product) {
    throw createError({
      statusCode: 404,
      message: 'Product not found',
    })
  }

  // For bundle products, fetch the option product details
  if (product.type === 'BUNDLE' && product.features.length > 0) {
    const optionProductIds = product.features
      .flatMap((f) => f.options)
      .map((o) => o.optionProductId)

    const optionProducts = await prisma.product.findMany({
      where: { id: { in: optionProductIds } },
      select: {
        id: true,
        name: true,
        description: true,
        sku: true,
        priceBookEntries: {
          where: {
            priceBook: { isDefault: true },
          },
          select: {
            listPrice: true,
          },
        },
      },
    })

    const optionProductMap = new Map(optionProducts.map((p) => [p.id, p]))

    // Enrich options with product details
    const enrichedProduct = {
      ...product,
      features: product.features.map((feature) => ({
        ...feature,
        options: feature.options.map((option) => ({
          ...option,
          product: optionProductMap.get(option.optionProductId),
        })),
      })),
    }

    return enrichedProduct
  }

  return product
})
