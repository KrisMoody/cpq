import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const ALLOWED_MODULES = [
  '00-introduction',
  '01-cpq-foundations',
  '02-product-catalog',
  '03-attribute-system',
  '04-price-books',
  '05-customers-contracts',
  '06-quote-building',
  '07-discounts',
  '08-rules-engine',
  '09-tax-management',
  '10-multi-currency',
  '11-guided-selling',
  '12-architecture',
  '13-capstone',
  'appendix-data-models',
  'appendix-glossary',
]

export default defineEventHandler(async (event) => {
  const moduleId = getRouterParam(event, 'module')

  if (!moduleId) {
    throw createError({
      statusCode: 400,
      message: 'Module ID is required',
    })
  }

  // Security: Only allow known module IDs
  if (!ALLOWED_MODULES.includes(moduleId)) {
    throw createError({
      statusCode: 404,
      message: 'Module not found',
    })
  }

  const filename = `${moduleId}.md`
  const coursePath = resolve(process.cwd(), 'docs', 'course', filename)

  try {
    const content = await readFile(coursePath, 'utf-8')
    return {
      id: moduleId,
      filename,
      content,
    }
  }
  catch {
    throw createError({
      statusCode: 404,
      message: 'Module not found',
    })
  }
})
