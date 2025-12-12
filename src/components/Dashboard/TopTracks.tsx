'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  fetchTopTracks,
  TopTrack,
  TopTimeRange,
} from '@/lib/spotify/spotifyClient';

interface TopTracksProps {
  timeRange?: TopTimeRange;
}

export function TopTracks({ timeRange = 'medium_term' }: TopTracksProps) {
  const [tracks, setTracks] = useState<TopTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Top 10 Morceaux</h2>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 animate-pulse">
              <div className="w-[140px] h-[140px] rounded-lg bg-[#282828]" />
              <div className="h-4 w-28 bg-[#282828] rounded" />
              <div className="h-3 w-20 bg-[#282828] rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Top 10 Morceaux</h2>
        <div className="bg-[#181818] rounded-lg p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Top 10 Morceaux</h2>
        <div className="bg-[#181818] rounded-lg p-6 text-center">
          <p className="text-[#b3b3b3]">Pas encore assez d&apos;écoutes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <h2 className="text-xl font-bold text-white mb-4">Top 10 Morceaux</h2>

      {/* Bouton gauche */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 mt-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
        aria-label="Précédent"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tracks.map((track, index) => (
          <a
            key={track.id}
            href={track.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex flex-col gap-2 group/item"
          >
            {/* Image carrée arrondie */}
            <div className="relative w-[140px] h-[140px] rounded-lg overflow-hidden bg-[#282828] group-hover/item:ring-2 group-hover/item:ring-green-500 transition-all">
              {track.albumImageUrl ? (
                <Image
                  src={track.albumImageUrl}
                  alt={track.albumName}
                  fill
                  className="object-cover"
                  sizes="140px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl">
                  💿
                </div>
              )}
            </div>

            {/* Rang + Titre + Artiste */}
            <div className="max-w-[140px]">
              <p className="text-white text-sm font-medium truncate">
                #{index + 1}. {track.name}
              </p>
              <p className="text-[#b3b3b3] text-xs truncate">
                {track.artists.map((a) => a.name).join(', ')}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Bouton droite */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 mt-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
        aria-label="Suivant"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}

export default TopTracks;
