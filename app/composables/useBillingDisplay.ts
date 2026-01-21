import type { BillingFrequency } from '../generated/prisma/client'

/**
 * Composable for billing frequency display helpers
 */
export function useBillingDisplay() {
  /**
   * Get human-readable label for billing frequency
   */
  function getBillingLabel(frequency: BillingFrequency, customMonths?: number | null): string {
    switch (frequency) {
      case 'ONE_TIME':
        return 'One-Time'
      case 'MONTHLY':
        return 'Monthly'
      case 'QUARTERLY':
        return 'Quarterly'
      case 'ANNUAL':
        return 'Annual'
      case 'CUSTOM':
        return customMonths ? `${customMonths} mo` : 'Custom'
      default:
        return 'One-Time'
    }
  }

  /**
   * Get short suffix for price display (e.g., "/mo", "/yr")
   */
  function getBillingSuffix(frequency: BillingFrequency, customMonths?: number | null): string {
    switch (frequency) {
      case 'ONE_TIME':
        return ''
      case 'MONTHLY':
        return '/mo'
      case 'QUARTERLY':
        return '/qtr'
      case 'ANNUAL':
        return '/yr'
      case 'CUSTOM':
        return customMonths ? `/${customMonths}mo` : ''
      default:
        return ''
    }
  }

  /**
   * Check if billing frequency is recurring
   */
  function isRecurring(frequency: BillingFrequency): boolean {
    return frequency !== 'ONE_TIME'
  }

  /**
   * Convert billing frequency to months for calculations
   */
  function billingFrequencyToMonths(frequency: BillingFrequency, customMonths?: number | null): number {
    switch (frequency) {
      case 'ONE_TIME':
        return 0
      case 'MONTHLY':
        return 1
      case 'QUARTERLY':
        return 3
      case 'ANNUAL':
        return 12
      case 'CUSTOM':
        return customMonths || 1
      default:
        return 0
    }
  }

  /**
   * Calculate Monthly Recurring Revenue from a price and billing frequency
   */
  function calculateLineMRR(
    netPrice: string | number,
    frequency: BillingFrequency,
    customMonths?: number | null
  ): number {
    const price = typeof netPrice === 'string' ? parseFloat(netPrice) : netPrice
    const months = billingFrequencyToMonths(frequency, customMonths)
    if (months === 0) return 0
    return price / months
  }

  /**
   * Get the effective term for a line item (line override > product default > fallback)
   */
  function getEffectiveTerm(
    lineTermMonths?: number | null,
    productDefaultTermMonths?: number | null
  ): number | null {
    return lineTermMonths ?? productDefaultTermMonths ?? null
  }

  /**
   * Format term for display (e.g., "12 mo", "36 mo")
   */
  function formatTerm(termMonths: number | null | undefined): string {
    if (!termMonths) return '-'
    return `${termMonths} mo`
  }

  return {
    getBillingLabel,
    getBillingSuffix,
    isRecurring,
    billingFrequencyToMonths,
    calculateLineMRR,
    getEffectiveTerm,
    formatTerm,
  }
}
