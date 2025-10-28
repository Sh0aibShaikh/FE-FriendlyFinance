import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { CURRENCIES, DEFAULT_CURRENCY } from '../constants';
import { formatAmountForDisplay, getCurrencySymbol } from '../utils/currency';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  showLabel?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  currency,
  onCurrencyChange,
  placeholder = '0.00',
  disabled = false,
  label = 'Amount',
  error,
  showLabel = true,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const currencyConfig = CURRENCIES[currency] || CURRENCIES[DEFAULT_CURRENCY];
  const currencySymbol = getCurrencySymbol(currency);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Allow only numbers and decimal point
    inputValue = inputValue.replace(/[^\d.]/g, '');

    // Prevent multiple decimal points
    const parts = inputValue.split('.');
    if (parts.length > 2) {
      inputValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit decimal places
    if (parts[1] && parts[1].length > currencyConfig.decimalPlaces) {
      inputValue = parts[0] + '.' + parts[1].slice(0, currencyConfig.decimalPlaces);
    }

    setDisplayValue(inputValue);
    onChange(inputValue);
  };

  const handleBlur = () => {
    if (displayValue && !isNaN(parseFloat(displayValue))) {
      const formatted = formatAmountForDisplay(parseFloat(displayValue), currency);
      setDisplayValue(formatted);
    }
  };

  const handleFocus = () => {
    // Remove formatting on focus for easier editing
    setDisplayValue(value);
  };

  return (
    <div className="w-full">
      {showLabel && label && (
        <label className="block text-xs font-semibold text-neutral-700 mb-1">
          {label}
        </label>
      )}

      <div className="flex gap-2">
        {/* Currency Selector */}
        <div className="relative flex-shrink-0">
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            disabled={disabled}
            className="appearance-none px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white pr-8"
            title="Select Currency"
          >
            {Object.entries(CURRENCIES).map(([code, config]) => (
              <option key={code} value={code}>
                {config.symbol} {code}
              </option>
            ))}
          </select>
          <Globe
            size={14}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-500 pointer-events-none"
          />
        </div>

        {/* Amount Input */}
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 font-medium text-sm pointer-events-none">
            {currencySymbol}
          </div>
          <input
            type="text"
            value={displayValue}
            onChange={handleAmountChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full pl-8 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              error
                ? 'border-red-300 focus:ring-red-500'
                : 'border-neutral-300'
            }`}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}

      {/* Currency Info */}
      <p className="text-xs text-neutral-500 mt-1">
        {currencyConfig.name} • {currencyConfig.country}
      </p>
    </div>
  );
};

