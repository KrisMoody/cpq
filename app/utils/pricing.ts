/**
 * Calculate margin percentage from cost and price
 * Returns null if calculation is not possible (invalid inputs)
 *
 * Formula: ((price - cost) / price) * 100
 */
export function calculateMarginPercent(
  cost: number | string | null | undefined,
  price: number | string | null | undefined
): number | null {
  const costNum = typeof cost === 'string' ? parseFloat(cost) : cost
  const priceNum = typeof price === 'string' ? parseFloat(price) : price

  if (
    costNum == null ||
    priceNum == null ||
    isNaN(costNum) ||
    isNaN(priceNum) ||
    priceNum <= 0
  ) {
    return null
  }

  return ((priceNum - costNum) / priceNum) * 100
}

/**
 * Format margin percentage for display
 * Returns "—" if margin cannot be calculated
 */
export function formatMarginPercent(
  cost: number | string | null | undefined,
  price: number | string | null | undefined
): string {
  const margin = calculateMarginPercent(cost, price)
  if (margin === null) {
    return '—'
  }
  return `${Math.round(margin)}%`
}
