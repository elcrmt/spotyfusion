'use client';

import { useState } from 'react';
import { TopArtists, TopTracks, RecentlyPlayed } from '@/components/Dashboard';
import type { TopTimeRange } from '@/lib/spotify/spotifyClient';

const timeRangeOptions: { value: TopTimeRange; label: string }[] = [
  { value: 'short_term', label: '4 semaines' },
  { value: 'medium_term', label: '6 mois' },
  { value: 'long_term', label: 'Tout le temps' },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TopTimeRange>('short_term');

  return (
    <div className="max-w-[1200px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Vos Statistiques
        </h1>
        <p className="text-[#b3b3b3] text-sm">
          Découvrez vos artistes et morceaux préférés
        </p>
      </div>

      {/* Filtres temporels - Style Figma */}
      <div className="flex gap-2 mb-8">
        {timeRangeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTimeRange(option.value)}
            className={`px-4 py-2 text-sm rounded-full transition-all ${timeRange === option.value
                ? 'bg-green-500 text-black font-semibold'
                : 'bg-transparent text-white border border-[#333] hover:border-white'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Top 10 Artistes - Carousel horizontal */}
      <section className="mb-8">
        <TopArtists timeRange={timeRange} />
      </section>

      {/* Top 10 Morceaux - Carousel horizontal */}
      <section className="mb-8">
        <TopTracks timeRange={timeRange} />
      </section>

      {/* 5 Derniers Titres Écoutés */}
      <section>
        <RecentlyPlayed />
      </section>
    </div>
  );
}
