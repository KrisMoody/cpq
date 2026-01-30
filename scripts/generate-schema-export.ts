import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma')
const outputPath = join(process.cwd(), 'server', 'utils', 'prismaSchema.ts')

const schemaContent = readFileSync(schemaPath, 'utf-8')

const output = `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// Generated from prisma/schema.prisma by scripts/generate-schema-export.ts
// Run: npm run generate:schema-export

export const prismaSchemaContent = ${JSON.stringify(schemaContent)}
`

writeFileSync(outputPath, output)
console.log('Generated server/utils/prismaSchema.ts')
