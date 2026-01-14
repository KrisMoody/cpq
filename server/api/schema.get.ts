import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async () => {
  const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma')
  const content = await readFile(schemaPath, 'utf-8')

  return content
})
