'use client';

/**
 * SpotyFusion - NavLink Component
 *
 * A navigation link that shows active state based on current route.
 *
 * @module components/Navigation/NavLink
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

// ================================
// Types
// ================================

interface NavLinkProps {
  /** Link destination */
  href: string;
  /** Link content */
  children: ReactNode;
  /** Optional icon */
  icon?: ReactNode;
  /** Whether to match exactly or start with */
  exact?: boolean;
}

// ================================
// Component
// ================================

export function NavLink({
  href,
  children,
  icon,
  exact = false,
}: NavLinkProps) {
  const pathname = usePathname();

  // Check if current path matches
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  const baseStyles =
    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium';

  const activeStyles = isActive
    ? 'bg-zinc-800 text-white'
    : 'text-gray-400 hover:text-white hover:bg-zinc-800/50';

  return (
    <Link href={href} className={`${baseStyles} ${activeStyles}`}>
      {icon && (
        <span className={`text-xl ${isActive ? 'text-[#1DB954]' : ''}`}>
          {icon}
        </span>
      )}
      <span>{children}</span>
    </Link>
  );
}

export default NavLink;
