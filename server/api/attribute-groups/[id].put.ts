import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Group ID is required',
    })
  }

  const existing = await prisma.attributeGroup.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Attribute group not found',
    })
  }

  const group = await prisma.attributeGroup.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
    },
  })

  return group
})
