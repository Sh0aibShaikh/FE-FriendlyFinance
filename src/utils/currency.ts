import { CURRENCIES, CurrencyConfig } from '../constants';

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currencyCode - The currency code (e.g., 'INR', 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencyCode: string = 'INR'): string => {
  const currency = CURRENCIES[currencyCode];
  
  if (!currency) {
    return `${amount.toFixed(2)}`;
  }

  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currency.decimalPlaces,
      maximumFractionDigits: currency.decimalPlaces
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    return `${currency.symbol}${amount.toFixed(currency.decimalPlaces)}`;
  }
};

/**
 * Format a number with currency symbol only (no locale formatting)
 * @param amount - The amount to format
 * @param currencyCode - The currency code
 * @returns Formatted string with symbol
 */
export const formatCurrencySimple = (amount: number, currencyCode: string = 'INR'): string => {
  const currency = CURRENCIES[currencyCode];
  
  if (!currency) {
    return `${amount.toFixed(2)}`;
  }

  const formatted = amount.toFixed(currency.decimalPlaces);
  return `${currency.symbol}${formatted}`;
};

/**
 * Get currency configuration
 * @param currencyCode - The currency code
 * @returns Currency configuration object
 */
export const getCurrencyConfig = (currencyCode: string): CurrencyConfig | null => {
  return CURRENCIES[currencyCode] || null;
};

/**
 * Get currency symbol
 * @param currencyCode - The currency code
 * @returns Currency symbol
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = CURRENCIES[currencyCode];
  return currency?.symbol || currencyCode;
};

/**
 * Get currency name
 * @param currencyCode - The currency code
 * @returns Currency name
 */
export const getCurrencyName = (currencyCode: string): string => {
  const currency = CURRENCIES[currencyCode];
  return currency?.name || currencyCode;
};

/**
 * Get country name for currency
 * @param currencyCode - The currency code
 * @returns Country name
 */
export const getCurrencyCountry = (currencyCode: string): string => {
  const currency = CURRENCIES[currencyCode];
  return currency?.country || '';
};

/**
 * Parse currency string to number
 * @param currencyString - The currency string (e.g., "₹1,000.00")
 * @returns Parsed number
 */
export const parseCurrency = (currencyString: string): number => {
  // Remove all non-numeric characters except decimal point
  const cleaned = currencyString.replace(/[^\d.-]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Format amount for display in input field
 * @param amount - The amount
 * @param currencyCode - The currency code
 * @returns Formatted string for display
 */
export const formatAmountForDisplay = (amount: number, currencyCode: string = 'INR'): string => {
  const currency = CURRENCIES[currencyCode];
  
  if (!currency) {
    return amount.toString();
  }

  // Format with thousand separators
  const parts = amount.toFixed(currency.decimalPlaces).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return parts.join('.');
};

/**
 * Get all available currencies as array
 * @returns Array of currency codes
 */
export const getAvailableCurrencies = (): string[] => {
  return Object.keys(CURRENCIES);
};

/**
 * Get currency options for select dropdown
 * @returns Array of {code, label} objects
 */
export const getCurrencyOptions = (): Array<{ code: string; label: string }> => {
  return Object.entries(CURRENCIES).map(([code, config]) => ({
    code,
    label: `${config.symbol} ${config.name} (${config.country})`
  }));
};

