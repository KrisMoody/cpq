import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const body = await readBody(event)

  if (!body.name?.trim()) {
    throw createError({
      statusCode: 400,
      message: 'Group name is required',
    })
  }

  const group = await prisma.attributeGroup.create({
    data: {
      name: body.name.trim(),
      sortOrder: body.sortOrder ?? 0,
    },
  })

  return group
})
