// Course content loaded via Nitro storage (server assets)
// Files are in server/assets/course/ which is automatically bundled by Nitro

export async function getCourseContent(moduleId: string): Promise<string | null> {
  // Uses default server/assets directory (automatically bundled by Nitro)
  const storage = useStorage('assets:server')
  const content = await storage.getItem<string>(`course/${moduleId}.md`)
  return content
}

export const ALLOWED_MODULES = [
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
