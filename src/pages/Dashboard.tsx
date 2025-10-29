import React, { useEffect, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { useTransactionStore } from '../store/transactionStore';
import { PAGINATION, CURRENCIES, DEFAULT_CURRENCY } from '../constants';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { EmptyStateCard } from '../components/EmptyStateCard';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { summary, transactions, fetchSummary, fetchTransactions, isLoading } = useTransactionStore();

  // Get currency symbol based on user preference
  const getCurrencySymbol = () => {
    const userCurrency = user?.preferredCurrency || DEFAULT_CURRENCY;
    return CURRENCIES[userCurrency]?.symbol || '$';
  };

  const currencySymbol = getCurrencySymbol();

  // Empty state detection - check if user has no transactions
  const isEmptyState = useMemo(() => {
    return (
      !isLoading &&
      summary &&
      (summary.totalIncome ?? 0) === 0 &&
      (summary.totalExpense ?? 0) === 0 &&
      transactions.length === 0
    );
  }, [isLoading, summary, transactions]);

  // Calculate month-over-month comparison
  const monthComparison = useMemo(() => {
    if (!transactions || transactions.length === 0) return { percentage: 0, isIncrease: false };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthExpenses = transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return tx.type === 'Expense' && txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    const lastMonthExpenses = transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return tx.type === 'Expense' && txDate.getMonth() === lastMonth && txDate.getFullYear() === lastMonthYear;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    if (lastMonthExpenses === 0) {
      return { percentage: currentMonthExpenses > 0 ? 100 : 0, isIncrease: currentMonthExpenses > 0 };
    }

    const percentage = Math.round(((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100);
    return { percentage: Math.abs(percentage), isIncrease: percentage > 0 };
  }, [transactions]);

  useEffect(() => {
    if (user?._id) {
      fetchSummary(user._id);
      fetchTransactions({
        userId: user._id,
        limit: PAGINATION.DEFAULT_LIMIT,
        skip: 0,
        sortBy: 'date',
        sortOrder: -1
      });
    }
  }, [user?._id, fetchSummary, fetchTransactions]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="section-title dark:text-white">Dashboard</h1>
          <p className="section-subtitle dark:text-neutral-400">Welcome back, {user?.username}! Here's your financial overview.</p>
        </motion.div>

        {/* Show Empty State or Dashboard Content */}
        {isEmptyState ? (
          <EmptyStateCard />
        ) : (
          <>
            {/* Summary Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
            {/* Income Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-soft dark:shadow-lg hover:shadow-md dark:hover:shadow-xl transition-all duration-300 hover:scale-105 border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Total Income</p>
                  {isLoading ? (
                    <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-32 mb-2"></div>
                  ) : (
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{currencySymbol}{summary?.totalIncome?.toFixed(2) || '0.00'}</p>
                  )}
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">All time</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
                </div>
              </div>
            </motion.div>

            {/* Expense Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-soft dark:shadow-lg hover:shadow-md dark:hover:shadow-xl transition-all duration-300 hover:scale-105 border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Total Expenses</p>
                  {isLoading ? (
                    <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-32 mb-2"></div>
                  ) : (
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{currencySymbol}{summary?.totalExpense?.toFixed(2) || '0.00'}</p>
                  )}
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">All time</p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <TrendingDown className="text-red-600 dark:text-red-400" size={24} />
                </div>
              </div>
            </motion.div>

            {/* Balance Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-soft dark:shadow-lg hover:shadow-md dark:hover:shadow-xl transition-all duration-300 hover:scale-105 border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Net Balance</p>
                  {isLoading ? (
                    <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-32 mb-2"></div>
                  ) : (
                    <p className={`text-3xl font-bold ${(summary?.balance ?? 0) >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                      {currencySymbol}{(summary?.balance ?? 0).toFixed(2)}
                    </p>
                  )}
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">Income - Expenses</p>
                </div>
                <div className={`w-12 h-12 ${(summary?.balance ?? 0) >= 0 ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-red-100 dark:bg-red-900/30'} rounded-lg flex items-center justify-center`}>
                  <Wallet className={(summary?.balance ?? 0) >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'} size={24} />
                </div>
              </div>
            </motion.div>

            {/* This Month's Summary Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-soft dark:shadow-lg hover:shadow-md dark:hover:shadow-xl transition-all duration-300 hover:scale-105 border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">This Month</p>
                  {isLoading ? (
                    <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-32 mb-2"></div>
                  ) : (
                    <p className="text-3xl font-bold text-neutral-700 dark:text-neutral-300">{monthComparison.percentage}%</p>
                  )}
                  <p className={`text-xs mt-2 flex items-center gap-1 ${monthComparison.isIncrease ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {monthComparison.isIncrease ? '↑' : '↓'} vs last month
                  </p>
                </div>
                <div className={`w-12 h-12 ${monthComparison.isIncrease ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'} rounded-lg flex items-center justify-center`}>
                  {monthComparison.isIncrease ? (
                    <TrendingUp className="text-red-600 dark:text-red-400" size={24} />
                  ) : (
                    <TrendingDown className="text-green-600 dark:text-green-400" size={24} />
                  )}
                </div>
              </div>
            </motion.div>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-soft dark:shadow-lg border border-neutral-200 dark:border-neutral-800 transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Recent Transactions</h2>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="mx-auto text-neutral-300 dark:text-neutral-700 mb-4" size={48} />
                  <p className="text-neutral-600 dark:text-neutral-400 font-medium">No transactions yet</p>
                  <p className="text-neutral-500 dark:text-neutral-500 text-sm">Create one to get started!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800">
                        <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Category</th>
                        <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300 hidden sm:table-cell">Description</th>
                        <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Type</th>
                        <th className="text-right py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

