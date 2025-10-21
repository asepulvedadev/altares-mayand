/**
 * Format currency for Mexican Pesos (MXN)
 * @param amount - The amount to format
 * @param options - Intl.NumberFormatOptions to customize formatting
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount)
}

/**
 * Format currency without currency symbol (just the number)
 * @param amount - The amount to format
 * @returns Formatted number string
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Parse currency string to number
 * @param currencyString - String like "$1,234.56" or "1234.56"
 * @returns Parsed number
 */
export function parseCurrency(currencyString: string): number {
  const cleaned = currencyString.replace(/[^0-9.-]+/g, '')
  return parseFloat(cleaned) || 0
}
