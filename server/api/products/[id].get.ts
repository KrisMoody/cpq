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

  // Get optional priceBookId from query params
  const query = getQuery(event)
  const priceBookId = query.priceBookId as string | undefined

  // For bundle products, fetch the option product details with pricing
  if (product.type === 'BUNDLE' && product.features.length > 0) {
    const optionProductIds = product.features
      .flatMap((f) => f.options)
      .map((o) => o.optionProductId)

    // Build price book filter - use specific price book if provided, otherwise default
    const priceBookFilter = priceBookId
      ? { priceBookId }
      : { priceBook: { isDefault: true } }

    const optionProducts = await prisma.product.findMany({
      where: { id: { in: optionProductIds } },
      select: {
        id: true,
        name: true,
        description: true,
        sku: true,
        isActive: true,
        priceBookEntries: {
          where: priceBookFilter,
          select: {
            listPrice: true,
          },
        },
      },
    })

    // For products without pricing in the requested price book, get all their price books
    const productsWithoutPricing = optionProducts.filter((p) => p.priceBookEntries.length === 0)
    const availablePriceBooks = new Map<string, Array<{ id: string; name: string }>>()

    if (productsWithoutPricing.length > 0) {
      const allEntries = await prisma.priceBookEntry.findMany({
        where: {
          productId: { in: productsWithoutPricing.map((p) => p.id) },
        },
        select: {
          productId: true,
          priceBook: {
            select: { id: true, name: true },
          },
        },
      })

      // Group by product ID
      for (const entry of allEntries) {
        const existing = availablePriceBooks.get(entry.productId) || []
        existing.push({ id: entry.priceBook.id, name: entry.priceBook.name })
        availablePriceBooks.set(entry.productId, existing)
      }
    }

    // Create a map with hasPrice, isActive, and listPrice fields for the configurator
    const optionProductMap = new Map(
      optionProducts.map((p) => {
        const priceEntry = p.priceBookEntries[0]
        const hasPrice = !!priceEntry
        return [
          p.id,
          {
            id: p.id,
            name: p.name,
            description: p.description,
            sku: p.sku,
            isActive: p.isActive,
            hasPrice,
            listPrice: priceEntry?.listPrice ?? null,
            priceBookEntries: p.priceBookEntries,
            // Include available price books for products without pricing
            availableInPriceBooks: !hasPrice ? (availablePriceBooks.get(p.id) || []) : undefined,
          },
        ]
      })
    )

    // Enrich options with product details including hasPrice
    const enrichedProduct = {
      ...product,
      features: product.features.map((feature) => ({
        ...feature,
        options: feature.options.map((option) => ({
          ...option,
          product: optionProductMap.get(option.optionProductId) ?? null,
        })),
      })),
    }

    return enrichedProduct
  }

  return product
})
