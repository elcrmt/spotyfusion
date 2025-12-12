'use client';

// Composant RecentlyPlayed - Liste horizontale avec image grande - Maquette Figma

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import {
  fetchRecentlyPlayed,
  RecentTrack,
} from '@/lib/spotify/spotifyClient';

// Formate l'horodatage en format lisible
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

  // État de chargement
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

  // État d'erreur
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

  // Pas de données
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

      <div className="space-y-2">
        {tracks.map((track, index) => (
          <a
            key={`${track.id}-${index}`}
            href={track.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-[#181818] rounded-lg p-3 hover:bg-[#282828] transition-colors group"
          >
            {/* Grande image pour le premier, petite pour les autres */}
            <div className={`relative flex-shrink-0 rounded-lg overflow-hidden bg-[#282828] ${index === 0 ? 'w-[180px] h-[100px]' : 'w-[60px] h-[60px]'
              }`}>
              {track.albumImageUrl ? (
                <Image
                  src={track.albumImageUrl}
                  alt={track.albumName}
                  fill
                  className="object-cover"
                  sizes={index === 0 ? "180px" : "60px"}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl">
                  💿
                </div>
              )}
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate group-hover:text-green-400 transition-colors">
                {track.name}
              </p>
              <p className="text-[#b3b3b3] text-sm truncate">
                {track.artists.map((a) => a.name).join(', ')}
              </p>
            </div>

            {/* Horodatage */}
            <div className="flex items-center gap-2 text-[#b3b3b3] text-sm flex-shrink-0">
              <Clock className="w-4 h-4" />
              <span>{formatPlayedAt(track.playedAt)}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default RecentlyPlayed;
