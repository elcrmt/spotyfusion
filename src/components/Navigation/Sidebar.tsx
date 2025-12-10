'use client';

/**
 * SpotyFusion - Sidebar Navigation Component
 *
 * The main sidebar navigation for the authenticated app layout.
 *
 * @module components/Navigation/Sidebar
 */

import Link from 'next/link';
import { NavLink } from './NavLink';
import { UserBadge } from '../User/UserBadge';

// ================================
// Navigation Items
// ================================

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
  },
  {
    href: '/blind-test',
    label: 'Blind Test',
    icon: '🎵',
  },
  {
    href: '/mood-generator',
    label: 'Mood Generator',
    icon: '🎨',
  },
];

// ================================
// Component
// ================================

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col bg-black p-4">
      {/* Logo */}
      <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
        <span className="text-2xl">🎧</span>
        <span className="text-xl font-bold text-white">SpotyFusion</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.href} href={item.href} icon={item.icon}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Badge at bottom */}
      <div className="mt-auto border-t border-zinc-800 pt-4">
        <UserBadge />
      </div>
    </aside>
  );
}

export default Sidebar;
