'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AppNavigation } from '@/components/Navigation/AppNavigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-green-500" />
          <p className="text-zinc-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black p-2">
      <AppNavigation />
      {/* Zone de contenu principal avec fond gris et gap */}
      <main className="lg:ml-[220px] min-h-screen bg-[#121212] rounded-lg p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 lg:ml-[228px]">
        {children}
      </main>
    </div>
  );
}
