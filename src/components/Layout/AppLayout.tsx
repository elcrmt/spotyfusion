'use client';

/**
 * SpotyFusion - App Layout Component
 *
 * The main layout for authenticated pages.
 * Includes sidebar navigation and main content area.
 *
 * @module components/Layout/AppLayout
 */

import { ReactNode } from 'react';
import { Sidebar } from '../Navigation/Sidebar';

// ================================
// Types
// ================================

interface AppLayoutProps {
  /** Page content */
  children: ReactNode;
}

// ================================
// Component
// ================================

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
