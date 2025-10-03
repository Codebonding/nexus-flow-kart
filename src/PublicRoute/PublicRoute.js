import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;