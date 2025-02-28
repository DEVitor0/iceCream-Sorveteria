import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthCheck from '../../hooks/Authentication/UseAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthCheck();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
