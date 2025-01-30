import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, redirectTo = "/" }) => {
  const isAuthenticated = authService.isAuthenticated();

  // Instead of checking auth state, just redirect to landing
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
