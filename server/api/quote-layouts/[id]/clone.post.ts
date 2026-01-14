import { usePrisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Layout ID is required',
    })
  }

  // Get original layout
  const original = await prisma.quoteLayout.findUnique({
    where: { id },
  })

  if (!original) {
    throw createError({
      statusCode: 404,
      message: 'Layout not found',
    })
  }

  // Create cloned layout
  const clonedLayout = await prisma.quoteLayout.create({
    data: {
      name: body?.name || `${original.name} (Copy)`,
      entityId: body?.entityId || original.entityId,
      description: original.description,
      isTemplate: false, // Clones are not templates by default
      sections: original.sections as object,
      summaryConfig: original.summaryConfig as object,
      theme: original.theme as object,
    },
  })

  return clonedLayout
})
