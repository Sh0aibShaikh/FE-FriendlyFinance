import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { userService } from '../api/services/userService';
import { UpdateUserRequest } from '../types';
import { User, Mail, Lock, Edit2, Save, X, Trash2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { CurrencySettings } from '../components/CurrencySettings';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<UpdateUserRequest>({
    username: user?.username || '',
    email: user?.email || '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (!user?._id) throw new Error('User ID not found');
      
      const updateData: UpdateUserRequest = {
        username: formData.username,
        email: formData.email
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      await userService.updateProfile(user._id, updateData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccountClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      if (!user?._id) throw new Error('User ID not found');
      await userService.deleteAccount(user._id);
      logout();
      navigate('/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete account';
      setError(errorMessage);
      setShowDeleteConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="section-title dark:text-white">Profile</h1>
          <p className="section-subtitle dark:text-neutral-400">Manage your account settings</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 transition-colors duration-300"
          >
            <AlertTriangle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3 transition-colors duration-300"
          >
            <div className="w-5 h-5 bg-green-500 dark:bg-green-400 rounded-full flex-shrink-0 mt-0.5"></div>
            <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-soft dark:shadow-lg border border-neutral-200 dark:border-neutral-800 mb-6 transition-colors duration-300"
        >
          {!isEditing ? (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{user?.username}</h2>
                  <p className="text-neutral-600 dark:text-neutral-400">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</p>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="space-y-4">
                {/* Username Field */}
                <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg transition-colors duration-300">
                  <User className="text-primary-600 dark:text-primary-400 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Username</p>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-white">{user?.username}</p>
                  </div>
                </div>

                {/* Email Field */}
                <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg transition-colors duration-300">
                  <Mail className="text-primary-600 dark:text-primary-400 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Email</p>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-white">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Edit Profile</h3>

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
                    disabled={isLoading}
                    className="input-field pl-12 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="label dark:text-neutral-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-neutral-400 dark:text-neutral-600" size={20} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="input-field pl-12 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="label dark:text-neutral-300">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-neutral-400 dark:text-neutral-600" size={20} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="Leave blank to keep current"
                    className="input-field pl-12 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500"
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">Leave blank to keep your current password</p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Currency Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <CurrencySettings
            selectedCurrency={user?.preferredCurrency || 'INR'}
            onCurrencyChange={async (currency) => {
              if (!user?._id) return;
              try {
                await userService.updateCurrency(user._id, currency);
                // Update user in store and localStorage
                const updatedUser = { ...user, preferredCurrency: currency };
                useAuthStore.setState({ user: updatedUser });
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setSuccess('Currency preference updated successfully');
                setTimeout(() => setSuccess(null), 3000);
              } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to update currency');
                setTimeout(() => setError(null), 3000);
              }
            }}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 bg-red-50 dark:bg-red-900/20 rounded-xl p-6 shadow-soft dark:shadow-lg border-2 border-red-200 dark:border-red-800 transition-colors duration-300"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                Deleting your account is permanent and cannot be undone. All your data will be lost.
              </p>
              <button
                onClick={handleDeleteAccountClick}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete Account
              </button>
            </div>
          </div>
        </motion.div>

        {/* Delete Account Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently lost."
          confirmText="Delete Account"
          cancelText="Cancel"
          isDangerous={true}
          isLoading={isLoading}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </div>
    </div>
  );
};

