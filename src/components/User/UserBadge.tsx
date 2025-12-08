'use client';

/**
 * SpotyFusion - User Badge Component
 *
 * Displays the current user's avatar and name in the navigation.
 *
 * @module components/User/UserBadge
 */

import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../Common/Button';

// ================================
// Component
// ================================

export function UserBadge() {
  const { isAuthenticated, user, logout } = useAuth();

  // Not authenticated - should not happen if used correctly
  if (!isAuthenticated || !user) {
    return null;
  }

  // Get user's display image or placeholder
  const userImage = user.images?.[0]?.url ?? '/default-avatar.png';

  return (
    <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-zinc-800">
      {/* Avatar */}
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-zinc-700">
        {user.images?.[0]?.url ? (
          <Image
            src={userImage}
            alt={user.display_name ?? 'User avatar'}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-medium text-gray-400">
            {user.display_name?.[0]?.toUpperCase() ?? '?'}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-white">
          {user.display_name ?? 'User'}
        </p>
        <p className="truncate text-xs text-gray-400">
          {user.product === 'premium' ? '⭐ Premium' : 'Free'}
        </p>
      </div>

      {/* Logout Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="text-gray-400 hover:text-white"
        aria-label="Se déconnecter"
      >
        🚪
      </Button>
    </div>
  );
}

export default UserBadge;
