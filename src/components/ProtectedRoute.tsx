import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LocalStorageKeys } from '../constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, token, initializeAuth } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Initialize auth from localStorage on mount
    initializeAuth();
    setIsInitializing(false);
  }, [initializeAuth]);

  // While initializing, check localStorage directly to prevent logout on refresh
  if (isInitializing) {
    const storedToken = localStorage.getItem(LocalStorageKeys.AUTH_TOKEN);
    if (!storedToken) {
      return <Navigate to="/login" replace />;
    }
    // Token exists, allow rendering while initializing
    return <>{children}</>;
  }

  // After initialization, check store state
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

