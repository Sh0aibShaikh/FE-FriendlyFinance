import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTransactionStore } from '../store/transactionStore';
import { CATEGORIES, PAGINATION, CURRENCIES, DEFAULT_CURRENCY } from '../constants';
import { TransactionFilters, CreateTransactionRequest, Transaction } from '../types';
import { ChevronLeft, ChevronRight, Filter, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { transactionService } from '../api/services/transactionService';

export const Transactions: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { transactions, pagination, fetchTransactions, isLoading } = useTransactionStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [filters, setFilters] = useState<Partial<TransactionFilters>>({
    type: undefined,
    category: undefined,
    startDate: undefined,
    endDate: undefined,
    sortBy: 'date',
    sortOrder: -1
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Delete transaction state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isDeletingTransaction, setIsDeletingTransaction] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Get currency symbol based on user preference
  const getCurrencySymbol = () => {
    const userCurrency = user?.preferredCurrency || DEFAULT_CURRENCY;
    return CURRENCIES[userCurrency]?.symbol || '$';
  };

  const currencySymbol = getCurrencySymbol();

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return !!(filters.type || selectedCategories.length > 0 || filters.startDate || filters.endDate);
  }, [filters, selectedCategories]);

  // Filter transactions based on selected categories
  const filteredTransactions = useMemo(() => {
    if (selectedCategories.length === 0) {
      return transactions;
    }
    return transactions.filter(tx => selectedCategories.includes(tx.category));
  }, [transactions, selectedCategories]);

  // Check if we should open the add modal automatically (from empty state navigation)
  useEffect(() => {
    const state = location.state as { openAddModal?: boolean } | null;
    if (state?.openAddModal) {
      setShowAddModal(true);
      // Clear the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (user?._id) {
      fetchTransactions({
        userId: user._id,
        limit: PAGINATION.DEFAULT_LIMIT,
        skip: 0,
        ...filters
      } as TransactionFilters);
    }
  }, [user?._id, fetchTransactions]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value || undefined
    };
    setFilters(newFilters);

    if (user?._id) {
      fetchTransactions({
        userId: user._id,
        limit: PAGINATION.DEFAULT_LIMIT,
        skip: 0,
        ...newFilters
      } as TransactionFilters);
    }
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newCategories);

    // Don't send category to backend - we'll filter on frontend
    const newFilters: Partial<TransactionFilters> = {
      ...filters,
      category: undefined
    };
    setFilters(newFilters);

    if (user?._id) {
      fetchTransactions({
        userId: user._id,
        limit: PAGINATION.DEFAULT_LIMIT,
        skip: 0,
        ...newFilters
      } as TransactionFilters);
    }
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }

    const newFilters = {
      ...filters,
      startDate: type === 'start' ? value || undefined : startDate || undefined,
      endDate: type === 'end' ? value || undefined : endDate || undefined
    };
    setFilters(newFilters);

    if (user?._id) {
      fetchTransactions({
        userId: user._id,
        limit: PAGINATION.DEFAULT_LIMIT,
        skip: 0,
        ...newFilters
      } as TransactionFilters);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      type: undefined,
      category: undefined,
      startDate: undefined,
      endDate: undefined,
      sortBy: 'date',
      sortOrder: -1
    });
    setSelectedCategories([]);
    setStartDate('');
    setEndDate('');

    if (user?._id) {
      fetchTransactions({
        userId: user._id,
        limit: PAGINATION.DEFAULT_LIMIT,
        skip: 0,
        sortBy: 'date',
        sortOrder: -1
      } as TransactionFilters);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (user?._id) {
      const skip = (newPage - 1) * PAGINATION.DEFAULT_LIMIT;
      fetchTransactions({
        userId: user._id,
        limit: PAGINATION.DEFAULT_LIMIT,
        skip,
        ...filters
      } as TransactionFilters);
    }
  };

  const handleAddTransaction = async (transactionData: Omit<CreateTransactionRequest, 'user'>) => {
    if (!user?._id) return;

    setIsAddingTransaction(true);
    try {
      await transactionService.create({
        ...transactionData,
        user: user._id
      });

      // Refresh transactions
      fetchTransactions({
        userId: user._id,
        limit: PAGINATION.DEFAULT_LIMIT,
        skip: 0,
        ...filters
      } as TransactionFilters);
    } finally {
      setIsAddingTransaction(false);
    }
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete || !user?._id) return;

    setIsDeletingTransaction(true);
    setDeleteError(null);

    try {
      await transactionService.delete(transactionToDelete._id);

      // Close modal
      setShowDeleteModal(false);
      setTransactionToDelete(null);

      // Refresh transactions to update the list
      fetchTransactions({
        userId: user._id,
        limit: PAGINATION.DEFAULT_LIMIT,
        skip: 0,
        ...filters
      } as TransactionFilters);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to delete transaction';
      setDeleteError(errorMessage);
    } finally {
      setIsDeletingTransaction(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTransactionToDelete(null);
    setDeleteError(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="section-title dark:text-white">Transactions</h1>
            <p className="section-subtitle dark:text-neutral-400">Manage and view all your financial transactions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-soft dark:shadow-lg border border-neutral-200 dark:border-neutral-800 mb-6 transition-colors duration-300"
        >
          <div className="flex items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Filters</h2>
              {hasActiveFilters && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                  Active
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-sm px-3 py-1 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Type Filter */}
            <div>
              <label className="label dark:text-neutral-300">Type</label>
              <select
                name="type"
                value={filters.type || ''}
                onChange={handleFilterChange}
                className="input-field dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>

            {/* Date Range - From */}
            <div>
              <label className="label dark:text-neutral-300">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="input-field dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              />
            </div>

            {/* Date Range - To */}
            <div>
              <label className="label dark:text-neutral-300">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="input-field dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="label dark:text-neutral-300">Sort By</label>
              <select
                name="sortBy"
                value={filters.sortBy || 'date'}
                onChange={handleFilterChange}
                className="input-field dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="label dark:text-neutral-300">Order</label>
              <select
                name="sortOrder"
                value={filters.sortOrder || -1}
                onChange={handleFilterChange}
                className="input-field dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              >
                <option value="-1">Newest First</option>
                <option value="1">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Category Checkboxes */}
          <div>
            <label className="label dark:text-neutral-300 mb-3 block">Categories</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-primary-600 dark:text-primary-400"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-soft dark:shadow-lg border border-neutral-200 dark:border-neutral-800 transition-colors duration-300"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="mx-auto text-neutral-300 dark:text-neutral-700 mb-4" size={48} />
              <p className="text-neutral-600 dark:text-neutral-400 font-medium">No transactions found</p>
              <p className="text-neutral-500 dark:text-neutral-500 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800">
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300 hidden sm:table-cell">Description</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Type</th>
                      <th className="text-right py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Amount</th>
                      <th className="text-center py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx._id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-700 dark:text-neutral-300 font-medium whitespace-nowrap">{tx.category}</td>
                        <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400 hidden sm:table-cell">{tx.description || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`badge ${tx.type === 'Income' ? 'badge-success' : 'badge-error'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-right font-semibold whitespace-nowrap ${tx.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {tx.type === 'Income' ? '+' : '-'}{currencySymbol}{tx.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteClick(tx)}
                            className="inline-flex items-center justify-center p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                            title="Delete transaction"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn-secondary flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="btn-secondary flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </>
          )}
        </motion.div>

        {/* Add Transaction Modal */}
        <AddTransactionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTransaction}
          isLoading={isAddingTransaction}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          title="Delete Transaction"
          message={
            transactionToDelete
              ? `Are you sure you want to delete this ${transactionToDelete.type.toLowerCase()} transaction of ${currencySymbol}${transactionToDelete.amount.toFixed(2)} in ${transactionToDelete.category}? This action cannot be undone.`
              : 'Are you sure you want to delete this transaction?'
          }
          confirmText={isDeletingTransaction ? 'Deleting...' : 'Delete'}
          cancelText="Cancel"
          isDangerous={true}
          isLoading={isDeletingTransaction}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />

        {/* Delete Error Message */}
        {deleteError && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-red-600 dark:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            <p className="font-medium">{deleteError}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

