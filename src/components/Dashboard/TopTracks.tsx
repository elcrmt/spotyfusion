'use client';

// Composant TopTracks - Affiche les top 10 tracks de l'utilisateur (B1)

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  fetchTopTracks,
  TopTrack,
  TopTimeRange,
} from '@/lib/spotify/spotifyClient';

interface TopTracksProps {
  timeRange?: TopTimeRange;
}

// Formate la durée en mm:ss
function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function TopTracks({ timeRange = 'medium_term' }: TopTracksProps) {
  const [tracks, setTracks] = useState<TopTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTopTracks() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchTopTracks(timeRange, 10);
        setTracks(data.items);
      } catch (err) {
        console.error('[B1] Erreur chargement top tracks:', err);
        setError('Impossible de charger vos top titres');
      } finally {
        setIsLoading(false);
      }
    }

    loadTopTracks();
  }, [timeRange]);

  // État de chargement
  if (isLoading) {
    return (
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">🎶 Top 10 Titres</h2>
        <div className="space-y-2 sm:space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-4 animate-pulse">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-zinc-700" />
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-zinc-700" />
              <div className="flex-1">
                <div className="h-3 sm:h-4 w-32 sm:w-40 bg-zinc-700 rounded mb-1 sm:mb-2" />
                <div className="h-2 sm:h-3 w-20 sm:w-28 bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">🎶 Top 10 Titres</h2>
        <div className="text-center py-6 sm:py-8">
          <p className="text-red-400 mb-2 text-sm sm:text-base">⚠️ {error}</p>
          <p className="text-zinc-500 text-xs mb-3 sm:mb-4 px-4">
            Vérifiez que votre compte est autorisé dans le Spotify Developer Dashboard.
          </p>
          <button
            onClick={() => window.location.href = '/api/auth/logout'}
            className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors"
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
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">🎶 Top 10 Titres</h2>
        <p className="text-zinc-400 text-center py-6 sm:py-8 text-sm sm:text-base px-4">
          Pas encore assez d&apos;écoutes pour afficher vos top titres.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">🎶 Top 10 Titres</h2>
      <ul className="space-y-2 sm:space-y-3">
        {tracks.map((track, index) => (
          <li key={track.id}>
            <a
              href={track.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-4 rounded-lg p-1.5 sm:p-2 -mx-1.5 sm:-mx-2 transition-colors hover:bg-zinc-800"
            >
              {/* Rang */}
              <span className="w-5 sm:w-6 text-center text-xs sm:text-sm font-bold text-zinc-500">
                {index + 1}
              </span>

              {/* Pochette album */}
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-700">
                {track.albumImageUrl ? (
                  <Image
                    src={track.albumImageUrl}
                    alt={track.albumName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 40px, 48px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg sm:text-xl">
                    💿
                  </div>
                )}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate text-sm sm:text-base">{track.name}</p>
                <p className="text-xs text-zinc-400 truncate">
                  {track.artists.map((a) => a.name).join(', ')}
                </p>
              </div>

              {/* Durée */}
              <span className="text-xs text-zinc-500">
                {formatDuration(track.duration_ms)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopTracks;
