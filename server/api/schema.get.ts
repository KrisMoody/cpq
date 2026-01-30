import { prismaSchemaContent } from '../utils/prismaSchema'

export default defineEventHandler(() => {
  return prismaSchemaContent
})
