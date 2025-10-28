import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { CATEGORIES, CURRENCIES, DEFAULT_CURRENCY } from '../constants';
import { CreateTransactionRequest, TransactionCategory } from '../types';
import { useAuthStore } from '../store/authStore';

type TransactionType = 'Income' | 'Expense';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<CreateTransactionRequest, 'user'>) => Promise<void>;
  isLoading?: boolean;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<{
    type: TransactionType;
    category: TransactionCategory;
    amount: string;
    description: string;
    date: string;
  }>({
    type: 'Expense',
    category: 'Food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    try {
      await onSubmit({
        type: formData.type,
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: new Date(formData.date).toISOString(),
      });

      // Reset form
      setFormData({
        type: 'Expense',
        category: 'Food',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add transaction');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto"
      >
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg dark:shadow-xl max-w-sm w-full p-3 border border-neutral-200 dark:border-neutral-800 my-auto transition-colors duration-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                <Plus className="text-primary-600 dark:text-primary-400" size={18} />
              </div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white transition-colors duration-300">Add Transaction</h2>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors duration-300 disabled:opacity-50 flex-shrink-0"
            >
              <X size={18} className="text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-300"
            >
              <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-1 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300">Type</label>
              <div className="flex gap-2">
                {(['Income', 'Expense'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type }))}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-sm font-medium transition-all ${
                      formData.type === type
                        ? type === 'Income'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 transition-colors duration-300">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-colors duration-300"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 transition-colors duration-300">Amount ({CURRENCIES[user?.preferredCurrency || DEFAULT_CURRENCY]?.symbol || '$'})</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-colors duration-300"
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 transition-colors duration-300">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-colors duration-300"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 transition-colors duration-300">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Add a note..."
                rows={2}
                className="w-full px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 resize-none transition-colors duration-300"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-sm font-medium rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
              >
                <Plus size={16} />
                <span>{isLoading ? 'Adding...' : 'Add'}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

