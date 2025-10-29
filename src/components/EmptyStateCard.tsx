import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, TrendingUp, Wallet, ArrowRight } from 'lucide-react';

interface EmptyStateCardProps {
  onAddTransaction?: () => void;
}

export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({ onAddTransaction }) => {
  const navigate = useNavigate();

  const handleAddFirstTransaction = () => {
    if (onAddTransaction) {
      onAddTransaction();
    } else {
      // Navigate to transactions page
      navigate('/transactions', { state: { openAddModal: true } });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft dark:shadow-xl p-12 text-center max-w-2xl mx-auto mt-8 border border-neutral-200 dark:border-neutral-800"
    >
      {/* Animated Icon Group */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <div className="relative inline-flex items-center justify-center">
          {/* Main Icon Container */}
          <div className="w-28 h-28 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center shadow-lg">
            <Wallet className="w-14 h-14 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
          </div>
          
          {/* Floating Icons */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-2 -right-2 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shadow-md"
          >
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" strokeWidth={2} />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -bottom-2 -left-2 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shadow-md"
          >
            <PlusCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" strokeWidth={2} />
          </motion.div>
        </div>
      </motion.div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4"
      >
        Ready to Take Control of Your Finances?
      </motion.h2>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-3"
      >
        You haven't added any transactions yet.
      </motion.p>

      {/* Body Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-base text-neutral-600 dark:text-neutral-400 mb-10 max-w-md mx-auto leading-relaxed"
      >
        Start tracking your income and expenses to see your financial story come to life!
      </motion.p>

      {/* Primary CTA Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddFirstTransaction}
        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6 group"
      >
        <PlusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
        Add Your First Transaction
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={2.5} />
      </motion.button>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex items-center justify-center my-6"
      >
        <div className="border-t border-neutral-300 dark:border-neutral-700 flex-grow max-w-xs"></div>
        <span className="px-4 text-sm text-neutral-400 dark:text-neutral-500 font-medium">or</span>
        <div className="border-t border-neutral-300 dark:border-neutral-700 flex-grow max-w-xs"></div>
      </motion.div>

      {/* Secondary Info/Tips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left"
      >
        <div className="flex items-start space-x-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">1</span>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-1">Add Transactions</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Track your income and expenses</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">2</span>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-1">View Analytics</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">See spending patterns</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-green-600 dark:text-green-400 font-bold text-sm">3</span>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-1">Take Control</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Make informed decisions</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

