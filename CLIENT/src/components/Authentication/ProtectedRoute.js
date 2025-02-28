import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/Authentication/UseAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Deve usar o hook corrigido

  if (loading) {
    return <div>Carregando...</div>; // Melhor que retornar null
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
