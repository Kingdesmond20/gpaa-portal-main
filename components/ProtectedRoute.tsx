import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';
import PageSkeleton from './PageSkeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Restrict to a single role. Omit to allow any authenticated user. */
  role?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { session, profile, loading } = useAuth();

  if (loading) return <PageSkeleton />;
  if (!session) return <Navigate to="/login" replace />;
  if (role && profile?.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
