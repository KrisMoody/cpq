import { usePrisma } from '../../utils/prisma'
import { getPhase } from '../../utils/phase'
import { validateCreateLayoutInput } from '../../utils/quote-layout-validation'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const body = await readBody(event)

  const validation = validateCreateLayoutInput(body)
  if (!validation.valid) {
    throw createError({
      statusCode: 400,
      message: validation.error,
    })
  }

  const { data } = validation

  const layout = await prisma.quoteLayout.create({
    data: {
      name: data.name,
      entityId: data.entityId || 'default',
      description: data.description ?? null,
      isTemplate: data.isTemplate ?? false,
      sections: data.sections as object,
      summaryConfig: data.summaryConfig as object,
      theme: data.theme as object,
      introducedInPhase: phase,
    },
  })

  return layout
})
