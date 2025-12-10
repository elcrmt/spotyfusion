'use client';

// Providers globaux pour toute l'application

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { BlindTestProvider } from '@/context/BlindTestContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <BlindTestProvider>{children}</BlindTestProvider>
    </AuthProvider>
  );
}
