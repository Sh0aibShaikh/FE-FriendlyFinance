import React, { useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuthStore } from '../store/authStore';
import { useTransactionStore } from '../store/transactionStore';
import { useThemeStore } from '../store/themeStore';
import { CATEGORY_COLORS, PAGINATION, CURRENCIES, DEFAULT_CURRENCY } from '../constants';
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Analytics: React.FC = () => {
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const { summary, byCategory, transactions, fetchSummary, fetchByCategory, fetchTransactions, isLoading } = useTransactionStore();

  // Get currency symbol based on user preference
  const getCurrencySymbol = () => {
    const userCurrency = user?.preferredCurrency || DEFAULT_CURRENCY;
    return CURRENCIES[userCurrency]?.symbol || '$';
  };

  const currencySymbol = getCurrencySymbol();

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
      fetchByCategory(user._id);
      fetchTransactions({
        userId: user._id,
        limit: PAGINATION.DEFAULT_LIMIT,
        skip: 0,
        sortBy: 'date',
        sortOrder: -1
      });
    }
  }, [user?._id, fetchSummary, fetchByCategory, fetchTransactions]);

  // Prepare data for pie chart
  const pieData = byCategory ? Object.entries(byCategory).map(([category, data]) => ({
    name: category,
    value: Math.abs(data.total),
    income: data.income,
    expense: data.expense
  })) : [];

  // Prepare data for bar chart
  const barData = byCategory ? Object.entries(byCategory).map(([category, data]) => ({
    category,
    income: data.income,
    expense: data.expense
  })) : [];

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
          <h1 className="section-title dark:text-white">Analytics</h1>
          <p className="section-subtitle dark:text-neutral-400">Visualize your financial data and trends</p>
        </motion.div>

        {/* Summary Stats */}
        {summary && (
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
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{currencySymbol}{summary.totalIncome.toFixed(2)}</p>
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
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{currencySymbol}{summary.totalExpense.toFixed(2)}</p>
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
                  <p className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                    {currencySymbol}{summary.balance.toFixed(2)}
                  </p>
                </div>
                <div className={`w-12 h-12 ${summary.balance >= 0 ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-red-100 dark:bg-red-900/30'} rounded-lg flex items-center justify-center`}>
                  <Wallet className={summary.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'} size={24} />
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
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">vs Last Month</p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold text-neutral-900 dark:text-white">{monthComparison.percentage}%</p>
                    {monthComparison.isIncrease ? (
                      <TrendingUp className="text-red-600 dark:text-red-400" size={24} />
                    ) : (
                      <TrendingDown className="text-green-600 dark:text-green-400" size={24} />
                    )}
                  </div>
                </div>
                <div className={`w-12 h-12 ${monthComparison.isIncrease ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'} rounded-lg flex items-center justify-center`}>
                  {monthComparison.isIncrease ? (
                    <TrendingUp className="text-red-600 dark:text-red-400" size={24} />
                  ) : (
                    <TrendingDown className="text-green-600 dark:text-green-400" size={24} />
                  )}
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-3">
                {monthComparison.isIncrease ? 'Expenses increased' : 'Expenses decreased'}
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          {pieData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-soft dark:shadow-lg border border-neutral-200 dark:border-neutral-800 transition-colors duration-300 hover:shadow-md dark:hover:shadow-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <BarChart3 size={20} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Transactions by Category</h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">Distribution of spending</p>
                </div>
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center h-80">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name }) => `${name}`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={800}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#8884d8'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        color: '#1f2937',
                        padding: '12px'
                      }}
                      formatter={(value: any) => `${currencySymbol}${Number(value).toFixed(2)}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          )}

          {/* Bar Chart */}
          {barData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-soft dark:shadow-lg border border-neutral-200 dark:border-neutral-800 transition-colors duration-300 hover:shadow-md dark:hover:shadow-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center">
                  <BarChart3 size={20} className="text-accent-600 dark:text-accent-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Income vs Expense</h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">Comparison by category</p>
                </div>
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center h-80">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis
                      dataKey="category"
                      stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                      tick={{ fill: isDarkMode ? '#d1d5db' : '#374151', fontSize: 12 }}
                    />
                    <YAxis
                      stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                      tick={{ fill: isDarkMode ? '#d1d5db' : '#374151', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        color: '#1f2937',
                        padding: '12px'
                      }}
                      formatter={(value: any) => `${currencySymbol}${Number(value).toFixed(2)}`}
                      labelStyle={{ color: '#1f2937' }}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} animationDuration={800} />
                    <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} animationDuration={800} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          )}
        </div>

        {/* Empty State */}
        {pieData.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-soft dark:shadow-lg border border-neutral-200 dark:border-neutral-800 text-center py-12 transition-colors duration-300"
          >
            <BarChart3 className="mx-auto text-neutral-300 dark:text-neutral-700 mb-4" size={48} />
            <p className="text-neutral-600 dark:text-neutral-400 font-medium">No data available</p>
            <p className="text-neutral-500 dark:text-neutral-500 text-sm">Create some transactions to see analytics</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

