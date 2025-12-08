'use client';

/**
 * SpotyFusion - Dashboard Page
 *
 * Displays the user's Spotify statistics:
 * - Top Artists
 * - Top Tracks
 * - Recently Played
 *
 * TODO: Implement real API calls when authentication is ready
 */

import { useState } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { ProtectedRoute } from '@/components/Layout/ProtectedRoute';
import { Card } from '@/components/Common/Card';
import { Button } from '@/components/Common/Button';
import type { TimeRange } from '@/lib/spotify/types';

// ================================
// Types
// ================================

type StatsTab = 'artists' | 'tracks' | 'recent';

// ================================
// Mock Data (for development)
// ================================

const MOCK_TOP_ARTISTS = [
  { id: '1', name: 'Daft Punk', genres: ['electronic', 'house'], imageUrl: '' },
  { id: '2', name: 'The Weeknd', genres: ['r&b', 'pop'], imageUrl: '' },
  { id: '3', name: 'Kendrick Lamar', genres: ['hip hop', 'rap'], imageUrl: '' },
  { id: '4', name: 'Tame Impala', genres: ['psychedelic', 'rock'], imageUrl: '' },
  { id: '5', name: 'Arctic Monkeys', genres: ['indie', 'rock'], imageUrl: '' },
];

const MOCK_TOP_TRACKS = [
  { id: '1', name: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours' },
  { id: '2', name: 'Get Lucky', artist: 'Daft Punk', album: 'Random Access Memories' },
  { id: '3', name: 'HUMBLE.', artist: 'Kendrick Lamar', album: 'DAMN.' },
  { id: '4', name: 'The Less I Know The Better', artist: 'Tame Impala', album: 'Currents' },
  { id: '5', name: 'Do I Wanna Know?', artist: 'Arctic Monkeys', album: 'AM' },
];

const MOCK_RECENT_TRACKS = [
  { id: '1', name: 'Starboy', artist: 'The Weeknd', playedAt: '2 min ago' },
  { id: '2', name: 'One More Time', artist: 'Daft Punk', playedAt: '15 min ago' },
  { id: '3', name: 'DNA.', artist: 'Kendrick Lamar', playedAt: '1 hour ago' },
  { id: '4', name: 'Elephant', artist: 'Tame Impala', playedAt: '2 hours ago' },
  { id: '5', name: 'R U Mine?', artist: 'Arctic Monkeys', playedAt: '3 hours ago' },
];

// ================================
// Time Range Selector
// ================================

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  const options: { value: TimeRange; label: string }[] = [
    { value: 'short_term', label: '4 semaines' },
    { value: 'medium_term', label: '6 mois' },
    { value: 'long_term', label: 'Tout le temps' },
  ];

  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

// ================================
// Top Artists Section
// ================================

interface TopArtistsSectionProps {
  timeRange: TimeRange;
}

function TopArtistsSection({ timeRange }: TopArtistsSectionProps) {
  // TODO: Replace with real API call
  // const { data, isLoading } = useTopArtists(timeRange);
  console.log('TODO: Fetch top artists for time range:', timeRange);

  return (
    <Card title="🎤 Top Artistes" subtitle="Vos artistes les plus écoutés">
      <div className="space-y-3">
        {MOCK_TOP_ARTISTS.map((artist, index) => (
          <div
            key={artist.id}
            className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-zinc-800"
          >
            {/* Rank */}
            <span className="w-6 text-center text-lg font-bold text-gray-500">
              {index + 1}
            </span>

            {/* Avatar Placeholder */}
            <div className="h-12 w-12 rounded-full bg-zinc-700" />

            {/* Info */}
            <div className="flex-1">
              <p className="font-medium text-white">{artist.name}</p>
              <p className="text-sm text-gray-400">
                {artist.genres.slice(0, 2).join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* TODO Comment */}
      <p className="mt-4 text-center text-xs text-gray-600">
        💡 TODO: Appeler getTopArtists() avec le token d&apos;authentification
      </p>
    </Card>
  );
}

// ================================
// Top Tracks Section
// ================================

interface TopTracksSectionProps {
  timeRange: TimeRange;
}

function TopTracksSection({ timeRange }: TopTracksSectionProps) {
  // TODO: Replace with real API call
  // const { data, isLoading } = useTopTracks(timeRange);
  console.log('TODO: Fetch top tracks for time range:', timeRange);

  return (
    <Card title="🎵 Top Morceaux" subtitle="Vos morceaux les plus écoutés">
      <div className="space-y-3">
        {MOCK_TOP_TRACKS.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-zinc-800"
          >
            {/* Rank */}
            <span className="w-6 text-center text-lg font-bold text-gray-500">
              {index + 1}
            </span>

            {/* Album Art Placeholder */}
            <div className="h-12 w-12 rounded bg-zinc-700" />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-white">{track.name}</p>
              <p className="truncate text-sm text-gray-400">
                {track.artist} • {track.album}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* TODO Comment */}
      <p className="mt-4 text-center text-xs text-gray-600">
        💡 TODO: Appeler getTopTracks() avec le token d&apos;authentification
      </p>
    </Card>
  );
}

// ================================
// Recently Played Section
// ================================

function RecentlyPlayedSection() {
  // TODO: Replace with real API call
  // const { data, isLoading } = useRecentlyPlayed();

  return (
    <Card title="🕐 Écoutés récemment" subtitle="Votre historique d'écoute">
      <div className="space-y-3">
        {MOCK_RECENT_TRACKS.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-zinc-800"
          >
            {/* Album Art Placeholder */}
            <div className="h-10 w-10 rounded bg-zinc-700" />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-white">{track.name}</p>
              <p className="truncate text-sm text-gray-400">{track.artist}</p>
            </div>

            {/* Time */}
            <span className="text-xs text-gray-500">{track.playedAt}</span>
          </div>
        ))}
      </div>

      {/* TODO Comment */}
      <p className="mt-4 text-center text-xs text-gray-600">
        💡 TODO: Appeler getRecentlyPlayed() avec le token d&apos;authentification
      </p>
    </Card>
  );
}

// ================================
// Dashboard Page Component
// ================================

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');
  const [activeTab, setActiveTab] = useState<StatsTab>('artists');

  return (
    <ProtectedRoute>
      <AppLayout>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-gray-400">
            Découvrez vos statistiques d&apos;écoute Spotify
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>

        {/* Tab Navigation (Mobile) */}
        <div className="mb-6 flex gap-2 md:hidden">
          <Button
            variant={activeTab === 'artists' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('artists')}
          >
            Artistes
          </Button>
          <Button
            variant={activeTab === 'tracks' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('tracks')}
          >
            Morceaux
          </Button>
          <Button
            variant={activeTab === 'recent' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('recent')}
          >
            Récents
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* Top Artists */}
          <div className={`${activeTab !== 'artists' ? 'hidden md:block' : ''}`}>
            <TopArtistsSection timeRange={timeRange} />
          </div>

          {/* Top Tracks */}
          <div className={`${activeTab !== 'tracks' ? 'hidden md:block' : ''}`}>
            <TopTracksSection timeRange={timeRange} />
          </div>

          {/* Recently Played */}
          <div className={`${activeTab !== 'recent' ? 'hidden md:block' : ''}`}>
            <RecentlyPlayedSection />
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
