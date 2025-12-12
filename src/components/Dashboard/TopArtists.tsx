'use client';

// Composant TopArtists - Carousel horizontal avec images rondes - Maquette Figma

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  fetchTopArtists,
  TopArtist,
  TopTimeRange,
} from '@/lib/spotify/spotifyClient';

interface TopArtistsProps {
  timeRange?: TopTimeRange;
}

export function TopArtists({ timeRange = 'medium_term' }: TopArtistsProps) {
  const [artists, setArtists] = useState<TopArtist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadTopArtists() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchTopArtists(timeRange, 10);
        setArtists(data.items);
      } catch (err) {
        console.error('[B1] Erreur chargement top artistes:', err);
        setError('Impossible de charger vos top artistes');
      } finally {
        setIsLoading(false);
      }
    }

    loadTopArtists();
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

  // État de chargement
  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Top 10 Artistes</h2>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
              <div className="w-[120px] h-[120px] rounded-full bg-[#282828]" />
              <div className="h-4 w-20 bg-[#282828] rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Top 10 Artistes</h2>
        <div className="bg-[#181818] rounded-lg p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  // Pas de données
  if (artists.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Top 10 Artistes</h2>
        <div className="bg-[#181818] rounded-lg p-6 text-center">
          <p className="text-[#b3b3b3]">Pas encore assez d&apos;écoutes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <h2 className="text-xl font-bold text-white mb-4">Top 10 Artistes</h2>

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
        {artists.map((artist, index) => (
          <a
            key={artist.id}
            href={artist.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex flex-col items-center gap-2 group/item"
          >
            {/* Image ronde */}
            <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden bg-[#282828] group-hover/item:ring-2 group-hover/item:ring-green-500 transition-all">
              {artist.imageUrl ? (
                <Image
                  src={artist.imageUrl}
                  alt={artist.name}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl">
                  🎤
                </div>
              )}
            </div>

            {/* Rang + Nom */}
            <div className="text-center max-w-[120px]">
              <p className="text-white text-sm font-medium truncate">
                #{index + 1}. {artist.name}
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

export default TopArtists;
