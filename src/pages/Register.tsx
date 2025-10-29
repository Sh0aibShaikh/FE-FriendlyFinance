import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { RegisterRequest } from '../types';
import { User, Mail, Lock, UserPlus, Globe, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { CURRENCIES, DEFAULT_CURRENCY, CURRENCY_CODES } from '../constants';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    preferredCurrency: DEFAULT_CURRENCY
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error for this field
    setValidationErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  const validateForm = (): boolean => {
    const errors: { username?: string; email?: string; password?: string } = {};

    // Username validation
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    // Email validation - ONLY @gmail.com allowed
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!formData.email.endsWith('@gmail.com')) {
      errors.email = 'Only @gmail.com email addresses are allowed';
    } else if (!/^[^\s@]+@gmail\.com$/.test(formData.email)) {
      errors.email = 'Please enter a valid @gmail.com email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearError();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      // Error is handled by the store
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center px-4 py-12 transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-200 dark:bg-primary-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent-200 dark:bg-accent-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 shadow-soft dark:shadow-lg border border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-glow">
              💰
            </div>
            <h1 className="section-title dark:text-white">Friendly Finance</h1>
            <p className="section-subtitle dark:text-neutral-400">Create your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 transition-colors duration-300"
            >
              <div className="w-5 h-5 bg-red-500 dark:bg-red-400 rounded-full flex-shrink-0 mt-0.5"></div>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="label dark:text-neutral-300">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-neutral-400 dark:text-neutral-600" size={20} />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  disabled={isLoading}
                  className={`input-field pl-12 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 ${
                    validationErrors.username ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                />
              </div>
              {validationErrors.username ? (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{validationErrors.username}</p>
              ) : (
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">At least 3 characters</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="label dark:text-neutral-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-neutral-400 dark:text-neutral-600" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@gmail.com"
                  disabled={isLoading}
                  className={`input-field pl-12 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 ${
                    validationErrors.email ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                />
              </div>
              {validationErrors.email ? (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{validationErrors.email}</p>
              ) : (
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">Only @gmail.com addresses allowed</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="label dark:text-neutral-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-neutral-400 dark:text-neutral-600" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={`input-field pl-12 pr-12 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 ${
                    validationErrors.password ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {validationErrors.password ? (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{validationErrors.password}</p>
              ) : (
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">At least 6 characters</p>
              )}
            </div>

            {/* Currency Field */}
            <div>
              <label htmlFor="preferredCurrency" className="label dark:text-neutral-300">Preferred Currency</label>
              <div className="relative">
                <Globe className="absolute left-4 top-3.5 text-neutral-400 dark:text-neutral-600" size={20} />
                <select
                  id="preferredCurrency"
                  name="preferredCurrency"
                  value={formData.preferredCurrency || DEFAULT_CURRENCY}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="input-field pl-12 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500"
                >
                  {CURRENCY_CODES.map(code => (
                    <option key={code} value={code}>
                      {CURRENCIES[code]?.symbol} {code} - {CURRENCIES[code]?.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">Choose your preferred currency</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
            >
              <UserPlus size={20} />
              <span>{isLoading ? 'Creating account...' : 'Create Account'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-6 dark:border-neutral-700"></div>

          {/* Login Link */}
          <p className="text-center text-neutral-600 dark:text-neutral-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-500 mt-6">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
};

