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
  AffinityType,
  QuestionType,
} from '../app/generated/prisma/client'
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
  await prisma.quoteLayout.deleteMany()
  await prisma.recommendationLog.deleteMany()
  await prisma.questionProductMapping.deleteMany()
  await prisma.question.deleteMany()
  await prisma.questionnaire.deleteMany()
  await prisma.productAffinity.deleteMany()
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

  const startupXyz = await prisma.customer.create({
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

  // Pricing rule: Large discount approval (checks max line-item discount)
  await prisma.rule.create({
    data: {
      name: 'Large discount approval',
      description: 'Line-item discounts over 25% require approval',
      type: RuleType.PRICING,
      trigger: RuleTrigger.ON_QUOTE_SAVE,
      priority: 20,
      condition: {
        field: 'quote.maxLineDiscountPercent',
        operator: '>',
        value: 25,
      },
      action: {
        type: 'REQUIRE_APPROVAL',
        approverRole: 'sales-director',
        message: 'Line-item discounts exceeding 25% require sales director approval',
      },
      isActive: true,
    },
  })

  // Pricing rule: Heavy quote discount approval (checks aggregate discount)
  await prisma.rule.create({
    data: {
      name: 'Heavy quote discount approval',
      description: 'Quotes with total discount over 40% require approval',
      type: RuleType.PRICING,
      trigger: RuleTrigger.ON_QUOTE_SAVE,
      priority: 21,
      condition: {
        field: 'quote.discountPercent',
        operator: '>',
        value: 40,
      },
      action: {
        type: 'REQUIRE_APPROVAL',
        approverRole: 'sales-manager',
        message: 'Quote total discount exceeding 40% requires sales manager approval',
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
  // Historical Quotes for AI Training Data
  // ============================================================================

  // Helper function to create dates in the past
  const daysAgo = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
  }

  const validToOffset = (createdDate: Date, days: number) => {
    const date = new Date(createdDate)
    date.setDate(date.getDate() + days)
    return date
  }

  // --------------------------------------------------------------------------
  // Enterprise Customer Quotes (TechGiant, Global Enterprises)
  // Large deals ($5k+), higher discounts (15-25%)
  // --------------------------------------------------------------------------

  // Quote 1: TechGiant - Enterprise software + implementation + premium support
  // Pattern: Enterprise software requires implementation service
  // Status: ACCEPTED, Large deal ~$87k, 20% discount
  const tgQuote1Created = daysAgo(180)
  const tgQuote1 = await prisma.quote.create({
    data: {
      name: 'Q-2024-TG-001',
      customerId: techGiant.id,
      status: QuoteStatus.ACCEPTED,
      priceBookId: enterprisePriceBook.id,
      validTo: validToOffset(tgQuote1Created, 30),
      createdAt: tgQuote1Created,
      subtotal: 109780.0,
      discountTotal: 21956.0,
      total: 87824.0,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: tgQuote1.id,
        productId: softwareLicenseEnterprise.id,
        quantity: 50,
        listPrice: 1299.0, // Enterprise price book
        discount: 259.8, // 20%
        netPrice: 1039.2,
        sortOrder: 0,
      },
      {
        quoteId: tgQuote1.id,
        productId: implementationService.id,
        quantity: 80, // 80 hours
        listPrice: 225.0, // Enterprise price
        discount: 45.0, // 20%
        netPrice: 180.0,
        sortOrder: 1,
      },
      {
        quoteId: tgQuote1.id,
        productId: supportPremium.id,
        quantity: 1,
        listPrice: 4499.0, // Enterprise price
        discount: 899.8, // 20%
        netPrice: 3599.2,
        sortOrder: 2,
      },
    ],
  })

  // Quote 2: TechGiant - Multiple developer laptops with high-end config
  // Pattern: Large quantity laptop orders with premium specs
  // Status: ACCEPTED, ~$17k, 15% discount
  const tgQuote2Created = daysAgo(150)
  const tgQuote2 = await prisma.quote.create({
    data: {
      name: 'Q-2024-TG-002',
      customerId: techGiant.id,
      status: QuoteStatus.ACCEPTED,
      priceBookId: enterprisePriceBook.id,
      validTo: validToOffset(tgQuote2Created, 30),
      createdAt: tgQuote2Created,
      subtotal: 19790.0,
      discountTotal: 2968.5,
      total: 16821.5,
    },
  })
  const tgQuote2Parent = await prisma.quoteLineItem.create({
    data: {
      quoteId: tgQuote2.id,
      productId: developerLaptop.id,
      quantity: 10,
      listPrice: 899.0, // Enterprise price
      discount: 134.85, // 15%
      netPrice: 764.15,
      sortOrder: 0,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: tgQuote2.id,
        parentLineId: tgQuote2Parent.id,
        productId: i9.id,
        quantity: 10,
        listPrice: 450.0,
        discount: 67.5,
        netPrice: 382.5,
        sortOrder: 1,
      },
      {
        quoteId: tgQuote2.id,
        parentLineId: tgQuote2Parent.id,
        productId: ram64.id,
        quantity: 10,
        listPrice: 360.0,
        discount: 54.0,
        netPrice: 306.0,
        sortOrder: 2,
      },
      {
        quoteId: tgQuote2.id,
        parentLineId: tgQuote2Parent.id,
        productId: ssd2tb.id,
        quantity: 10,
        listPrice: 225.0,
        discount: 33.75,
        netPrice: 191.25,
        sortOrder: 3,
      },
    ],
  })

  // Quote 3: TechGiant - Cloud hosting expansion with support
  // Pattern: Cloud hosting + support plan bundle
  // Status: ACCEPTED, ~$7k, 18% discount
  const tgQuote3Created = daysAgo(120)
  const tgQuote3 = await prisma.quote.create({
    data: {
      name: 'Q-2024-TG-003',
      customerId: techGiant.id,
      status: QuoteStatus.ACCEPTED,
      priceBookId: enterprisePriceBook.id,
      validTo: validToOffset(tgQuote3Created, 30),
      createdAt: tgQuote3Created,
      subtotal: 7047.0,
      discountTotal: 1268.46,
      total: 5778.54,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: tgQuote3.id,
        productId: cloudHostingPro.id,
        quantity: 12, // 12 months
        listPrice: 179.0, // Enterprise price
        discount: 32.22, // 18%
        netPrice: 146.78,
        sortOrder: 0,
      },
      {
        quoteId: tgQuote3.id,
        productId: supportBasic.id,
        quantity: 1,
        listPrice: 899.0,
        discount: 161.82, // 18%
        netPrice: 737.18,
        sortOrder: 1,
      },
    ],
  })

  // Quote 4: TechGiant - Training package deal
  // Pattern: Training + implementation services
  // Status: FINALIZED, ~$11k, 15% discount
  const tgQuote4Created = daysAgo(90)
  const tgQuote4 = await prisma.quote.create({
    data: {
      name: 'Q-2024-TG-004',
      customerId: techGiant.id,
      status: QuoteStatus.FINALIZED,
      priceBookId: enterprisePriceBook.id,
      validTo: validToOffset(tgQuote4Created, 30),
      createdAt: tgQuote4Created,
      subtotal: 13500.0,
      discountTotal: 2025.0,
      total: 11475.0,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: tgQuote4.id,
        productId: trainingPackage.id,
        quantity: 5, // 5 days
        listPrice: 1800.0, // Enterprise price
        discount: 270.0, // 15%
        netPrice: 1530.0,
        sortOrder: 0,
      },
      {
        quoteId: tgQuote4.id,
        productId: implementationService.id,
        quantity: 20, // 20 hours follow-up
        listPrice: 225.0,
        discount: 33.75, // 15%
        netPrice: 191.25,
        sortOrder: 1,
      },
    ],
  })

  // Quote 5: TechGiant - Mixed deal rejected (price too high)
  // Pattern: Large mixed deal without adequate discount
  // Status: REJECTED, ~$58k, only 10% discount - customer wanted 20%+
  const tgQuote5Created = daysAgo(60)
  const tgQuote5 = await prisma.quote.create({
    data: {
      name: 'Q-2024-TG-005',
      customerId: techGiant.id,
      status: QuoteStatus.REJECTED,
      priceBookId: enterprisePriceBook.id,
      validTo: validToOffset(tgQuote5Created, 30),
      createdAt: tgQuote5Created,
      subtotal: 64450.0,
      discountTotal: 6445.0,
      total: 58005.0,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: tgQuote5.id,
        productId: softwareLicenseEnterprise.id,
        quantity: 30,
        listPrice: 1299.0,
        discount: 129.9, // Only 10%
        netPrice: 1169.1,
        sortOrder: 0,
      },
      {
        quoteId: tgQuote5.id,
        productId: supportPremium.id,
        quantity: 2, // 2 years
        listPrice: 4499.0,
        discount: 449.9, // Only 10%
        netPrice: 4049.1,
        sortOrder: 1,
      },
      {
        quoteId: tgQuote5.id,
        productId: cloudHostingPro.id,
        quantity: 24, // 2 years
        listPrice: 179.0,
        discount: 17.9, // Only 10%
        netPrice: 161.1,
        sortOrder: 2,
      },
    ],
  })

  // Quote 6: Global Enterprises - Enterprise software + cloud bundle
  // Pattern: Software + cloud hosting cross-sell
  // Status: ACCEPTED, ~$42k, 22% discount
  const geQuote1Created = daysAgo(170)
  const geQuote1 = await prisma.quote.create({
    data: {
      name: 'Q-2024-GE-001',
      customerId: globalEnterprises.id,
      status: QuoteStatus.ACCEPTED,
      priceBookId: enterprisePriceBook.id,
      validTo: validToOffset(geQuote1Created, 45),
      createdAt: geQuote1Created,
      subtotal: 53820.0,
      discountTotal: 11840.4,
      total: 41979.6,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: geQuote1.id,
        productId: softwareLicenseEnterprise.id,
        quantity: 25,
        listPrice: 1299.0,
        discount: 285.78, // 22%
        netPrice: 1013.22,
        sortOrder: 0,
      },
      {
        quoteId: geQuote1.id,
        productId: cloudHostingPro.id,
        quantity: 24, // 2 years
        listPrice: 179.0,
        discount: 39.38, // 22%
        netPrice: 139.62,
        sortOrder: 1,
      },
      {
        quoteId: geQuote1.id,
        productId: implementationService.id,
        quantity: 40,
        listPrice: 225.0,
        discount: 49.5, // 22%
        netPrice: 175.5,
        sortOrder: 2,
      },
    ],
  })

  // Quote 7: Global Enterprises - Large laptop order with monitors
  // Pattern: Laptop + Monitor affinity
  // Status: ACCEPTED, ~$28k, 25% discount
  const geQuote2Created = daysAgo(140)
  const geQuote2 = await prisma.quote.create({
    data: {
      name: 'Q-2024-GE-002',
      customerId: globalEnterprises.id,
      status: QuoteStatus.ACCEPTED,
      priceBookId: enterprisePriceBook.id,
      validTo: validToOffset(geQuote2Created, 30),
      createdAt: geQuote2Created,
      subtotal: 37305.0,
      discountTotal: 9326.25,
      total: 27978.75,
    },
  })
  const geQuote2Parent = await prisma.quoteLineItem.create({
    data: {
      quoteId: geQuote2.id,
      productId: developerLaptop.id,
      quantity: 15,
      listPrice: 899.0,
      discount: 224.75, // 25%
      netPrice: 674.25,
      sortOrder: 0,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: geQuote2.id,
        parentLineId: geQuote2Parent.id,
        productId: i7.id,
        quantity: 15,
        listPrice: 180.0,
        discount: 45.0, // 25%
        netPrice: 135.0,
        sortOrder: 1,
      },
      {
        quoteId: geQuote2.id,
        parentLineId: geQuote2Parent.id,
        productId: ram32.id,
        quantity: 15,
        listPrice: 135.0,
        discount: 33.75,
        netPrice: 101.25,
        sortOrder: 2,
      },
      {
        quoteId: geQuote2.id,
        parentLineId: geQuote2Parent.id,
        productId: ssd1tb.id,
        quantity: 15,
        listPrice: 90.0,
        discount: 22.5,
        netPrice: 67.5,
        sortOrder: 3,
      },
      {
        quoteId: geQuote2.id,
        parentLineId: geQuote2Parent.id,
        productId: monitor27.id,
        quantity: 15,
        listPrice: 269.0,
        discount: 67.25, // 25%
        netPrice: 201.75,
        sortOrder: 4,
      },
      {
        quoteId: geQuote2.id,
        parentLineId: geQuote2Parent.id,
        productId: laptopStand.id,
        quantity: 15,
        listPrice: 71.0,
        discount: 17.75,
        netPrice: 53.25,
        sortOrder: 5,
      },
    ],
  })

  // Quote 8: Global Enterprises - Support renewal
  // Pattern: Support plan renewal
  // Status: FINALIZED, ~$8.5k, 15% discount
  const geQuote3Created = daysAgo(100)
  const geQuote3 = await prisma.quote.create({
    data: {
      name: 'Q-2024-GE-003',
      customerId: globalEnterprises.id,
      status: QuoteStatus.FINALIZED,
      priceBookId: enterprisePriceBook.id,
      validTo: validToOffset(geQuote3Created, 30),
      createdAt: geQuote3Created,
      subtotal: 9998.0,
      discountTotal: 1499.7,
      total: 8498.3,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: geQuote3.id,
        productId: supportPremium.id,
        quantity: 2, // 2 years
        listPrice: 4499.0,
        discount: 674.85, // 15%
        netPrice: 3824.15,
        sortOrder: 0,
      },
      {
        quoteId: geQuote3.id,
        productId: supportBasic.id,
        quantity: 1, // Additional basic for secondary team
        listPrice: 899.0,
        discount: 134.85, // 15%
        netPrice: 764.15,
        sortOrder: 1,
      },
    ],
  })

  // Quote 9: Global Enterprises - Rejected deal (price negotiation)
  // Pattern: Initial offer rejected, customer negotiating
  // Status: REJECTED, ~$35k, only 5% discount offered
  const geQuote4Created = daysAgo(45)
  const geQuote4 = await prisma.quote.create({
    data: {
      name: 'Q-2024-GE-004',
      customerId: globalEnterprises.id,
      status: QuoteStatus.REJECTED,
      priceBookId: enterprisePriceBook.id,
      validTo: validToOffset(geQuote4Created, 30),
      createdAt: geQuote4Created,
      subtotal: 37197.0,
      discountTotal: 1859.85,
      total: 35337.15,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: geQuote4.id,
        productId: softwareLicenseEnterprise.id,
        quantity: 20,
        listPrice: 1299.0,
        discount: 64.95, // Only 5%
        netPrice: 1234.05,
        sortOrder: 0,
      },
      {
        quoteId: geQuote4.id,
        productId: cloudHostingPro.id,
        quantity: 12,
        listPrice: 179.0,
        discount: 8.95, // Only 5%
        netPrice: 170.05,
        sortOrder: 1,
      },
      {
        quoteId: geQuote4.id,
        productId: supportBasic.id,
        quantity: 2,
        listPrice: 899.0,
        discount: 44.95, // Only 5%
        netPrice: 854.05,
        sortOrder: 2,
      },
    ],
  })

  // Quote 10: Global Enterprises - Follow-up accepted deal
  // Pattern: Revised pricing after rejection leads to acceptance
  // Status: ACCEPTED, ~$30k, 18% discount
  const geQuote5Created = daysAgo(30)
  const geQuote5 = await prisma.quote.create({
    data: {
      name: 'Q-2024-GE-005',
      customerId: globalEnterprises.id,
      status: QuoteStatus.ACCEPTED,
      priceBookId: enterprisePriceBook.id,
      validTo: validToOffset(geQuote5Created, 30),
      createdAt: geQuote5Created,
      subtotal: 37197.0,
      discountTotal: 6695.46,
      total: 30501.54,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: geQuote5.id,
        productId: softwareLicenseEnterprise.id,
        quantity: 20,
        listPrice: 1299.0,
        discount: 233.82, // 18%
        netPrice: 1065.18,
        sortOrder: 0,
      },
      {
        quoteId: geQuote5.id,
        productId: cloudHostingPro.id,
        quantity: 12,
        listPrice: 179.0,
        discount: 32.22, // 18%
        netPrice: 146.78,
        sortOrder: 1,
      },
      {
        quoteId: geQuote5.id,
        productId: supportBasic.id,
        quantity: 2,
        listPrice: 899.0,
        discount: 161.82, // 18%
        netPrice: 737.18,
        sortOrder: 2,
      },
    ],
  })

  console.log('  ✓ Created 10 enterprise customer historical quotes')

  // --------------------------------------------------------------------------
  // Startup/SMB Customer Quotes (StartupXYZ, Acme Corp)
  // Smaller deals (<$1k to $5k), minimal discounts (0-10%)
  // --------------------------------------------------------------------------

  // Quote 11: StartupXYZ - Basic software subscription
  // Pattern: Price-sensitive startup choosing basic tier
  // Status: ACCEPTED, ~$750, 5% discount
  const suQuote1Created = daysAgo(160)
  const suQuote1 = await prisma.quote.create({
    data: {
      name: 'Q-2024-SU-001',
      customerId: startupXyz.id,
      status: QuoteStatus.ACCEPTED,
      priceBookId: standardPriceBook.id,
      validTo: validToOffset(suQuote1Created, 30),
      createdAt: suQuote1Created,
      subtotal: 1740.0,
      discountTotal: 87.0,
      total: 1653.0,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: suQuote1.id,
        productId: softwareLicenseBasic.id,
        quantity: 60, // 5 seats x 12 months
        listPrice: 29.0,
        discount: 1.45, // 5%
        netPrice: 27.55,
        sortOrder: 0,
      },
    ],
  })

  // Quote 12: StartupXYZ - Pro upgrade
  // Pattern: Upsell from basic to pro
  // Status: ACCEPTED, ~$8.7k, 8% discount
  const suQuote2Created = daysAgo(130)
  const suQuote2 = await prisma.quote.create({
    data: {
      name: 'Q-2024-SU-002',
      customerId: startupXyz.id,
      status: QuoteStatus.ACCEPTED,
      priceBookId: standardPriceBook.id,
      validTo: validToOffset(suQuote2Created, 30),
      createdAt: suQuote2Created,
      subtotal: 9480.0,
      discountTotal: 758.4,
      total: 8721.6,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: suQuote2.id,
        productId: softwareLicensePro.id,
        quantity: 120, // 10 seats x 12 months
        listPrice: 79.0,
        discount: 6.32, // 8%
        netPrice: 72.68,
        sortOrder: 0,
      },
    ],
  })

  // Quote 13: StartupXYZ - Cloud hosting starter
  // Pattern: New cloud customer - starter tier
  // Status: ACCEPTED, ~$300, no discount
  const suQuote3Created = daysAgo(110)
  const suQuote3 = await prisma.quote.create({
    data: {
      name: 'Q-2024-SU-003',
      customerId: startupXyz.id,
      status: QuoteStatus.ACCEPTED,
      priceBookId: standardPriceBook.id,
      validTo: validToOffset(suQuote3Created, 30),
      createdAt: suQuote3Created,
      subtotal: 294.0,
      discountTotal: 0.0,
      total: 294.0,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: suQuote3.id,
        productId: cloudHostingBasic.id,
        quantity: 6,
        listPrice: 49.0,
        discount: 0.0, // No discount for starter
        netPrice: 49.0,
        sortOrder: 0,
      },
    ],
  })

  // Quote 14: StartupXYZ - Accessories order
  // Pattern: Hardware accessories for remote team
  // Status: ACCEPTED, ~$850, no discount
  const suQuote4Created = daysAgo(80)
  const suQuote4 = await prisma.quote.create({
    data: {
      name: 'Q-2024-SU-004',
      customerId: startupXyz.id,
      status: QuoteStatus.ACCEPTED,
      priceBookId: standardPriceBook.id,
      validTo: validToOffset(suQuote4Created, 30),
      createdAt: suQuote4Created,
      subtotal: 854.0,
      discountTotal: 0.0,
      total: 854.0,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: suQuote4.id,
        productId: monitor27.id,
        quantity: 2,
        listPrice: 299.0,
        discount: 0.0,
        netPrice: 299.0,
        sortOrder: 0,
      },
      {
        quoteId: suQuote4.id,
        productId: laptopStand.id,
        quantity: 2,
        listPrice: 79.0,
        discount: 0.0,
        netPrice: 79.0,
        sortOrder: 1,
      },
      {
        quoteId: suQuote4.id,
        productId: usbHub.id,
        quantity: 2,
        listPrice: 49.0,
        discount: 0.0,
        netPrice: 49.0,
        sortOrder: 2,
      },
    ],
  })

  // Quote 15: StartupXYZ - Basic support
  // Pattern: First-time support purchase
  // Status: FINALIZED, $999, no discount
  const suQuote5Created = daysAgo(50)
  const suQuote5 = await prisma.quote.create({
    data: {
      name: 'Q-2024-SU-005',
      customerId: startupXyz.id,
      status: QuoteStatus.FINALIZED,
      priceBookId: standardPriceBook.id,
      validTo: validToOffset(suQuote5Created, 30),
      createdAt: suQuote5Created,
      subtotal: 999.0,
      discountTotal: 0.0,
      total: 999.0,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: suQuote5.id,
        productId: supportBasic.id,
        quantity: 1,
        listPrice: 999.0,
        discount: 0.0,
        netPrice: 999.0,
        sortOrder: 0,
      },
    ],
  })

  // Quote 16: StartupXYZ - Rejected (over budget)
  // Pattern: Startup couldn't afford full package
  // Status: REJECTED, ~$5k, no discount offered
  const suQuote6Created = daysAgo(40)
  const suQuote6 = await prisma.quote.create({
    data: {
      name: 'Q-2024-SU-006',
      customerId: startupXyz.id,
      status: QuoteStatus.REJECTED,
      priceBookId: standardPriceBook.id,
      validTo: validToOffset(suQuote6Created, 30),
      createdAt: suQuote6Created,
      subtotal: 4897.0,
      discountTotal: 0.0,
      total: 4897.0,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: suQuote6.id,
        productId: softwareLicensePro.id,
        quantity: 24, // 2 seats x 12 months
        listPrice: 79.0,
        discount: 0.0,
        netPrice: 79.0,
        sortOrder: 0,
      },
      {
        quoteId: suQuote6.id,
        productId: cloudHostingPro.id,
        quantity: 12,
        listPrice: 199.0,
        discount: 0.0,
        netPrice: 199.0,
        sortOrder: 1,
      },
      {
        quoteId: suQuote6.id,
        productId: supportBasic.id,
        quantity: 1,
        listPrice: 999.0,
        discount: 0.0,
        netPrice: 999.0,
        sortOrder: 2,
      },
    ],
  })

  // Quote 17: Acme Corp - Single laptop bundle
  // Pattern: Individual workstation purchase
  // Status: ACCEPTED, ~$1.6k, 5% discount
  const acQuote1Created = daysAgo(135)
  const acQuote1 = await prisma.quote.create({
    data: {
      name: 'Q-2024-AC-001',
      customerId: acmeCorp.id,
      status: QuoteStatus.ACCEPTED,
      priceBookId: standardPriceBook.id,
      validTo: validToOffset(acQuote1Created, 30),
      createdAt: acQuote1Created,
      subtotal: 1677.0,
      discountTotal: 83.85,
      total: 1593.15,
    },
  })
  const acQuote1Parent = await prisma.quoteLineItem.create({
    data: {
      quoteId: acQuote1.id,
      productId: developerLaptop.id,
      quantity: 1,
      listPrice: 999.0,
      discount: 49.95, // 5%
      netPrice: 949.05,
      sortOrder: 0,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: acQuote1.id,
        parentLineId: acQuote1Parent.id,
        productId: i7.id,
        quantity: 1,
        listPrice: 200.0,
        discount: 10.0,
        netPrice: 190.0,
        sortOrder: 1,
      },
      {
        quoteId: acQuote1.id,
        parentLineId: acQuote1Parent.id,
        productId: ram32.id,
        quantity: 1,
        listPrice: 150.0,
        discount: 7.5,
        netPrice: 142.5,
        sortOrder: 2,
      },
      {
        quoteId: acQuote1.id,
        parentLineId: acQuote1Parent.id,
        productId: ssd1tb.id,
        quantity: 1,
        listPrice: 100.0,
        discount: 5.0,
        netPrice: 95.0,
        sortOrder: 3,
      },
      {
        quoteId: acQuote1.id,
        parentLineId: acQuote1Parent.id,
        productId: usbHub.id,
        quantity: 1,
        listPrice: 49.0,
        discount: 2.45,
        netPrice: 46.55,
        sortOrder: 4,
      },
      {
        quoteId: acQuote1.id,
        parentLineId: acQuote1Parent.id,
        productId: laptopStand.id,
        quantity: 1,
        listPrice: 79.0,
        discount: 3.95,
        netPrice: 75.05,
        sortOrder: 5,
      },
    ],
  })

  // Quote 18: Acme Corp - Pro software + cloud combo
  // Pattern: Software + cloud hosting bundle
  // Status: ACCEPTED, ~$2.6k, 10% discount
  const acQuote2Created = daysAgo(105)
  const acQuote2 = await prisma.quote.create({
    data: {
      name: 'Q-2024-AC-002',
      customerId: acmeCorp.id,
      status: QuoteStatus.ACCEPTED,
      priceBookId: standardPriceBook.id,
      validTo: validToOffset(acQuote2Created, 30),
      createdAt: acQuote2Created,
      subtotal: 2886.0,
      discountTotal: 288.6,
      total: 2597.4,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: acQuote2.id,
        productId: softwareLicensePro.id,
        quantity: 24, // 2 seats x 12 months
        listPrice: 79.0,
        discount: 7.9, // 10%
        netPrice: 71.1,
        sortOrder: 0,
      },
      {
        quoteId: acQuote2.id,
        productId: cloudHostingBasic.id,
        quantity: 12,
        listPrice: 49.0,
        discount: 4.9, // 10%
        netPrice: 44.1,
        sortOrder: 1,
      },
    ],
  })

  // Quote 19: Acme Corp - Small laptop order
  // Pattern: Team expansion hardware
  // Status: ACCEPTED, ~$4.2k, 5% discount
  const acQuote3Created = daysAgo(75)
  const acQuote3 = await prisma.quote.create({
    data: {
      name: 'Q-2024-AC-003',
      customerId: acmeCorp.id,
      status: QuoteStatus.ACCEPTED,
      priceBookId: standardPriceBook.id,
      validTo: validToOffset(acQuote3Created, 30),
      createdAt: acQuote3Created,
      subtotal: 4377.0,
      discountTotal: 218.85,
      total: 4158.15,
    },
  })
  const acQuote3Parent = await prisma.quoteLineItem.create({
    data: {
      quoteId: acQuote3.id,
      productId: developerLaptop.id,
      quantity: 3,
      listPrice: 999.0,
      discount: 49.95, // 5%
      netPrice: 949.05,
      sortOrder: 0,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: acQuote3.id,
        parentLineId: acQuote3Parent.id,
        productId: i5.id,
        quantity: 3,
        listPrice: 0.0, // Base included
        discount: 0.0,
        netPrice: 0.0,
        sortOrder: 1,
      },
      {
        quoteId: acQuote3.id,
        parentLineId: acQuote3Parent.id,
        productId: ram16.id,
        quantity: 3,
        listPrice: 0.0, // Base included
        discount: 0.0,
        netPrice: 0.0,
        sortOrder: 2,
      },
      {
        quoteId: acQuote3.id,
        parentLineId: acQuote3Parent.id,
        productId: ssd1tb.id,
        quantity: 3,
        listPrice: 100.0,
        discount: 5.0, // 5%
        netPrice: 95.0,
        sortOrder: 3,
      },
      {
        quoteId: acQuote3.id,
        parentLineId: acQuote3Parent.id,
        productId: monitor27.id,
        quantity: 3,
        listPrice: 299.0,
        discount: 14.95, // 5%
        netPrice: 284.05,
        sortOrder: 4,
      },
    ],
  })

  // Quote 20: Acme Corp - Cancelled project
  // Pattern: Quote cancelled due to project cancellation
  // Status: CANCELLED, ~$2.5k, 5% discount
  const acQuote4Created = daysAgo(55)
  const acQuote4 = await prisma.quote.create({
    data: {
      name: 'Q-2024-AC-004',
      customerId: acmeCorp.id,
      status: QuoteStatus.CANCELLED,
      priceBookId: standardPriceBook.id,
      validTo: validToOffset(acQuote4Created, 30),
      createdAt: acQuote4Created,
      subtotal: 2547.0,
      discountTotal: 127.35,
      total: 2419.65,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: acQuote4.id,
        productId: softwareLicensePro.id,
        quantity: 24, // 2 seats x 12 months
        listPrice: 79.0,
        discount: 3.95, // 5%
        netPrice: 75.05,
        sortOrder: 0,
      },
      {
        quoteId: acQuote4.id,
        productId: cloudHostingBasic.id,
        quantity: 6,
        listPrice: 49.0,
        discount: 2.45,
        netPrice: 46.55,
        sortOrder: 1,
      },
      {
        quoteId: acQuote4.id,
        productId: trainingPackage.id,
        quantity: 1,
        listPrice: 2000.0,
        discount: 100.0,
        netPrice: 1900.0,
        sortOrder: 2,
      },
    ],
  })

  // Quote 21: Acme Corp - Medium software deal
  // Pattern: Growing team software needs
  // Status: ACCEPTED, ~$3.6k, 8% discount
  const acQuote5Created = daysAgo(35)
  const acQuote5 = await prisma.quote.create({
    data: {
      name: 'Q-2024-AC-005',
      customerId: acmeCorp.id,
      status: QuoteStatus.ACCEPTED,
      priceBookId: standardPriceBook.id,
      validTo: validToOffset(acQuote5Created, 30),
      createdAt: acQuote5Created,
      subtotal: 3948.0,
      discountTotal: 315.84,
      total: 3632.16,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: acQuote5.id,
        productId: softwareLicensePro.id,
        quantity: 48, // 4 seats x 12 months
        listPrice: 79.0,
        discount: 6.32, // 8%
        netPrice: 72.68,
        sortOrder: 0,
      },
      {
        quoteId: acQuote5.id,
        productId: supportBasic.id,
        quantity: 1,
        listPrice: 999.0,
        discount: 79.92, // 8%
        netPrice: 919.08,
        sortOrder: 1,
      },
    ],
  })

  // Quote 22: Acme Corp - Cloud upgrade with support
  // Pattern: Infrastructure upgrade
  // Status: FINALIZED, ~$3.2k, 10% discount
  const acQuote6Created = daysAgo(20)
  const acQuote6 = await prisma.quote.create({
    data: {
      name: 'Q-2024-AC-006',
      customerId: acmeCorp.id,
      status: QuoteStatus.FINALIZED,
      priceBookId: standardPriceBook.id,
      validTo: validToOffset(acQuote6Created, 30),
      createdAt: acQuote6Created,
      subtotal: 3588.0,
      discountTotal: 358.8,
      total: 3229.2,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: acQuote6.id,
        productId: cloudHostingPro.id,
        quantity: 12,
        listPrice: 199.0,
        discount: 19.9, // 10%
        netPrice: 179.1,
        sortOrder: 0,
      },
      {
        quoteId: acQuote6.id,
        productId: supportBasic.id,
        quantity: 1,
        listPrice: 999.0,
        discount: 99.9, // 10%
        netPrice: 899.1,
        sortOrder: 1,
      },
    ],
  })

  // Quote 23: StartupXYZ - Rejected Pro software (went with competitor)
  // Pattern: Price comparison resulted in loss
  // Status: REJECTED, ~$4.7k, 5% discount wasn't enough
  const suQuote7Created = daysAgo(25)
  const suQuote7 = await prisma.quote.create({
    data: {
      name: 'Q-2024-SU-007',
      customerId: startupXyz.id,
      status: QuoteStatus.REJECTED,
      priceBookId: standardPriceBook.id,
      validTo: validToOffset(suQuote7Created, 30),
      createdAt: suQuote7Created,
      subtotal: 4998.0,
      discountTotal: 249.9,
      total: 4748.1,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: suQuote7.id,
        productId: softwareLicensePro.id,
        quantity: 60, // 5 seats x 12 months
        listPrice: 79.0,
        discount: 3.95, // Only 5%
        netPrice: 75.05,
        sortOrder: 0,
      },
      {
        quoteId: suQuote7.id,
        productId: supportBasic.id,
        quantity: 1,
        listPrice: 999.0,
        discount: 49.95, // Only 5%
        netPrice: 949.05,
        sortOrder: 1,
      },
    ],
  })

  // Quote 24: Acme Corp - Accessories with laptops
  // Pattern: Complete workstation bundle
  // Status: ACCEPTED, ~$2.1k, 5% discount
  const acQuote7Created = daysAgo(15)
  const acQuote7 = await prisma.quote.create({
    data: {
      name: 'Q-2024-AC-007',
      customerId: acmeCorp.id,
      status: QuoteStatus.ACCEPTED,
      priceBookId: standardPriceBook.id,
      validTo: validToOffset(acQuote7Created, 30),
      createdAt: acQuote7Created,
      subtotal: 2156.0,
      discountTotal: 107.8,
      total: 2048.2,
    },
  })
  await prisma.quoteLineItem.createMany({
    data: [
      {
        quoteId: acQuote7.id,
        productId: monitor27.id,
        quantity: 4,
        listPrice: 299.0,
        discount: 14.95, // 5%
        netPrice: 284.05,
        sortOrder: 0,
      },
      {
        quoteId: acQuote7.id,
        productId: laptopStand.id,
        quantity: 4,
        listPrice: 79.0,
        discount: 3.95,
        netPrice: 75.05,
        sortOrder: 1,
      },
      {
        quoteId: acQuote7.id,
        productId: usbHub.id,
        quantity: 4,
        listPrice: 49.0,
        discount: 2.45,
        netPrice: 46.55,
        sortOrder: 2,
      },
    ],
  })

  console.log('  ✓ Created 14 startup/SMB customer historical quotes')
  console.log('  ✓ Total historical quotes: 24 (plus 1 example = 25)')
  console.log('    Status distribution: 15 ACCEPTED (60%), 5 REJECTED (20%), 4 FINALIZED (16%), 1 CANCELLED (4%)')

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

  // ============================================================================
  // Product Affinities (Guided Selling Recommendations)
  // ============================================================================

  // Cross-sell: When buying software license, suggest cloud hosting
  await prisma.productAffinity.create({
    data: {
      sourceProductId: softwareLicensePro.id,
      targetProductId: cloudHostingPro.id,
      type: AffinityType.CROSS_SELL,
      priority: 10,
      sourceBillingFrequency: BillingFrequency.MONTHLY,
      targetBillingFrequency: BillingFrequency.MONTHLY,
      isActive: true,
    },
  })

  // Cross-sell: Software basic → suggest Pro upgrade
  await prisma.productAffinity.create({
    data: {
      sourceProductId: softwareLicenseBasic.id,
      targetProductId: softwareLicensePro.id,
      type: AffinityType.UPSELL,
      priority: 5,
      isActive: true,
    },
  })

  // Cross-sell: Cloud hosting → suggest support plan
  await prisma.productAffinity.create({
    data: {
      sourceProductId: cloudHostingPro.id,
      targetProductId: supportPremium.id,
      type: AffinityType.CROSS_SELL,
      priority: 15,
      isActive: true,
    },
  })

  // Required: Enterprise software requires implementation service
  await prisma.productAffinity.create({
    data: {
      sourceProductId: softwareLicenseEnterprise.id,
      targetProductId: implementationService.id,
      type: AffinityType.REQUIRED,
      priority: 1,
      isActive: true,
    },
  })

  // Accessory: Monitor suggests laptop stand
  await prisma.productAffinity.create({
    data: {
      sourceProductId: monitor27.id,
      targetProductId: laptopStand.id,
      type: AffinityType.ACCESSORY,
      priority: 50,
      isActive: true,
    },
  })

  // Accessory: Laptop suggests USB hub
  await prisma.productAffinity.create({
    data: {
      sourceProductId: developerLaptop.id,
      targetProductId: usbHub.id,
      type: AffinityType.ACCESSORY,
      priority: 40,
      isActive: true,
    },
  })

  // Subscription add-on: Cloud hosting suggests training
  await prisma.productAffinity.create({
    data: {
      sourceProductId: cloudHostingPro.id,
      targetProductId: trainingPackage.id,
      type: AffinityType.SUBSCRIPTION_ADDON,
      priority: 30,
      targetBillingFrequency: BillingFrequency.ONE_TIME,
      isActive: true,
    },
  })

  // Category-based affinity: Hardware category → Accessories category
  await prisma.productAffinity.create({
    data: {
      sourceCategoryId: hardwareCategory.id,
      targetCategoryId: accessoriesCategory.id,
      type: AffinityType.CROSS_SELL,
      priority: 100,
      isActive: true,
    },
  })

  console.log('  ✓ Created product affinities')

  // ============================================================================
  // Guided Selling Questionnaire
  // ============================================================================

  const devToolsQuestionnaire = await prisma.questionnaire.create({
    data: {
      name: 'Developer Tools Finder',
      description: 'Help find the right developer tools package based on team size and requirements',
      isActive: true,
    },
  })

  // Question 1: Team size
  const teamSizeQuestion = await prisma.question.create({
    data: {
      questionnaireId: devToolsQuestionnaire.id,
      text: 'How large is your development team?',
      type: QuestionType.SINGLE_CHOICE,
      options: [
        { label: '1-5 developers', value: 'small' },
        { label: '6-20 developers', value: 'medium' },
        { label: '21-50 developers', value: 'large' },
        { label: '50+ developers', value: 'enterprise' },
      ],
      sortOrder: 0,
    },
  })

  // Question 2: Hosting needs
  const hostingQuestion = await prisma.question.create({
    data: {
      questionnaireId: devToolsQuestionnaire.id,
      text: 'Do you need cloud hosting for your applications?',
      type: QuestionType.YES_NO,
      sortOrder: 1,
    },
  })

  // Question 3: Support level
  const supportQuestion = await prisma.question.create({
    data: {
      questionnaireId: devToolsQuestionnaire.id,
      text: 'What level of support do you require?',
      type: QuestionType.SINGLE_CHOICE,
      options: [
        { label: 'Community/Self-service', value: 'none' },
        { label: 'Business hours email support', value: 'basic' },
        { label: '24/7 dedicated support', value: 'premium' },
      ],
      sortOrder: 2,
    },
  })

  // Question 4: Training needs
  const trainingQuestion = await prisma.question.create({
    data: {
      questionnaireId: devToolsQuestionnaire.id,
      text: 'Does your team need training?',
      type: QuestionType.YES_NO,
      sortOrder: 3,
    },
  })

  // Product mappings for team size question
  await prisma.questionProductMapping.createMany({
    data: [
      // Small team → Basic tools
      { questionId: teamSizeQuestion.id, productId: softwareLicenseBasic.id, answerValue: 'small', score: 20 },
      { questionId: teamSizeQuestion.id, productId: cloudHostingBasic.id, answerValue: 'small', score: 15 },
      // Medium team → Pro tools
      { questionId: teamSizeQuestion.id, productId: softwareLicensePro.id, answerValue: 'medium', score: 25 },
      { questionId: teamSizeQuestion.id, productId: cloudHostingPro.id, answerValue: 'medium', score: 20 },
      // Large team → Pro tools with higher score
      { questionId: teamSizeQuestion.id, productId: softwareLicensePro.id, answerValue: 'large', score: 30 },
      { questionId: teamSizeQuestion.id, productId: cloudHostingPro.id, answerValue: 'large', score: 25 },
      // Enterprise → Enterprise tools
      { questionId: teamSizeQuestion.id, productId: softwareLicenseEnterprise.id, answerValue: 'enterprise', score: 40 },
      { questionId: teamSizeQuestion.id, productId: cloudHostingPro.id, answerValue: 'enterprise', score: 30 },
      { questionId: teamSizeQuestion.id, productId: implementationService.id, answerValue: 'enterprise', score: 25 },
    ],
  })

  // Product mappings for hosting question
  await prisma.questionProductMapping.createMany({
    data: [
      { questionId: hostingQuestion.id, productId: cloudHostingBasic.id, answerValue: 'yes', score: 20 },
      { questionId: hostingQuestion.id, productId: cloudHostingPro.id, answerValue: 'yes', score: 15 },
    ],
  })

  // Product mappings for support question
  await prisma.questionProductMapping.createMany({
    data: [
      { questionId: supportQuestion.id, productId: supportBasic.id, answerValue: 'basic', score: 25 },
      { questionId: supportQuestion.id, productId: supportPremium.id, answerValue: 'premium', score: 30 },
    ],
  })

  // Product mappings for training question
  await prisma.questionProductMapping.createMany({
    data: [
      { questionId: trainingQuestion.id, productId: trainingPackage.id, answerValue: 'yes', score: 25 },
    ],
  })

  console.log('  ✓ Created guided selling questionnaire')

  // ============================================================================
  // Hardware Selection Questionnaire
  // ============================================================================

  const hardwareQuestionnaire = await prisma.questionnaire.create({
    data: {
      name: 'Hardware Configuration Helper',
      description: 'Find the right hardware configuration for your needs',
      isActive: true,
    },
  })

  // Question 1: Primary use case
  const useCaseQuestion = await prisma.question.create({
    data: {
      questionnaireId: hardwareQuestionnaire.id,
      text: 'What is your primary use case?',
      type: QuestionType.SINGLE_CHOICE,
      options: [
        { label: 'Web development', value: 'web' },
        { label: 'Data science / ML', value: 'data' },
        { label: 'Video editing / Creative', value: 'creative' },
        { label: 'General office work', value: 'office' },
      ],
      sortOrder: 0,
    },
  })

  // Question 2: Budget
  const budgetQuestion = await prisma.question.create({
    data: {
      questionnaireId: hardwareQuestionnaire.id,
      text: 'What is your budget range?',
      type: QuestionType.SINGLE_CHOICE,
      options: [
        { label: 'Under $1,500', value: 'low' },
        { label: '$1,500 - $2,500', value: 'medium' },
        { label: 'Over $2,500', value: 'high' },
      ],
      sortOrder: 1,
    },
  })

  // Product mappings for use case question
  await prisma.questionProductMapping.createMany({
    data: [
      // Web development - mid-range
      { questionId: useCaseQuestion.id, productId: i5.id, answerValue: 'web', score: 15 },
      { questionId: useCaseQuestion.id, productId: ram16.id, answerValue: 'web', score: 15 },
      { questionId: useCaseQuestion.id, productId: ssd512.id, answerValue: 'web', score: 10 },
      // Data science - high performance
      { questionId: useCaseQuestion.id, productId: i9.id, answerValue: 'data', score: 25 },
      { questionId: useCaseQuestion.id, productId: ram64.id, answerValue: 'data', score: 25 },
      { questionId: useCaseQuestion.id, productId: ssd2tb.id, answerValue: 'data', score: 20 },
      // Creative - balanced high-end
      { questionId: useCaseQuestion.id, productId: i7.id, answerValue: 'creative', score: 20 },
      { questionId: useCaseQuestion.id, productId: ram32.id, answerValue: 'creative', score: 20 },
      { questionId: useCaseQuestion.id, productId: ssd1tb.id, answerValue: 'creative', score: 15 },
      { questionId: useCaseQuestion.id, productId: monitor27.id, answerValue: 'creative', score: 20 },
      // Office - basic
      { questionId: useCaseQuestion.id, productId: i5.id, answerValue: 'office', score: 20 },
      { questionId: useCaseQuestion.id, productId: ram16.id, answerValue: 'office', score: 20 },
      { questionId: useCaseQuestion.id, productId: ssd512.id, answerValue: 'office', score: 15 },
    ],
  })

  // Product mappings for budget question
  await prisma.questionProductMapping.createMany({
    data: [
      // Low budget - basic options
      { questionId: budgetQuestion.id, productId: i5.id, answerValue: 'low', score: 20 },
      { questionId: budgetQuestion.id, productId: ram16.id, answerValue: 'low', score: 20 },
      { questionId: budgetQuestion.id, productId: ssd512.id, answerValue: 'low', score: 15 },
      // Medium budget - mid-range
      { questionId: budgetQuestion.id, productId: i7.id, answerValue: 'medium', score: 20 },
      { questionId: budgetQuestion.id, productId: ram32.id, answerValue: 'medium', score: 20 },
      { questionId: budgetQuestion.id, productId: ssd1tb.id, answerValue: 'medium', score: 15 },
      // High budget - premium
      { questionId: budgetQuestion.id, productId: i9.id, answerValue: 'high', score: 25 },
      { questionId: budgetQuestion.id, productId: ram64.id, answerValue: 'high', score: 25 },
      { questionId: budgetQuestion.id, productId: ssd2tb.id, answerValue: 'high', score: 20 },
      { questionId: budgetQuestion.id, productId: monitor27.id, answerValue: 'high', score: 15 },
    ],
  })

  console.log('  ✓ Created hardware questionnaire')

  // ============================================================================
  // Quote Layouts
  // ============================================================================

  // Simple layout - single section with basic columns
  await prisma.quoteLayout.create({
    data: {
      name: 'Simple',
      entityId: 'default',
      description: 'A clean, simple layout with basic columns',
      isTemplate: true,
      sections: [
        {
          id: 'main',
          name: 'Products',
          columns: [
            { field: 'productName', label: 'Product', align: 'left' },
            { field: 'quantity', label: 'Qty', align: 'center', width: '80px' },
            { field: 'unitPrice', label: 'Unit Price', align: 'right', width: '120px' },
            { field: 'netPrice', label: 'Total', align: 'right', width: '120px' },
          ],
          showSubtotal: false,
          sortOrder: 0,
        },
      ],
      summaryConfig: {
        showSubtotal: true,
        showDiscounts: true,
        showTaxes: true,
        showTotal: true,
      },
      theme: {
        primaryColor: '#1a56db',
        secondaryColor: '#6b7280',
        fontFamily: 'system-ui, sans-serif',
        headerStyle: 'simple',
        tableBorders: true,
        alternateRowColors: false,
      },
    },
  })

  // Detailed layout - single section with all columns including descriptions
  await prisma.quoteLayout.create({
    data: {
      name: 'Detailed',
      entityId: 'default',
      description: 'A comprehensive layout showing all product details',
      isTemplate: true,
      sections: [
        {
          id: 'main',
          name: 'Products & Services',
          columns: [
            { field: 'productName', label: 'Item', align: 'left' },
            { field: 'sku', label: 'SKU', align: 'left', width: '100px' },
            { field: 'quantity', label: 'Qty', align: 'center', width: '60px' },
            { field: 'unit', label: 'Unit', align: 'center', width: '60px' },
            { field: 'unitPrice', label: 'Unit Price', align: 'right', width: '100px' },
            { field: 'discount', label: 'Discount', align: 'right', width: '100px' },
            { field: 'netPrice', label: 'Net Price', align: 'right', width: '100px' },
          ],
          showSubtotal: true,
          sortOrder: 0,
        },
      ],
      summaryConfig: {
        showSubtotal: true,
        showDiscounts: true,
        showTaxes: true,
        showTotal: true,
      },
      theme: {
        primaryColor: '#059669',
        secondaryColor: '#6b7280',
        fontFamily: 'system-ui, sans-serif',
        headerStyle: 'branded',
        tableBorders: true,
        alternateRowColors: true,
      },
    },
  })

  // Sectioned layout - multiple sections splitting by product type
  await prisma.quoteLayout.create({
    data: {
      name: 'Sectioned',
      entityId: 'default',
      description: 'Products organized by type into separate sections',
      isTemplate: true,
      sections: [
        {
          id: 'bundles',
          name: 'Bundles',
          description: 'Configured product bundles',
          columns: [
            { field: 'productName', label: 'Bundle', align: 'left' },
            { field: 'quantity', label: 'Qty', align: 'center', width: '80px' },
            { field: 'unitPrice', label: 'Base Price', align: 'right', width: '120px' },
            { field: 'netPrice', label: 'Total', align: 'right', width: '120px' },
          ],
          filter: { type: 'productType', productTypes: ['BUNDLE'] },
          showSubtotal: true,
          sortOrder: 0,
        },
        {
          id: 'standalone',
          name: 'Products',
          description: 'Individual products and components',
          columns: [
            { field: 'productName', label: 'Product', align: 'left' },
            { field: 'sku', label: 'SKU', align: 'left', width: '100px' },
            { field: 'quantity', label: 'Qty', align: 'center', width: '60px' },
            { field: 'unitPrice', label: 'Price', align: 'right', width: '100px' },
            { field: 'discount', label: 'Discount', align: 'right', width: '100px' },
            { field: 'netPrice', label: 'Net', align: 'right', width: '100px' },
          ],
          filter: { type: 'productType', productTypes: ['STANDALONE'] },
          showSubtotal: true,
          sortOrder: 1,
        },
      ],
      summaryConfig: {
        showSubtotal: true,
        showDiscounts: true,
        showTaxes: true,
        showTotal: true,
      },
      theme: {
        primaryColor: '#7c3aed',
        secondaryColor: '#a78bfa',
        fontFamily: 'system-ui, sans-serif',
        headerStyle: 'simple',
        tableBorders: true,
        alternateRowColors: true,
      },
    },
  })

  console.log('  ✓ Created quote layout templates')

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
  console.log(`   - 25 quotes total for AI training data:`)
  console.log(`     - 1 example quote (DRAFT)`)
  console.log(`     - 10 enterprise quotes (TechGiant, Global Enterprises) - large deals, 15-25% discounts`)
  console.log(`     - 14 startup/SMB quotes (StartupXYZ, Acme Corp) - smaller deals, 0-10% discounts`)
  console.log(`     - Status distribution: 15 ACCEPTED (60%), 5 REJECTED (20%), 4 FINALIZED (16%), 1 CANCELLED (4%)`)
  console.log(`   - 3 contracts (1 active, 1 draft, 1 expired)`)
  console.log(`   - 8 product affinities (cross-sell, upsell, required, accessory)`)
  console.log(`   - 2 questionnaires (Developer Tools Finder, Hardware Configuration Helper)`)
  console.log(`   - 3 quote layout templates (Simple, Detailed, Sectioned)`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
