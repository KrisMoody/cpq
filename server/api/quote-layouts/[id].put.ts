import { usePrisma } from '../../utils/prisma'
import { validateUpdateLayoutInput } from '../../utils/quote-layout-validation'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Layout ID is required',
    })
  }

  const body = await readBody(event)
  const validation = validateUpdateLayoutInput(body)

  if (!validation.valid) {
    throw createError({
      statusCode: 400,
      message: validation.error,
    })
  }

  const { data } = validation

  // Check if layout exists
  const existing = await prisma.quoteLayout.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Layout not found',
    })
  }

  const updateData: Record<string, unknown> = {}

  if (data.name !== undefined) updateData.name = data.name
  if (data.description !== undefined) updateData.description = data.description
  if (data.isTemplate !== undefined) updateData.isTemplate = data.isTemplate
  if (data.sections !== undefined) updateData.sections = data.sections
  if (data.summaryConfig !== undefined) updateData.summaryConfig = data.summaryConfig
  if (data.theme !== undefined) updateData.theme = data.theme

  const layout = await prisma.quoteLayout.update({
    where: { id },
    data: updateData,
  })

  return layout
})
