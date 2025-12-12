'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BarChart3, Music, ListMusic, Menu, X, LogOut } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Statistiques', icon: BarChart3 },
  { href: '/blind-test', label: 'Blind Test', icon: Music },
  { href: '/mood-generator', label: 'Générateur de Playlists', icon: ListMusic },
];

export function AppNavigation() {
  const pathname = usePathname();
  const { user, isLoadingUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-[#121212] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-black" />
          </div>
          <span className="text-lg font-bold text-white">SpotyFusion</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2 hover:bg-white/10 rounded-lg"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-2 left-2 bottom-2 h-[calc(100vh-16px)] w-[220px] flex flex-col bg-[#121212] rounded-lg z-40 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white">SpotyFusion</span>
        </div>

        {/* User Profile Section - Figma Style avec bordures */}
        <div className="px-3 mb-4 border-t border-b border-[#282828] py-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a]">
            {/* Avatar */}
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-[#282828]">
              {isLoadingUser ? (
                <div className="h-full w-full animate-pulse bg-[#333]" />
              ) : user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.displayName || 'Avatar'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-medium text-gray-400">
                  {user?.displayName?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              {isLoadingUser ? (
                <>
                  <div className="h-4 w-20 animate-pulse rounded bg-[#333] mb-1" />
                  <div className="h-3 w-14 animate-pulse rounded bg-[#333]" />
                </>
              ) : (
                <>
                  <p className="truncate text-sm font-medium text-white">
                    {user?.displayName || 'Utilisateur'}
                  </p>
                  {user?.product === 'premium' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-green-500 text-black mt-0.5">
                      Premium
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                        ? 'bg-[#1a1a1a] text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500 before:rounded-l-md'
                        : 'text-[#b3b3b3] hover:text-white'
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-green-500' : ''}`} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button - Rouge avec icône */}
        <div className="px-3 py-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}

export default AppNavigation;
