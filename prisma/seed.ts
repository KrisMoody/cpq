import {
  PrismaClient,
  ProductType,
  QuoteStatus,
  RuleType,
  RuleTrigger,
  DiscountType,
  DiscountScope,
  TierType,
  AttributeType,
  ContractStatus,
  BillingFrequency,
} from '../app/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Use DIRECT_DATABASE_URL for seeding (non-pooled connection)
const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_DATABASE_URL environment variable is not set.')
}
console.log('  Connecting to:', connectionString.substring(0, 60) + '...')

// Create pg pool for seeding (works better in Node.js)
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data (order matters due to foreign keys)
  await prisma.appliedDiscount.deleteMany()
  await prisma.discountTier.deleteMany()
  await prisma.discount.deleteMany()
  await prisma.rule.deleteMany()
  await prisma.quoteLineItem.deleteMany()
  await prisma.quote.deleteMany()
  await prisma.contractPriceEntry.deleteMany()
  await prisma.contract.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.priceTier.deleteMany()
  await prisma.priceBookEntry.deleteMany()
  await prisma.priceBook.deleteMany()
  await prisma.productCategory.deleteMany()
  await prisma.productAttribute.deleteMany()
  await prisma.categoryAttribute.deleteMany()
  await prisma.productOption.deleteMany()
  await prisma.productFeature.deleteMany()
  await prisma.product.deleteMany()
  await prisma.taxRate.deleteMany()
  await prisma.category.deleteMany()
  await prisma.attribute.deleteMany()
  await prisma.attributeGroup.deleteMany()
  await prisma.unitOfMeasure.deleteMany()
  await prisma.exchangeRate.deleteMany()
  await prisma.currency.deleteMany()

  console.log('  ✓ Cleaned existing data')

  // ============================================================================
  // Currencies
  // ============================================================================

  const usd = await prisma.currency.create({
    data: {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      isBase: true,
      isActive: true,
    },
  })

  const eur = await prisma.currency.create({
    data: {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      isBase: false,
      isActive: true,
    },
  })

  const gbp = await prisma.currency.create({
    data: {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      isBase: false,
      isActive: true,
    },
  })

  const cad = await prisma.currency.create({
    data: {
      code: 'CAD',
      name: 'Canadian Dollar',
      symbol: 'CA$',
      isBase: false,
      isActive: true,
    },
  })

  const aud = await prisma.currency.create({
    data: {
      code: 'AUD',
      name: 'Australian Dollar',
      symbol: 'A$',
      isBase: false,
      isActive: true,
    },
  })

  console.log('  ✓ Created currencies')

  // ============================================================================
  // Exchange Rates (rates to base currency - USD)
  // ============================================================================

  // EUR: 1 EUR = 1.08 USD
  await prisma.exchangeRate.create({
    data: {
      currencyId: eur.id,
      rate: 1.08,
      effectiveDate: new Date(),
    },
  })

  // GBP: 1 GBP = 1.27 USD
  await prisma.exchangeRate.create({
    data: {
      currencyId: gbp.id,
      rate: 1.27,
      effectiveDate: new Date(),
    },
  })

  // CAD: 1 CAD = 0.74 USD
  await prisma.exchangeRate.create({
    data: {
      currencyId: cad.id,
      rate: 0.74,
      effectiveDate: new Date(),
    },
  })

  // AUD: 1 AUD = 0.65 USD
  await prisma.exchangeRate.create({
    data: {
      currencyId: aud.id,
      rate: 0.65,
      effectiveDate: new Date(),
    },
  })

  console.log('  ✓ Created exchange rates')

  // ============================================================================
  // Units of Measure
  // ============================================================================

  const unitEach = await prisma.unitOfMeasure.create({
    data: {
      name: 'Each',
      abbreviation: 'ea',
    },
  })

  const unitHour = await prisma.unitOfMeasure.create({
    data: {
      name: 'Hour',
      abbreviation: 'hr',
    },
  })

  const unitDay = await prisma.unitOfMeasure.create({
    data: {
      name: 'Day',
      abbreviation: 'day',
      baseUnitId: unitHour.id,
      conversionFactor: 8, // 1 day = 8 hours
    },
  })

  const unitMonth = await prisma.unitOfMeasure.create({
    data: {
      name: 'Month',
      abbreviation: 'mo',
    },
  })

  const unitYear = await prisma.unitOfMeasure.create({
    data: {
      name: 'Year',
      abbreviation: 'yr',
      baseUnitId: unitMonth.id,
      conversionFactor: 12, // 1 year = 12 months
    },
  })

  const _unitLicense = await prisma.unitOfMeasure.create({
    data: {
      name: 'License',
      abbreviation: 'lic',
    },
  })

  const unitSeat = await prisma.unitOfMeasure.create({
    data: {
      name: 'Seat',
      abbreviation: 'seat',
    },
  })

  const _unitBox = await prisma.unitOfMeasure.create({
    data: {
      name: 'Box',
      abbreviation: 'box',
      baseUnitId: unitEach.id,
      conversionFactor: 12, // 1 box = 12 each
    },
  })

  const _unitUnit = await prisma.unitOfMeasure.create({
    data: {
      name: 'Unit',
      abbreviation: 'unit',
    },
  })

  console.log('  ✓ Created units of measure')

  // ============================================================================
  // Categories
  // ============================================================================

  const hardwareCategory = await prisma.category.create({
    data: {
      name: 'Hardware',
      description: 'Computer hardware components',
      sortOrder: 0,
    },
  })

  const processorsCategory = await prisma.category.create({
    data: {
      name: 'Processors',
      description: 'CPU and processing units',
      parentId: hardwareCategory.id,
      sortOrder: 0,
    },
  })

  const memoryCategory = await prisma.category.create({
    data: {
      name: 'Memory',
      description: 'RAM and memory modules',
      parentId: hardwareCategory.id,
      sortOrder: 1,
    },
  })

  const storageCategory = await prisma.category.create({
    data: {
      name: 'Storage',
      description: 'SSDs, HDDs, and storage devices',
      parentId: hardwareCategory.id,
      sortOrder: 2,
    },
  })

  const accessoriesCategory = await prisma.category.create({
    data: {
      name: 'Accessories',
      description: 'Peripherals and accessories',
      sortOrder: 1,
    },
  })

  const bundlesCategory = await prisma.category.create({
    data: {
      name: 'Bundles',
      description: 'Pre-configured product bundles',
      sortOrder: 2,
    },
  })

  console.log('  ✓ Created categories')

  // ============================================================================
  // Tax Rates
  // ============================================================================

  // US Federal (no federal sales tax, but example structure)
  // US State taxes
  await prisma.taxRate.create({
    data: {
      name: 'California State Tax',
      rate: 0.0725, // 7.25%
      country: 'USA',
      state: 'CA',
      isActive: true,
    },
  })

  await prisma.taxRate.create({
    data: {
      name: 'Washington State Tax',
      rate: 0.065, // 6.5%
      country: 'USA',
      state: 'WA',
      isActive: true,
    },
  })

  await prisma.taxRate.create({
    data: {
      name: 'Texas State Tax',
      rate: 0.0625, // 6.25%
      country: 'USA',
      state: 'TX',
      isActive: true,
    },
  })

  // EU VAT rates
  await prisma.taxRate.create({
    data: {
      name: 'UK VAT',
      rate: 0.20, // 20%
      country: 'UK',
      state: null,
      isActive: true,
    },
  })

  await prisma.taxRate.create({
    data: {
      name: 'Germany VAT',
      rate: 0.19, // 19%
      country: 'Germany',
      state: null,
      isActive: true,
    },
  })

  await prisma.taxRate.create({
    data: {
      name: 'France VAT',
      rate: 0.20, // 20%
      country: 'France',
      state: null,
      isActive: true,
    },
  })

  console.log('  ✓ Created sample tax rates')

  // ============================================================================
  // Product Attributes
  // ============================================================================

  // Create attribute groups
  const physicalGroup = await prisma.attributeGroup.create({
    data: {
      name: 'Physical',
      sortOrder: 0,
    },
  })

  const technicalGroup = await prisma.attributeGroup.create({
    data: {
      name: 'Technical',
      sortOrder: 1,
    },
  })

  const warrantyGroup = await prisma.attributeGroup.create({
    data: {
      name: 'Warranty',
      sortOrder: 2,
    },
  })

  console.log('  ✓ Created attribute groups')

  // Create attributes
  const colorAttr = await prisma.attribute.create({
    data: {
      name: 'Color',
      code: 'color',
      type: AttributeType.SELECT,
      groupId: physicalGroup.id,
      options: [
        { label: 'Black', value: 'black' },
        { label: 'Silver', value: 'silver' },
        { label: 'Space Gray', value: 'space_gray' },
        { label: 'White', value: 'white' },
      ],
      isRequired: false,
      sortOrder: 0,
    },
  })

  const weightAttr = await prisma.attribute.create({
    data: {
      name: 'Weight (kg)',
      code: 'weight_kg',
      type: AttributeType.NUMBER,
      groupId: physicalGroup.id,
      constraints: { min: 0, max: 100 },
      isRequired: false,
      sortOrder: 1,
    },
  })

  const coresAttr = await prisma.attribute.create({
    data: {
      name: 'CPU Cores',
      code: 'cpu_cores',
      type: AttributeType.NUMBER,
      groupId: technicalGroup.id,
      constraints: { min: 1, max: 128 },
      isRequired: false,
      sortOrder: 0,
    },
  })

  const threadsAttr = await prisma.attribute.create({
    data: {
      name: 'CPU Threads',
      code: 'cpu_threads',
      type: AttributeType.NUMBER,
      groupId: technicalGroup.id,
      constraints: { min: 1, max: 256 },
      isRequired: false,
      sortOrder: 1,
    },
  })

  const capacityAttr = await prisma.attribute.create({
    data: {
      name: 'Capacity',
      code: 'capacity',
      type: AttributeType.TEXT,
      groupId: technicalGroup.id,
      constraints: { maxLength: 50 },
      isRequired: false,
      sortOrder: 2,
    },
  })

  const warrantyMonthsAttr = await prisma.attribute.create({
    data: {
      name: 'Warranty (months)',
      code: 'warranty_months',
      type: AttributeType.NUMBER,
      groupId: warrantyGroup.id,
      constraints: { min: 0, max: 120 },
      isRequired: false,
      sortOrder: 0,
    },
  })

  const extendedWarrantyAttr = await prisma.attribute.create({
    data: {
      name: 'Extended Warranty Available',
      code: 'extended_warranty',
      type: AttributeType.BOOLEAN,
      groupId: warrantyGroup.id,
      isRequired: false,
      sortOrder: 1,
    },
  })

  console.log('  ✓ Created attributes')

  // ============================================================================
  // Standalone Products (Components for bundles)
  // ============================================================================

  // Processors
  const i5 = await prisma.product.create({
    data: {
      name: 'Intel Core i5-13600K',
      description: '14 cores, 20 threads, up to 5.1 GHz',
      sku: 'CPU-I5-13600K',
      type: ProductType.STANDALONE,
      unitOfMeasureId: unitEach.id,
    },
  })

  const i7 = await prisma.product.create({
    data: {
      name: 'Intel Core i7-13700K',
      description: '16 cores, 24 threads, up to 5.4 GHz',
      sku: 'CPU-I7-13700K',
      type: ProductType.STANDALONE,
      unitOfMeasureId: unitEach.id,
    },
  })

  const i9 = await prisma.product.create({
    data: {
      name: 'Intel Core i9-13900K',
      description: '24 cores, 32 threads, up to 5.8 GHz',
      sku: 'CPU-I9-13900K',
      type: ProductType.STANDALONE,
      unitOfMeasureId: unitEach.id,
    },
  })

  // Memory
  const ram16 = await prisma.product.create({
    data: {
      name: 'DDR5 16GB RAM',
      description: '16GB DDR5-5600 Memory',
      sku: 'RAM-16GB-DDR5',
      type: ProductType.STANDALONE,
    },
  })

  const ram32 = await prisma.product.create({
    data: {
      name: 'DDR5 32GB RAM',
      description: '32GB DDR5-5600 Memory',
      sku: 'RAM-32GB-DDR5',
      type: ProductType.STANDALONE,
    },
  })

  const ram64 = await prisma.product.create({
    data: {
      name: 'DDR5 64GB RAM',
      description: '64GB DDR5-5600 Memory',
      sku: 'RAM-64GB-DDR5',
      type: ProductType.STANDALONE,
    },
  })

  // Storage
  const ssd512 = await prisma.product.create({
    data: {
      name: '512GB NVMe SSD',
      description: '512GB PCIe 4.0 NVMe SSD',
      sku: 'SSD-512GB-NVME',
      type: ProductType.STANDALONE,
    },
  })

  const ssd1tb = await prisma.product.create({
    data: {
      name: '1TB NVMe SSD',
      description: '1TB PCIe 4.0 NVMe SSD',
      sku: 'SSD-1TB-NVME',
      type: ProductType.STANDALONE,
    },
  })

  const ssd2tb = await prisma.product.create({
    data: {
      name: '2TB NVMe SSD',
      description: '2TB PCIe 4.0 NVMe SSD',
      sku: 'SSD-2TB-NVME',
      type: ProductType.STANDALONE,
    },
  })

  // Accessories
  const usbHub = await prisma.product.create({
    data: {
      name: 'USB-C Hub 7-in-1',
      description: 'USB-C Hub with HDMI, USB-A, SD Card',
      sku: 'ACC-USBHUB-7IN1',
      type: ProductType.STANDALONE,
    },
  })

  const laptopStand = await prisma.product.create({
    data: {
      name: 'Aluminum Laptop Stand',
      description: 'Ergonomic aluminum laptop stand',
      sku: 'ACC-STAND-ALU',
      type: ProductType.STANDALONE,
    },
  })

  const monitor27 = await prisma.product.create({
    data: {
      name: '27" 4K Monitor',
      description: '27" 4K IPS Monitor, 60Hz',
      sku: 'MON-27-4K',
      type: ProductType.STANDALONE,
    },
  })

  console.log('  ✓ Created standalone products')

  // ============================================================================
  // Subscription Products (Software & Services)
  // ============================================================================

  const softwareLicenseBasic = await prisma.product.create({
    data: {
      name: 'DevTools Pro - Basic',
      description: 'Basic developer tools license - includes IDE and basic integrations',
      sku: 'SW-DEVTOOLS-BASIC',
      type: ProductType.STANDALONE,
      billingFrequency: BillingFrequency.MONTHLY,
      defaultTermMonths: 12,
      unitOfMeasureId: unitSeat.id,
    },
  })

  const softwareLicensePro = await prisma.product.create({
    data: {
      name: 'DevTools Pro - Professional',
      description: 'Professional developer tools license - includes advanced debugging and CI/CD integrations',
      sku: 'SW-DEVTOOLS-PRO',
      type: ProductType.STANDALONE,
      billingFrequency: BillingFrequency.MONTHLY,
      defaultTermMonths: 12,
      unitOfMeasureId: unitSeat.id,
    },
  })

  const softwareLicenseEnterprise = await prisma.product.create({
    data: {
      name: 'DevTools Pro - Enterprise',
      description: 'Enterprise developer tools license - includes SSO, audit logs, and premium support',
      sku: 'SW-DEVTOOLS-ENT',
      type: ProductType.STANDALONE,
      billingFrequency: BillingFrequency.ANNUAL,
      defaultTermMonths: 36,
      unitOfMeasureId: unitSeat.id,
    },
  })

  const cloudHostingBasic = await prisma.product.create({
    data: {
      name: 'Cloud Hosting - Starter',
      description: '2 vCPU, 4GB RAM, 50GB SSD cloud server',
      sku: 'CLOUD-STARTER',
      type: ProductType.STANDALONE,
      billingFrequency: BillingFrequency.MONTHLY,
      defaultTermMonths: 12,
      unitOfMeasureId: unitMonth.id,
    },
  })

  const cloudHostingPro = await prisma.product.create({
    data: {
      name: 'Cloud Hosting - Professional',
      description: '4 vCPU, 16GB RAM, 200GB SSD cloud server with auto-scaling',
      sku: 'CLOUD-PRO',
      type: ProductType.STANDALONE,
      billingFrequency: BillingFrequency.MONTHLY,
      defaultTermMonths: 12,
      unitOfMeasureId: unitMonth.id,
    },
  })

  const supportBasic = await prisma.product.create({
    data: {
      name: 'Support Plan - Standard',
      description: 'Email support with 48-hour response time, business hours only',
      sku: 'SUPPORT-STD',
      type: ProductType.STANDALONE,
      billingFrequency: BillingFrequency.ANNUAL,
      defaultTermMonths: 12,
      unitOfMeasureId: unitYear.id,
    },
  })

  const supportPremium = await prisma.product.create({
    data: {
      name: 'Support Plan - Premium',
      description: '24/7 phone and email support with 4-hour response time, dedicated account manager',
      sku: 'SUPPORT-PREM',
      type: ProductType.STANDALONE,
      billingFrequency: BillingFrequency.ANNUAL,
      defaultTermMonths: 12,
      unitOfMeasureId: unitYear.id,
    },
  })

  const implementationService = await prisma.product.create({
    data: {
      name: 'Implementation Services',
      description: 'Professional implementation and onboarding services',
      sku: 'SVC-IMPL',
      type: ProductType.STANDALONE,
      billingFrequency: BillingFrequency.ONE_TIME,
      unitOfMeasureId: unitHour.id,
    },
  })

  const trainingPackage = await prisma.product.create({
    data: {
      name: 'Training Package',
      description: 'Comprehensive training package for development teams',
      sku: 'SVC-TRAINING',
      type: ProductType.STANDALONE,
      billingFrequency: BillingFrequency.ONE_TIME,
      unitOfMeasureId: unitDay.id,
    },
  })

  console.log('  ✓ Created subscription products')

  // ============================================================================
  // Assign Products to Categories
  // ============================================================================

  // Processors
  await prisma.productCategory.createMany({
    data: [
      { productId: i5.id, categoryId: processorsCategory.id },
      { productId: i7.id, categoryId: processorsCategory.id },
      { productId: i9.id, categoryId: processorsCategory.id },
    ],
  })

  // Memory
  await prisma.productCategory.createMany({
    data: [
      { productId: ram16.id, categoryId: memoryCategory.id },
      { productId: ram32.id, categoryId: memoryCategory.id },
      { productId: ram64.id, categoryId: memoryCategory.id },
    ],
  })

  // Storage
  await prisma.productCategory.createMany({
    data: [
      { productId: ssd512.id, categoryId: storageCategory.id },
      { productId: ssd1tb.id, categoryId: storageCategory.id },
      { productId: ssd2tb.id, categoryId: storageCategory.id },
    ],
  })

  // Accessories
  await prisma.productCategory.createMany({
    data: [
      { productId: usbHub.id, categoryId: accessoriesCategory.id },
      { productId: laptopStand.id, categoryId: accessoriesCategory.id },
      { productId: monitor27.id, categoryId: accessoriesCategory.id },
    ],
  })

  console.log('  ✓ Assigned products to categories')

  // ============================================================================
  // Product Attributes Assignment
  // ============================================================================

  // Processor attributes
  await prisma.productAttribute.createMany({
    data: [
      // i5
      { productId: i5.id, attributeId: coresAttr.id, value: 14 },
      { productId: i5.id, attributeId: threadsAttr.id, value: 20 },
      { productId: i5.id, attributeId: warrantyMonthsAttr.id, value: 36 },
      { productId: i5.id, attributeId: extendedWarrantyAttr.id, value: true },
      // i7
      { productId: i7.id, attributeId: coresAttr.id, value: 16 },
      { productId: i7.id, attributeId: threadsAttr.id, value: 24 },
      { productId: i7.id, attributeId: warrantyMonthsAttr.id, value: 36 },
      { productId: i7.id, attributeId: extendedWarrantyAttr.id, value: true },
      // i9
      { productId: i9.id, attributeId: coresAttr.id, value: 24 },
      { productId: i9.id, attributeId: threadsAttr.id, value: 32 },
      { productId: i9.id, attributeId: warrantyMonthsAttr.id, value: 36 },
      { productId: i9.id, attributeId: extendedWarrantyAttr.id, value: true },
    ],
  })

  // RAM attributes
  await prisma.productAttribute.createMany({
    data: [
      { productId: ram16.id, attributeId: capacityAttr.id, value: '16GB DDR5-5600' },
      { productId: ram16.id, attributeId: warrantyMonthsAttr.id, value: 24 },
      { productId: ram32.id, attributeId: capacityAttr.id, value: '32GB DDR5-5600' },
      { productId: ram32.id, attributeId: warrantyMonthsAttr.id, value: 24 },
      { productId: ram64.id, attributeId: capacityAttr.id, value: '64GB DDR5-5600' },
      { productId: ram64.id, attributeId: warrantyMonthsAttr.id, value: 24 },
    ],
  })

  // Storage attributes
  await prisma.productAttribute.createMany({
    data: [
      { productId: ssd512.id, attributeId: capacityAttr.id, value: '512GB' },
      { productId: ssd512.id, attributeId: warrantyMonthsAttr.id, value: 60 },
      { productId: ssd1tb.id, attributeId: capacityAttr.id, value: '1TB' },
      { productId: ssd1tb.id, attributeId: warrantyMonthsAttr.id, value: 60 },
      { productId: ssd2tb.id, attributeId: capacityAttr.id, value: '2TB' },
      { productId: ssd2tb.id, attributeId: warrantyMonthsAttr.id, value: 60 },
    ],
  })

  // Accessories attributes
  await prisma.productAttribute.createMany({
    data: [
      { productId: usbHub.id, attributeId: colorAttr.id, value: 'space_gray' },
      { productId: usbHub.id, attributeId: weightAttr.id, value: 0.15 },
      { productId: usbHub.id, attributeId: warrantyMonthsAttr.id, value: 12 },
      { productId: laptopStand.id, attributeId: colorAttr.id, value: 'silver' },
      { productId: laptopStand.id, attributeId: weightAttr.id, value: 0.8 },
      { productId: laptopStand.id, attributeId: warrantyMonthsAttr.id, value: 24 },
      { productId: monitor27.id, attributeId: colorAttr.id, value: 'black' },
      { productId: monitor27.id, attributeId: weightAttr.id, value: 5.2 },
      { productId: monitor27.id, attributeId: warrantyMonthsAttr.id, value: 36 },
      { productId: monitor27.id, attributeId: extendedWarrantyAttr.id, value: true },
    ],
  })

  console.log('  ✓ Assigned attributes to products')

  // ============================================================================
  // Bundle Product: Developer Laptop
  // ============================================================================

  const developerLaptop = await prisma.product.create({
    data: {
      name: 'Developer Laptop Pro',
      description: 'High-performance laptop configured for software development',
      sku: 'LAPTOP-DEV-PRO',
      type: ProductType.BUNDLE,
      features: {
        create: [
          {
            name: 'Processor',
            minOptions: 1,
            maxOptions: 1,
            sortOrder: 0,
            options: {
              create: [
                { optionProductId: i5.id, isDefault: true, sortOrder: 0 },
                { optionProductId: i7.id, sortOrder: 1 },
                { optionProductId: i9.id, sortOrder: 2 },
              ],
            },
          },
          {
            name: 'Memory',
            minOptions: 1,
            maxOptions: 1,
            sortOrder: 1,
            options: {
              create: [
                { optionProductId: ram16.id, isDefault: true, sortOrder: 0 },
                { optionProductId: ram32.id, sortOrder: 1 },
                { optionProductId: ram64.id, sortOrder: 2 },
              ],
            },
          },
          {
            name: 'Storage',
            minOptions: 1,
            maxOptions: 2,
            sortOrder: 2,
            options: {
              create: [
                { optionProductId: ssd512.id, isDefault: true, sortOrder: 0 },
                { optionProductId: ssd1tb.id, sortOrder: 1 },
                { optionProductId: ssd2tb.id, sortOrder: 2 },
              ],
            },
          },
          {
            name: 'Accessories',
            minOptions: 0,
            maxOptions: 3,
            sortOrder: 3,
            options: {
              create: [
                { optionProductId: usbHub.id, sortOrder: 0 },
                { optionProductId: laptopStand.id, sortOrder: 1 },
                { optionProductId: monitor27.id, sortOrder: 2 },
              ],
            },
          },
        ],
      },
    },
  })

  console.log('  ✓ Created Developer Laptop bundle')

  // Add bundle to Bundles category
  await prisma.productCategory.create({
    data: {
      productId: developerLaptop.id,
      categoryId: bundlesCategory.id,
    },
  })

  // ============================================================================
  // Price Book
  // ============================================================================

  const standardPriceBook = await prisma.priceBook.create({
    data: {
      name: 'Standard Price Book',
      currencyId: usd.id,
      isDefault: true,
      isActive: true,
      entries: {
        create: [
          // Bundle base price
          { productId: developerLaptop.id, listPrice: 999.00, cost: 750.00 },
          // Processors
          { productId: i5.id, listPrice: 0.00, cost: 0.00 },       // Included in base
          { productId: i7.id, listPrice: 200.00, cost: 150.00 },
          { productId: i9.id, listPrice: 500.00, cost: 380.00 },
          // Memory
          { productId: ram16.id, listPrice: 0.00, cost: 0.00 },    // Included in base
          { productId: ram32.id, listPrice: 150.00, cost: 100.00 },
          { productId: ram64.id, listPrice: 400.00, cost: 280.00 },
          // Storage
          { productId: ssd512.id, listPrice: 0.00, cost: 0.00 },   // Included in base
          { productId: ssd1tb.id, listPrice: 100.00, cost: 70.00 },
          { productId: ssd2tb.id, listPrice: 250.00, cost: 180.00 },
          // Accessories
          { productId: usbHub.id, listPrice: 49.00, cost: 25.00 },
          { productId: laptopStand.id, listPrice: 79.00, cost: 40.00 },
          { productId: monitor27.id, listPrice: 299.00, cost: 200.00 },
          // Subscription Products - Software Licenses (per seat/month)
          { productId: softwareLicenseBasic.id, listPrice: 29.00, cost: 5.00 },
          { productId: softwareLicensePro.id, listPrice: 79.00, cost: 12.00 },
          { productId: softwareLicenseEnterprise.id, listPrice: 1499.00, cost: 200.00 }, // Annual price
          // Cloud Hosting (per month)
          { productId: cloudHostingBasic.id, listPrice: 49.00, cost: 20.00 },
          { productId: cloudHostingPro.id, listPrice: 199.00, cost: 80.00 },
          // Support Plans (annual)
          { productId: supportBasic.id, listPrice: 999.00, cost: 200.00 },
          { productId: supportPremium.id, listPrice: 4999.00, cost: 1000.00 },
          // One-time Services
          { productId: implementationService.id, listPrice: 250.00, cost: 150.00 },
          { productId: trainingPackage.id, listPrice: 2000.00, cost: 800.00 },
        ],
      },
    },
  })

  console.log('  ✓ Created price book with entries')

  // ============================================================================
  // Enterprise Price Book (for enterprise customers)
  // ============================================================================

  const enterprisePriceBook = await prisma.priceBook.create({
    data: {
      name: 'Enterprise Price Book',
      currencyId: usd.id,
      isDefault: false,
      isActive: true,
      entries: {
        create: [
          // Bundle base price (10% enterprise discount)
          { productId: developerLaptop.id, listPrice: 899.00, cost: 750.00 },
          // Processors
          { productId: i5.id, listPrice: 0.00, cost: 0.00 },
          { productId: i7.id, listPrice: 180.00, cost: 150.00 },
          { productId: i9.id, listPrice: 450.00, cost: 380.00 },
          // Memory
          { productId: ram16.id, listPrice: 0.00, cost: 0.00 },
          { productId: ram32.id, listPrice: 135.00, cost: 100.00 },
          { productId: ram64.id, listPrice: 360.00, cost: 280.00 },
          // Storage
          { productId: ssd512.id, listPrice: 0.00, cost: 0.00 },
          { productId: ssd1tb.id, listPrice: 90.00, cost: 70.00 },
          { productId: ssd2tb.id, listPrice: 225.00, cost: 180.00 },
          // Accessories
          { productId: usbHub.id, listPrice: 44.00, cost: 25.00 },
          { productId: laptopStand.id, listPrice: 71.00, cost: 40.00 },
          { productId: monitor27.id, listPrice: 269.00, cost: 200.00 },
          // Subscription Products - Software Licenses (enterprise discount)
          { productId: softwareLicenseBasic.id, listPrice: 25.00, cost: 5.00 },
          { productId: softwareLicensePro.id, listPrice: 69.00, cost: 12.00 },
          { productId: softwareLicenseEnterprise.id, listPrice: 1299.00, cost: 200.00 },
          // Cloud Hosting (enterprise discount)
          { productId: cloudHostingBasic.id, listPrice: 44.00, cost: 20.00 },
          { productId: cloudHostingPro.id, listPrice: 179.00, cost: 80.00 },
          // Support Plans (enterprise discount)
          { productId: supportBasic.id, listPrice: 899.00, cost: 200.00 },
          { productId: supportPremium.id, listPrice: 4499.00, cost: 1000.00 },
          // One-time Services (enterprise discount)
          { productId: implementationService.id, listPrice: 225.00, cost: 150.00 },
          { productId: trainingPackage.id, listPrice: 1800.00, cost: 800.00 },
        ],
      },
    },
  })

  console.log('  ✓ Created enterprise price book')

  // ============================================================================
  // Price Tiers (volume pricing)
  // ============================================================================

  // Get the standard price book entry for the laptop bundle
  const laptopEntry = await prisma.priceBookEntry.findUnique({
    where: {
      priceBookId_productId: {
        priceBookId: standardPriceBook.id,
        productId: developerLaptop.id,
      },
    },
  })

  if (laptopEntry) {
    await prisma.priceTier.createMany({
      data: [
        {
          priceBookEntryId: laptopEntry.id,
          minQuantity: 5,
          maxQuantity: 9,
          tierPrice: 949.00,
          tierType: TierType.UNIT_PRICE,
        },
        {
          priceBookEntryId: laptopEntry.id,
          minQuantity: 10,
          maxQuantity: 24,
          tierPrice: 899.00,
          tierType: TierType.UNIT_PRICE,
        },
        {
          priceBookEntryId: laptopEntry.id,
          minQuantity: 25,
          maxQuantity: null,
          tierPrice: 849.00,
          tierType: TierType.UNIT_PRICE,
        },
      ],
    })
    console.log('  ✓ Created price tiers for volume discounts')
  }

  // ============================================================================
  // Customers
  // ============================================================================

  const acmeCorp = await prisma.customer.create({
    data: {
      name: 'Acme Corporation',
      email: 'purchasing@acme.com',
      phone: '+1-555-123-4567',
      company: 'Acme Corporation',
      street: '100 Innovation Way',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'USA',
      priceBookId: standardPriceBook.id,
      isActive: true,
    },
  })

  const techGiant = await prisma.customer.create({
    data: {
      name: 'TechGiant Inc',
      email: 'procurement@techgiant.com',
      phone: '+1-555-987-6543',
      company: 'TechGiant Inc',
      street: '500 Enterprise Blvd',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'USA',
      priceBookId: enterprisePriceBook.id,
      isActive: true,
    },
  })

  const _startupXyz = await prisma.customer.create({
    data: {
      name: 'StartupXYZ',
      email: 'founder@startupxyz.io',
      phone: '+1-555-456-7890',
      company: 'StartupXYZ',
      street: '42 Garage Lane',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'USA',
      priceBookId: standardPriceBook.id,
      isActive: true,
    },
  })

  const globalEnterprises = await prisma.customer.create({
    data: {
      name: 'Global Enterprises Ltd',
      email: 'purchasing@globalent.co.uk',
      phone: '+44-20-7123-4567',
      company: 'Global Enterprises Ltd',
      street: '1 Canary Wharf',
      city: 'London',
      state: null,
      postalCode: 'E14 5AB',
      country: 'UK',
      priceBookId: enterprisePriceBook.id,
      isTaxExempt: true,
      taxExemptReason: 'Registered charity organization',
      taxExemptCertificate: 'UK-CHR-2024-12345',
      taxExemptExpiry: new Date('2025-12-31'),
      isActive: true,
    },
  })

  console.log('  ✓ Created sample customers')

  // ============================================================================
  // Rules
  // ============================================================================

  // Configuration rule: Require i7 or better with 64GB RAM
  await prisma.rule.create({
    data: {
      name: 'High-memory requires better CPU',
      description: 'When 64GB RAM is selected, require at least i7 processor',
      type: RuleType.CONFIGURATION,
      trigger: RuleTrigger.ON_PRODUCT_ADD,
      priority: 10,
      condition: {
        type: 'AND',
        conditions: [
          { field: 'product.sku', operator: 'equals', value: 'RAM-64GB-DDR5' },
        ],
      },
      action: {
        type: 'REQUIRE',
        products: ['CPU-I7-13700K', 'CPU-I9-13900K'],
        message: '64GB RAM requires Intel Core i7 or i9 processor for optimal performance',
      },
      isActive: true,
    },
  })

  // Configuration rule: Auto-add laptop stand with monitor
  await prisma.rule.create({
    data: {
      name: 'Monitor bundle suggestion',
      description: 'Suggest laptop stand when monitor is added',
      type: RuleType.CONFIGURATION,
      trigger: RuleTrigger.ON_PRODUCT_ADD,
      priority: 50,
      condition: {
        type: 'AND',
        conditions: [
          { field: 'product.sku', operator: 'equals', value: 'MON-27-4K' },
        ],
      },
      action: {
        type: 'SUGGEST',
        products: ['ACC-STAND-ALU'],
        message: 'Consider adding a laptop stand for better ergonomics with your monitor',
      },
      isActive: true,
    },
  })

  // Pricing rule: High-value quote approval
  await prisma.rule.create({
    data: {
      name: 'High-value quote approval',
      description: 'Quotes over $10,000 require manager approval',
      type: RuleType.PRICING,
      trigger: RuleTrigger.ON_QUOTE_SAVE,
      priority: 10,
      condition: {
        type: 'AND',
        conditions: [
          { field: 'quote.total', operator: 'greaterThan', value: 10000 },
        ],
      },
      action: {
        type: 'REQUIRE_APPROVAL',
        approverRole: 'manager',
        message: 'Quotes over $10,000 require manager approval',
      },
      isActive: true,
    },
  })

  // Pricing rule: Large discount approval
  await prisma.rule.create({
    data: {
      name: 'Large discount approval',
      description: 'Discounts over 25% require approval',
      type: RuleType.PRICING,
      trigger: RuleTrigger.ON_QUOTE_SAVE,
      priority: 20,
      condition: {
        type: 'OR',
        conditions: [
          { field: 'quote.discountPercent', operator: 'greaterThan', value: 25 },
        ],
      },
      action: {
        type: 'REQUIRE_APPROVAL',
        approverRole: 'sales-director',
        message: 'Discounts exceeding 25% require sales director approval',
      },
      isActive: true,
    },
  })

  // Pricing rule: Bulk order discount eligibility
  await prisma.rule.create({
    data: {
      name: 'Bulk order notification',
      description: 'Notify about bulk discount eligibility for large orders',
      type: RuleType.PRICING,
      trigger: RuleTrigger.ON_QUANTITY_CHANGE,
      priority: 100,
      condition: {
        type: 'AND',
        conditions: [
          { field: 'lineItem.quantity', operator: 'greaterThanOrEqual', value: 5 },
        ],
      },
      action: {
        type: 'NOTIFY',
        message: 'This order qualifies for bulk pricing discounts',
      },
      isActive: true,
    },
  })

  console.log('  ✓ Created sample rules')

  // ============================================================================
  // Discounts
  // ============================================================================

  // Volume discount with tiers
  const _volumeDiscount = await prisma.discount.create({
    data: {
      name: 'Volume Purchase Discount',
      description: 'Tiered discount based on order quantity',
      type: DiscountType.PERCENTAGE,
      value: 0, // Base value, tiers define actual discounts
      scope: DiscountScope.LINE_ITEM,
      minQuantity: 5,
      isActive: true,
      stackable: false,
      priority: 10,
      tiers: {
        create: [
          { tierNumber: 1, minQuantity: 5, maxQuantity: 9, value: 5.00 },
          { tierNumber: 2, minQuantity: 10, maxQuantity: 24, value: 10.00 },
          { tierNumber: 3, minQuantity: 25, maxQuantity: 49, value: 15.00 },
          { tierNumber: 4, minQuantity: 50, maxQuantity: null, value: 20.00 },
        ],
      },
    },
  })

  // New customer welcome discount
  const _welcomeDiscount = await prisma.discount.create({
    data: {
      name: 'New Customer Welcome',
      description: '10% off first order for new customers',
      type: DiscountType.PERCENTAGE,
      value: 10.00,
      scope: DiscountScope.QUOTE,
      isActive: true,
      stackable: true,
      priority: 50,
    },
  })

  // Fixed amount discount
  const _freeShipping = await prisma.discount.create({
    data: {
      name: 'Free Shipping',
      description: '$50 off shipping for orders over $500',
      type: DiscountType.FIXED_AMOUNT,
      value: 50.00,
      scope: DiscountScope.QUOTE,
      minOrderValue: 500.00,
      isActive: true,
      stackable: true,
      priority: 100,
    },
  })

  // Seasonal promotion
  const _seasonalPromo = await prisma.discount.create({
    data: {
      name: 'Q1 Promotion',
      description: '15% off during Q1 2024',
      type: DiscountType.PERCENTAGE,
      value: 15.00,
      scope: DiscountScope.QUOTE,
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-03-31'),
      isActive: true,
      stackable: false,
      priority: 20,
    },
  })

  // Enterprise-only discount
  const _enterpriseDiscount = await prisma.discount.create({
    data: {
      name: 'Enterprise Exclusive',
      description: 'Additional 5% for enterprise customers',
      type: DiscountType.PERCENTAGE,
      value: 5.00,
      scope: DiscountScope.QUOTE,
      minOrderValue: 5000.00,
      isActive: true,
      stackable: true,
      priority: 80,
    },
  })

  console.log('  ✓ Created sample discounts with tiers')

  // ============================================================================
  // Example Quote
  // ============================================================================

  const validTo = new Date()
  validTo.setDate(validTo.getDate() + 30) // Valid for 30 days

  const exampleQuote = await prisma.quote.create({
    data: {
      name: 'Q-2024-001',
      customerId: acmeCorp.id,
      status: QuoteStatus.DRAFT,
      priceBookId: standardPriceBook.id,
      validTo: validTo,
      subtotal: 1448.00,
      discountTotal: 0.00,
      total: 1448.00,
      lineItems: {
        create: [
          // Bundle line item
          {
            productId: developerLaptop.id,
            quantity: 1,
            listPrice: 999.00,
            discount: 0.00,
            netPrice: 999.00,
            sortOrder: 0,
          },
        ],
      },
    },
  })

  // Get the parent line item
  const parentLine = await prisma.quoteLineItem.findFirst({
    where: { quoteId: exampleQuote.id, productId: developerLaptop.id },
  })

  // Add configured options as child line items
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: exampleQuote.id,
        productId: i7.id,
        parentLineId: parentLine!.id,
        quantity: 1,
        listPrice: 200.00,
        discount: 0.00,
        netPrice: 200.00,
        sortOrder: 1,
      },
      {
        quoteId: exampleQuote.id,
        productId: ram32.id,
        parentLineId: parentLine!.id,
        quantity: 1,
        listPrice: 150.00,
        discount: 0.00,
        netPrice: 150.00,
        sortOrder: 2,
      },
      {
        quoteId: exampleQuote.id,
        productId: ssd512.id,
        parentLineId: parentLine!.id,
        quantity: 1,
        listPrice: 0.00,
        discount: 0.00,
        netPrice: 0.00,
        sortOrder: 3,
      },
      {
        quoteId: exampleQuote.id,
        productId: usbHub.id,
        parentLineId: parentLine!.id,
        quantity: 1,
        listPrice: 49.00,
        discount: 0.00,
        netPrice: 49.00,
        sortOrder: 4,
      },
      {
        quoteId: exampleQuote.id,
        productId: laptopStand.id,
        parentLineId: parentLine!.id,
        quantity: 1,
        listPrice: 79.00,
        discount: 0.00,
        netPrice: 79.00,
        sortOrder: 5,
      },
    ],
  })

  // Recalculate quote total
  const lineItems = await prisma.quoteLineItem.findMany({
    where: { quoteId: exampleQuote.id },
  })
  const subtotal = lineItems.reduce((sum, item) => sum + Number(item.netPrice), 0)

  await prisma.quote.update({
    where: { id: exampleQuote.id },
    data: {
      subtotal: subtotal,
      total: subtotal,
    },
  })

  console.log('  ✓ Created example quote with line items')

  // ============================================================================
  // Contracts
  // ============================================================================

  // Active contract for TechGiant with special pricing
  const _techGiantContract = await prisma.contract.create({
    data: {
      name: 'TechGiant 2024 Enterprise Agreement',
      customerId: techGiant.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: ContractStatus.ACTIVE,
      discountPercent: 15, // 15% off all products
      priceEntries: {
        create: [
          // Fixed price for Developer Laptop bundle
          { productId: developerLaptop.id, fixedPrice: 850.00 },
          // Fixed price for i9 processor
          { productId: i9.id, fixedPrice: 400.00 },
        ],
      },
    },
  })

  // Draft contract for Acme Corp (pending approval)
  const _acmeContract = await prisma.contract.create({
    data: {
      name: 'Acme Corp 2024 Agreement',
      customerId: acmeCorp.id,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2025-01-31'),
      status: ContractStatus.DRAFT,
      discountPercent: 10, // 10% off all products
    },
  })

  // Expired contract for Global Enterprises
  const _globalContract = await prisma.contract.create({
    data: {
      name: 'Global Enterprises 2023 Agreement',
      customerId: globalEnterprises.id,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      status: ContractStatus.EXPIRED,
      discountPercent: 12,
      priceEntries: {
        create: [
          { productId: ram64.id, fixedPrice: 350.00 },
          { productId: ssd2tb.id, fixedPrice: 200.00 },
        ],
      },
    },
  })

  console.log('  ✓ Created sample contracts')

  console.log('\n✅ Database seeded successfully!')
  console.log(`   - 5 currencies (USD base, EUR, GBP, CAD, AUD)`)
  console.log(`   - 4 exchange rates`)
  console.log(`   - 9 units of measure (Each, Hour, Day, Month, Year, License, Seat, Box, Unit)`)
  console.log(`   - 6 categories (hierarchical)`)
  console.log(`   - 6 tax rates (3 US states, 3 EU countries)`)
  console.log(`   - 3 attribute groups (Physical, Technical, Warranty)`)
  console.log(`   - 7 attributes (color, weight, cores, threads, capacity, warranty, extended warranty)`)
  console.log(`   - 12 standalone products (hardware)`)
  console.log(`   - 9 subscription products (software licenses, cloud hosting, support plans, services)`)
  console.log(`   - 1 bundle product (Developer Laptop Pro)`)
  console.log(`   - 13 product-category assignments`)
  console.log(`   - 34 product-attribute assignments`)
  console.log(`   - 2 price books (Standard + Enterprise) with entries and USD currency`)
  console.log(`   - 3 price tiers for volume pricing`)
  console.log(`   - 4 customers (1 tax-exempt)`)
  console.log(`   - 5 rules (2 configuration, 3 pricing)`)
  console.log(`   - 5 discounts (including 1 with tiers)`)
  console.log(`   - 1 example quote with 6 line items`)
  console.log(`   - 3 contracts (1 active, 1 draft, 1 expired)`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
