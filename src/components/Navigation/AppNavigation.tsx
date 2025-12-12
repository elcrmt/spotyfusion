'use client';

// Navigation principale avec profil utilisateur Spotify (A2 + A3)

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BarChart3, Music, Palette, Headphones, Star, LogOut } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/blind-test', label: 'Blind Test', icon: Music },
  { href: '/mood-generator', label: 'Mood Playlist', icon: Palette },
];

export function AppNavigation() {
  const pathname = usePathname();
  const { user, isLoadingUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Label pour le type d'abonnement (A3)
  const getProductLabel = () => {
    if (!user?.product) return 'Spotify';
    if (user.product === 'premium') return 'Premium';
    return 'Free';
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-zinc-900 border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Headphones className="w-6 h-6 text-green-500" />
          <h1 className="text-lg font-bold text-white">SpotyFusion</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2 hover:bg-zinc-800 rounded-lg"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 flex flex-col bg-zinc-900 border-r border-zinc-800 z-40 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo - Desktop only */}
        <div className="hidden lg:flex items-center gap-3 p-6 border-b border-zinc-800">
          <Headphones className="w-8 h-8 text-green-500" />
          <h1 className="text-xl font-bold text-white">SpotyFusion</h1>
        </div>

        {/* Mobile Header in Sidebar */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Headphones className="w-6 h-6 text-green-500" />
            <h1 className="text-lg font-bold text-white">SpotyFusion</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white p-2 hover:bg-zinc-800 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-500/20 text-green-400'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        </nav>

        {/* User Section (A3) */}
        <div className="border-t border-zinc-800 p-4">
        <div className="flex items-center gap-3 rounded-lg p-3 bg-zinc-800/50">
          {/* Avatar (A3) */}
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-zinc-700">
            {isLoadingUser ? (
              <div className="h-full w-full animate-pulse bg-zinc-600" />
            ) : user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.displayName || 'Avatar'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-medium text-zinc-400">
                {user?.displayName?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>

          {/* User Info (A3) */}
          <div className="flex-1 min-w-0">
            {isLoadingUser ? (
              <>
                <div className="h-4 w-24 animate-pulse rounded bg-zinc-700 mb-1" />
                <div className="h-3 w-16 animate-pulse rounded bg-zinc-700" />
              </>
            ) : (
              <>
                <p className="truncate text-sm font-medium text-white">
                  {user?.displayName || 'Utilisateur'}
                </p>
                <p className="truncate text-xs text-zinc-400 flex items-center gap-1">
                  {user?.product === 'premium' && <Star className="w-3 h-3" />}
                  {getProductLabel()}
                </p>
              </>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}

export default AppNavigation;
