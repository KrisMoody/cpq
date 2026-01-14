import { usePrisma } from '../../utils/prisma'
import type { AttributeType } from '../../../app/generated/prisma/client.js'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const body = await readBody(event)

  if (!body.name?.trim()) {
    throw createError({
      statusCode: 400,
      message: 'Attribute name is required',
    })
  }

  if (!body.code?.trim()) {
    throw createError({
      statusCode: 400,
      message: 'Attribute code is required',
    })
  }

  if (!body.type) {
    throw createError({
      statusCode: 400,
      message: 'Attribute type is required',
    })
  }

  // Validate type
  const validTypes: AttributeType[] = ['TEXT', 'NUMBER', 'BOOLEAN', 'SELECT', 'DATE']
  if (!validTypes.includes(body.type)) {
    throw createError({
      statusCode: 400,
      message: `Invalid attribute type. Must be one of: ${validTypes.join(', ')}`,
    })
  }

  // Validate options for SELECT type
  if (body.type === 'SELECT') {
    if (!body.options || !Array.isArray(body.options) || body.options.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'SELECT type attributes require at least one option',
      })
    }
    for (const opt of body.options) {
      if (!opt.label || !opt.value) {
        throw createError({
          statusCode: 400,
          message: 'Each option must have a label and value',
        })
      }
    }
  }

  // Check for duplicate code
  const existing = await prisma.attribute.findUnique({
    where: { code: body.code.trim() },
  })
  if (existing) {
    throw createError({
      statusCode: 400,
      message: 'An attribute with this code already exists',
    })
  }

  const attribute = await prisma.attribute.create({
    data: {
      name: body.name.trim(),
      code: body.code.trim(),
      type: body.type as AttributeType,
      groupId: body.groupId || null,
      options: body.type === 'SELECT' ? body.options : null,
      constraints: body.constraints || null,
      isRequired: body.isRequired ?? false,
      sortOrder: body.sortOrder ?? 0,
    },
    include: {
      group: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  return attribute
})
