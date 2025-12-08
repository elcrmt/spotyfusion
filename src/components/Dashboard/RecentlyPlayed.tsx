'use client';

// Composant RecentlyPlayed - Affiche les 5 derniers titres écoutés (B3)

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  fetchRecentlyPlayed,
  RecentTrack,
} from '@/lib/spotify/spotifyClient';

// Formate l'horodatage en format lisible (B3)
function formatPlayedAt(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Si moins d'une heure
  if (diffMinutes < 60) {
    if (diffMinutes < 1) return 'À l\'instant';
    return `Il y a ${diffMinutes} min`;
  }

  // Si moins d'un jour
  if (diffHours < 24) {
    return `Il y a ${diffHours}h`;
  }

  // Si moins d'une semaine
  if (diffDays < 7) {
    return `Il y a ${diffDays}j`;
  }

  // Sinon afficher la date et l'heure
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Formate l'heure précise (B3)
function formatExactTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function RecentlyPlayed() {
  const [tracks, setTracks] = useState<RecentTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecentlyPlayed() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchRecentlyPlayed(5);
        setTracks(data.items);
      } catch (err) {
        console.error('[B3] Erreur chargement recently played:', err);
        setError('Impossible de charger vos écoutes récentes');
      } finally {
        setIsLoading(false);
      }
    }

    loadRecentlyPlayed();
  }, []);

  // État de chargement
  if (isLoading) {
    return (
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🕐 Récemment écouté</h2>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="h-12 w-12 rounded-lg bg-zinc-700" />
              <div className="flex-1">
                <div className="h-4 w-40 bg-zinc-700 rounded mb-2" />
                <div className="h-3 w-28 bg-zinc-800 rounded" />
              </div>
              <div className="h-3 w-16 bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🕐 Récemment écouté</h2>
        <div className="text-center py-8">
          <p className="text-red-400 mb-2">⚠️ {error}</p>
          <p className="text-zinc-500 text-xs mb-4">
            Vérifiez que votre compte est autorisé dans le Spotify Developer Dashboard.
          </p>
          <button
            onClick={() => window.location.href = '/api/auth/logout'}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Se reconnecter
          </button>
        </div>
      </div>
    );
  }

  // Pas de données
  if (tracks.length === 0) {
    return (
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🕐 Récemment écouté</h2>
        <p className="text-zinc-400 text-center py-8">
          Aucune écoute récente trouvée.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">🕐 Récemment écouté</h2>
      <ul className="space-y-3">
        {tracks.map((track, index) => (
          <li key={`${track.id}-${index}`}>
            <a
              href={track.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-lg p-2 -mx-2 transition-colors hover:bg-zinc-800"
            >
              {/* Pochette album */}
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-700">
                {track.albumImageUrl ? (
                  <Image
                    src={track.albumImageUrl}
                    alt={track.albumName}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl">
                    💿
                  </div>
                )}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{track.name}</p>
                <p className="text-xs text-zinc-400 truncate">
                  {track.artists.map((a) => a.name).join(', ')}
                </p>
              </div>

              {/* Horodatage (B3) */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-zinc-500" title={formatExactTime(track.playedAt)}>
                  {formatPlayedAt(track.playedAt)}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentlyPlayed;
