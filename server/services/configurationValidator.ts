import { usePrisma } from '../utils/prisma'

export interface ValidationError {
  featureId: string
  featureName: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export interface SelectedOption {
  optionId: string
  quantity: number
}

/**
 * Validate a bundle configuration against feature constraints
 */
export async function validateBundleConfiguration(
  bundleId: string,
  selectedOptions: SelectedOption[]
): Promise<ValidationResult> {
  const prisma = usePrisma()
  const bundle = await prisma.product.findUnique({
    where: { id: bundleId },
    include: {
      features: {
        include: {
          options: true,
        },
      },
    },
  })

  if (!bundle || bundle.type !== 'BUNDLE') {
    return {
      valid: false,
      errors: [
        {
          featureId: '',
          featureName: '',
          message: 'Invalid bundle product',
        },
      ],
    }
  }

  const errors: ValidationError[] = []
  const selectedOptionIds = new Set(selectedOptions.map((s) => s.optionId))

  for (const feature of bundle.features) {
    // Count how many options from this feature are selected
    const selectedCount = feature.options.filter((opt) =>
      selectedOptionIds.has(opt.id)
    ).length

    // Check minimum options
    if (selectedCount < feature.minOptions) {
      errors.push({
        featureId: feature.id,
        featureName: feature.name,
        message: `At least ${feature.minOptions} option(s) must be selected`,
      })
    }

    // Check maximum options
    if (selectedCount > feature.maxOptions) {
      errors.push({
        featureId: feature.id,
        featureName: feature.name,
        message: `At most ${feature.maxOptions} option(s) can be selected`,
      })
    }

    // Check required options
    const requiredOptions = feature.options.filter((opt) => opt.isRequired)
    for (const required of requiredOptions) {
      if (!selectedOptionIds.has(required.id)) {
        errors.push({
          featureId: feature.id,
          featureName: feature.name,
          message: `Required option must be selected`,
        })
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Get all required options for a bundle
 */
export async function getRequiredOptions(bundleId: string): Promise<
  Array<{
    featureId: string
    featureName: string
    optionId: string
    optionProductId: string
  }>
> {
  const prisma = usePrisma()
  const bundle = await prisma.product.findUnique({
    where: { id: bundleId },
    include: {
      features: {
        include: {
          options: {
            where: { isRequired: true },
          },
        },
      },
    },
  })

  if (!bundle || bundle.type !== 'BUNDLE') {
    return []
  }

  const requiredOptions: Array<{
    featureId: string
    featureName: string
    optionId: string
    optionProductId: string
  }> = []

  for (const feature of bundle.features) {
    for (const option of feature.options) {
      requiredOptions.push({
        featureId: feature.id,
        featureName: feature.name,
        optionId: option.id,
        optionProductId: option.optionProductId,
      })
    }
  }

  return requiredOptions
}

/**
 * Get default options for a bundle (pre-selected options)
 */
export async function getDefaultOptions(bundleId: string): Promise<
  Array<{
    featureId: string
    optionId: string
    optionProductId: string
  }>
> {
  const prisma = usePrisma()
  const bundle = await prisma.product.findUnique({
    where: { id: bundleId },
    include: {
      features: {
        include: {
          options: {
            where: { isDefault: true },
          },
        },
      },
    },
  })

  if (!bundle || bundle.type !== 'BUNDLE') {
    return []
  }

  const defaultOptions: Array<{
    featureId: string
    optionId: string
    optionProductId: string
  }> = []

  for (const feature of bundle.features) {
    for (const option of feature.options) {
      defaultOptions.push({
        featureId: feature.id,
        optionId: option.id,
        optionProductId: option.optionProductId,
      })
    }
  }

  return defaultOptions
}
