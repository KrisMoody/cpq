import { usePrisma } from '../../utils/prisma'
import type { AttributeType } from '../../../app/generated/prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Attribute ID is required',
    })
  }

  const existing = await prisma.attribute.findUnique({
    where: { id },
    include: {
      _count: {
        select: { productAttributes: true },
      },
    },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Attribute not found',
    })
  }

  // Prevent type change if values exist
  if (body.type && body.type !== existing.type && existing._count.productAttributes > 0) {
    throw createError({
      statusCode: 400,
      message: 'Cannot change attribute type when values exist',
    })
  }

  // Validate type if provided
  if (body.type) {
    const validTypes: AttributeType[] = ['TEXT', 'NUMBER', 'BOOLEAN', 'SELECT', 'DATE']
    if (!validTypes.includes(body.type)) {
      throw createError({
        statusCode: 400,
        message: `Invalid attribute type. Must be one of: ${validTypes.join(', ')}`,
      })
    }
  }

  // Validate options for SELECT type
  const newType = body.type || existing.type
  if (newType === 'SELECT' && body.options !== undefined) {
    if (!Array.isArray(body.options) || body.options.length === 0) {
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

  // Check for duplicate code if code is being changed
  if (body.code && body.code.trim() !== existing.code) {
    const duplicate = await prisma.attribute.findUnique({
      where: { code: body.code.trim() },
    })
    if (duplicate) {
      throw createError({
        statusCode: 400,
        message: 'An attribute with this code already exists',
      })
    }
  }

  const attribute = await prisma.attribute.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.code !== undefined && { code: body.code.trim() }),
      ...(body.type !== undefined && { type: body.type as AttributeType }),
      ...(body.groupId !== undefined && { groupId: body.groupId || null }),
      ...(body.options !== undefined && { options: body.options }),
      ...(body.constraints !== undefined && { constraints: body.constraints }),
      ...(body.isRequired !== undefined && { isRequired: body.isRequired }),
      ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
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
