import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/Authentication/UseAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/authentication/login" replace />
  );
};

export default ProtectedRoute;
