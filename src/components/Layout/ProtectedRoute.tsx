'use client';

/**
 * SpotyFusion - Protected Route Component
 *
 * A wrapper component that redirects unauthenticated users to the login page.
 * Use this to wrap pages that require authentication.
 *
 * TODO: Implement proper authentication check with Spotify tokens
 *
 * @module components/Layout/ProtectedRoute
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '../Common/Spinner';

// ================================
// Types
// ================================

interface ProtectedRouteProps {
  /** Page content to render if authenticated */
  children: React.ReactNode;
}

// ================================
// Component
// ================================

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth state to load before redirecting
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto" />
          <p className="mt-4 text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - will redirect
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto" />
          <p className="mt-4 text-gray-400">Redirection...</p>
        </div>
      </div>
    );
  }

  // Authenticated - render children
  return <>{children}</>;
}

export default ProtectedRoute;
