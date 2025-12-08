'use client';

// Badge utilisateur avec bouton de déconnexion

import { useAuth } from '@/context/AuthContext';
import { Button } from '../Common/Button';

export function UserBadge() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-zinc-800">
      {/* Avatar placeholder */}
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-zinc-700">
        <span className="text-lg font-medium text-gray-400">🎵</span>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-white">Connecté</p>
        <p className="truncate text-xs text-gray-400">Spotify</p>
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
