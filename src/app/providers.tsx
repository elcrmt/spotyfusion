'use client';

/**
 * SpotyFusion - Global Providers
 *
 * This component wraps the entire app with all necessary context providers.
 * Add new providers here as needed (e.g., theme, i18n, etc.)
 */

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {/* 
        TODO: Add more providers as needed:
        - ThemeProvider
        - ToastProvider
        - etc.
      */}
      {children}
    </AuthProvider>
  );
}
