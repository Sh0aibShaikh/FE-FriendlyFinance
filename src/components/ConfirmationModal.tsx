import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className={`bg-white dark:bg-neutral-900 rounded-xl shadow-lg dark:shadow-xl max-w-md w-full p-6 transition-colors duration-300 ${
          isDangerous ? 'border-2 border-red-200 dark:border-red-800' : 'border border-neutral-200 dark:border-neutral-800'
        }`}>
          {/* Icon */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
            isDangerous
              ? 'bg-red-100 dark:bg-red-900/30'
              : 'bg-primary-100 dark:bg-primary-900/30'
          }`}>
            {isDangerous ? (
              <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
            ) : (
              <Check className="text-primary-600 dark:text-primary-400" size={24} />
            )}
          </div>

          {/* Title */}
          <h2 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
            isDangerous ? 'text-red-900 dark:text-red-300' : 'text-neutral-900 dark:text-white'
          }`}>
            {title}
          </h2>

          {/* Message */}
          <p className={`text-sm mb-6 transition-colors duration-300 ${
            isDangerous ? 'text-red-700 dark:text-red-300' : 'text-neutral-600 dark:text-neutral-400'
          }`}>
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-medium rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <X size={18} />
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600'
                  : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600'
              }`}
            >
              <Check size={18} />
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

