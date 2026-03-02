import type { Currency } from '../types/currency';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
};

/**
 * Format a number as currency with the appropriate symbol and formatting
 * @param amount - The amount to format
 * @param currency - The currency code (EUR, USD, GBP)
 * @returns Formatted currency string (e.g., "€750,000" or "$750,000")
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return `${symbol}${formatted}`;
}

/**
 * Format a number with thousands separators and optional decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string (e.g., "1,234" or "1,234.56")
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a decimal value as a percentage
 * @param value - The decimal value (e.g., 0.07 for 7%)
 * @returns Formatted percentage string (e.g., "7.0%")
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Get the currency symbol for a given currency code
 * @param currency - The currency code
 * @returns The currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency];
}

/**
 * Parse a formatted currency string back to a number
 * @param value - The formatted currency string
 * @returns The numeric value
 */
export function parseCurrency(value: string): number {
  // Remove currency symbols, spaces, and commas
  const cleaned = value.replace(/[€$£,\s]/g, '');
  return parseFloat(cleaned) || 0;
}
