'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import {
  fetchRecentlyPlayed,
  RecentTrack,
} from '@/lib/spotify/spotifyClient';

function formatPlayedAt(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "À l'instant";
  if (diffMinutes < 60) return `Il y a ${diffMinutes} minutes`;
  if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
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

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-4">5 Derniers Titres Écoutés</h2>
        <div className="bg-[#181818] rounded-lg p-4">
          <div className="flex gap-4 items-center animate-pulse">
            <div className="w-[200px] h-[120px] rounded-lg bg-[#282828] flex-shrink-0" />
            <div className="flex-1">
              <div className="h-5 w-40 bg-[#282828] rounded mb-2" />
              <div className="h-4 w-28 bg-[#282828] rounded" />
            </div>
            <div className="h-4 w-24 bg-[#282828] rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-4">5 Derniers Titres Écoutés</h2>
        <div className="bg-[#181818] rounded-lg p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-4">5 Derniers Titres Écoutés</h2>
        <div className="bg-[#181818] rounded-lg p-6 text-center">
          <p className="text-[#b3b3b3]">Aucune écoute récente</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">5 Derniers Titres Écoutés</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-3">
        {/* Premier titre - Grande carte à gauche */}
        {tracks[0] && (
          <a
            href={tracks[0].externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition-colors group"
          >
            <div className="relative w-full h-[180px] rounded-lg overflow-hidden bg-[#282828] mb-3">
              {tracks[0].albumImageUrl ? (
                <Image
                  src={tracks[0].albumImageUrl}
                  alt={tracks[0].albumName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl">
                  💿
                </div>
              )}
            </div>
            <p className="text-white font-medium truncate group-hover:text-green-400 transition-colors">
              {tracks[0].name}
            </p>
            <p className="text-[#b3b3b3] text-sm truncate mb-2">
              {tracks[0].artists.map((a) => a.name).join(', ')}
            </p>
            <div className="flex items-center gap-2 text-[#b3b3b3] text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatPlayedAt(tracks[0].playedAt)}</span>
            </div>
          </a>
        )}

        {/* Les 4 autres titres - Empilés à droite */}
        <div className="space-y-2">
          {tracks.slice(1).map((track, index) => (
            <a
              key={`${track.id}-${index + 1}`}
              href={track.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#181818] rounded-lg p-3 hover:bg-[#282828] transition-colors group"
            >
              <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-[#282828]">
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

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate group-hover:text-green-400 transition-colors">
                  {track.name}
                </p>
                <p className="text-[#b3b3b3] text-xs truncate">
                  {track.artists.map((a) => a.name).join(', ')}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[#b3b3b3] text-xs flex-shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatPlayedAt(track.playedAt)}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentlyPlayed;
