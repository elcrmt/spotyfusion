'use client';

/**
 * SpotyFusion - Dashboard Page
 *
 * Protected page that displays user's Spotify stats.
 * Redirects to / if not authenticated.
 *
 * TODO: US-B - Implement full dashboard with stats
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Common/Button';
import { Spinner } from '@/components/Common/Spinner';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not authenticated, will redirect
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">
          🎉 Bienvenue sur SpotyFusion !
        </h1>
        <p className="mb-8 text-gray-400">
          Vous êtes connecté avec succès.
        </p>

        {/* TODO: US-B - Add dashboard content here */}
        <div className="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-gray-500">
            📊 Le dashboard sera implémenté dans une prochaine US.
          </p>
        </div>

        <Button variant="outline" onClick={logout}>
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
