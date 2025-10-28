import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { CURRENCIES, DEFAULT_CURRENCY } from '../constants';
import { getCurrencyOptions } from '../utils/currency';

interface CurrencySettingsProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => Promise<void>;
  isLoading?: boolean;
}

export const CurrencySettings: React.FC<CurrencySettingsProps> = ({
  selectedCurrency,
  onCurrencyChange,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localCurrency, setLocalCurrency] = useState(selectedCurrency || DEFAULT_CURRENCY);
  const [isSaving, setIsSaving] = useState(false);

  const currentCurrency = CURRENCIES[localCurrency] || CURRENCIES[DEFAULT_CURRENCY];
  const currencyOptions = getCurrencyOptions();

  const handleCurrencySelect = async (currency: string) => {
    setLocalCurrency(currency);
    setIsSaving(true);
    try {
      await onCurrencyChange(currency);
      setIsOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
            <Globe className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white transition-colors duration-300">Currency Preference</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 transition-colors duration-300">Choose your preferred currency for transactions</p>
          </div>
        </div>

        {/* Current Selection */}
        <div className="mb-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors duration-300">
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1 transition-colors duration-300">Current Currency</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white transition-colors duration-300">
                {currentCurrency.symbol} {currentCurrency.code}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
                {currentCurrency.name} • {currentCurrency.country}
              </p>
            </div>
            <div className="text-2xl">{currentCurrency.symbol}</div>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={isLoading || isSaving}
            className="w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-medium rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
          >
            <span>Change Currency</span>
            <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg dark:shadow-xl z-10 max-h-64 overflow-y-auto transition-colors duration-300"
            >
              {currencyOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => handleCurrencySelect(option.code)}
                  disabled={isSaving}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors duration-300 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 ${
                    localCurrency === option.code
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-l-4 border-primary-600 dark:border-primary-400'
                      : 'border-l-4 border-transparent'
                  }`}
                >
                  <span className="dark:text-white">{option.label}</span>
                  {localCurrency === option.code && (
                    <Check size={18} className="text-primary-600 dark:text-primary-400" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Info */}
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-3 transition-colors duration-300">
          💡 Your selected currency will be used for all new transactions and displayed throughout the app.
        </p>
      </div>
    </div>
  );
};

