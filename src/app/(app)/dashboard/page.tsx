'use client';

// Page Dashboard - Statistiques d'écoute Spotify (B1, B3)

import { useState } from 'react';
import { TopArtists, TopTracks, RecentlyPlayed } from '@/components/Dashboard';
import type { TopTimeRange } from '@/lib/spotify/spotifyClient';
import { BarChart3 } from 'lucide-react';

// Labels pour les périodes
const timeRangeLabels: Record<TopTimeRange, string> = {
  short_term: '4 dernières semaines',
  medium_term: '6 derniers mois',
  long_term: 'Depuis toujours',
};

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TopTimeRange>('medium_term');

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Dashboard</h1>
            <p className="text-sm sm:text-base text-zinc-400">Vos statistiques d&apos;écoute Spotify</p>
          </div>
        </div>

        {/* Sélecteur de période (B1) */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(timeRangeLabels) as TopTimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-full transition-colors whitespace-nowrap ${
                timeRange === range
                  ? 'bg-green-500 text-black font-medium'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {timeRangeLabels[range]}
            </button>
          ))}
        </div>
      </div>

      {/* Top 10 Artistes et Top 10 Titres (B1) */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <TopArtists timeRange={timeRange} />
        <TopTracks timeRange={timeRange} />
      </div>

      {/* Récemment écouté (B3) */}
      <div className="mt-4 sm:mt-6">
        <RecentlyPlayed />
      </div>
    </div>
  );
}
