'use client';

/**
 * SpotyFusion - Mood Playlist Generator Page
 *
 * Generate playlists based on mood parameters (energy, danceability, valence).
 *
 * Features:
 * - Mood sliders (energy, danceability, happiness)
 * - Seed selection (artists, tracks, genres)
 * - Recommendations display
 * - Save playlist to Spotify
 *
 * TODO: Implement real API calls for recommendations and playlist creation
 */

import { useState } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { ProtectedRoute } from '@/components/Layout/ProtectedRoute';
import { Card } from '@/components/Common/Card';
import { Button } from '@/components/Common/Button';
import { Slider } from '@/components/Common/Slider';
import type { MoodParams } from '@/lib/spotify/types';

// ================================
// Types
// ================================

interface Seed {
  type: 'artist' | 'track' | 'genre';
  id: string;
  name: string;
}

interface RecommendedTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  previewUrl: string | null;
}

// ================================
// Mock Data (for development)
// ================================

const AVAILABLE_GENRES = [
  'pop',
  'rock',
  'hip-hop',
  'electronic',
  'r&b',
  'jazz',
  'classical',
  'indie',
  'metal',
  'reggae',
  'country',
  'latin',
];

const MOCK_RECOMMENDATIONS: RecommendedTrack[] = [
  { id: '1', name: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', previewUrl: null },
  { id: '2', name: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', previewUrl: null },
  { id: '3', name: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', previewUrl: null },
  { id: '4', name: 'Peaches', artist: 'Justin Bieber', album: 'Justice', previewUrl: null },
  { id: '5', name: 'Kiss Me More', artist: 'Doja Cat', album: 'Planet Her', previewUrl: null },
  { id: '6', name: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', previewUrl: null },
  { id: '7', name: 'Montero', artist: 'Lil Nas X', album: 'Montero', previewUrl: null },
  { id: '8', name: 'Stay', artist: 'The Kid LAROI', album: 'F*ck Love', previewUrl: null },
];

// ================================
// Mood Sliders Component
// ================================

interface MoodSlidersProps {
  values: MoodParams;
  onChange: (key: keyof MoodParams, value: number) => void;
}

function MoodSliders({ values, onChange }: MoodSlidersProps) {
  return (
    <Card
      title="🎚️ Paramètres d'humeur"
      subtitle="Ajustez les curseurs selon votre mood"
    >
      <div className="space-y-6">
        <Slider
          label="⚡ Énergie"
          value={Math.round(values.energy * 100)}
          onChange={(v) => onChange('energy', v / 100)}
          minLabel="Calme"
          maxLabel="Énergique"
        />

        <Slider
          label="💃 Dansabilité"
          value={Math.round(values.danceability * 100)}
          onChange={(v) => onChange('danceability', v / 100)}
          minLabel="Posé"
          maxLabel="Dansant"
        />

        <Slider
          label="😊 Positivité"
          value={Math.round(values.valence * 100)}
          onChange={(v) => onChange('valence', v / 100)}
          minLabel="Mélancolique"
          maxLabel="Joyeux"
        />
      </div>
    </Card>
  );
}

// ================================
// Seeds Selector Component
// ================================

interface SeedsSelectorProps {
  selectedSeeds: Seed[];
  onAddSeed: (seed: Seed) => void;
  onRemoveSeed: (id: string) => void;
}

function SeedsSelector({ selectedSeeds, onAddSeed, onRemoveSeed }: SeedsSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: Implement search for artists and tracks
  // For now, just show genre selection

  return (
    <Card
      title="🌱 Seeds (graines)"
      subtitle="Choisissez jusqu'à 5 genres, artistes ou morceaux"
    >
      {/* Selected Seeds */}
      {selectedSeeds.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedSeeds.map((seed) => (
            <span
              key={seed.id}
              className="inline-flex items-center gap-1 rounded-full bg-[#1DB954]/20 px-3 py-1 text-sm text-[#1DB954]"
            >
              {seed.type === 'genre' && '🏷️'}
              {seed.type === 'artist' && '🎤'}
              {seed.type === 'track' && '🎵'}
              {seed.name}
              <button
                onClick={() => onRemoveSeed(seed.id)}
                className="ml-1 hover:text-white"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input (placeholder for artist/track search) */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un artiste ou un morceau..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-gray-500 focus:border-[#1DB954] focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-600">
          💡 TODO: Implémenter la recherche avec search() de l&apos;API Spotify
        </p>
      </div>

      {/* Genre Pills */}
      <div>
        <p className="mb-2 text-sm text-gray-400">Genres disponibles :</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_GENRES.map((genre) => {
            const isSelected = selectedSeeds.some(
              (s) => s.type === 'genre' && s.id === genre
            );
            const canAdd = selectedSeeds.length < 5;

            return (
              <button
                key={genre}
                onClick={() => {
                  if (isSelected) {
                    onRemoveSeed(genre);
                  } else if (canAdd) {
                    onAddSeed({ type: 'genre', id: genre, name: genre });
                  }
                }}
                disabled={!isSelected && !canAdd}
                className={`rounded-full px-3 py-1 text-sm transition-all ${
                  isSelected
                    ? 'bg-[#1DB954] text-black'
                    : canAdd
                    ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                    : 'cursor-not-allowed bg-zinc-800/50 text-gray-600'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Count */}
      <p className="mt-4 text-right text-xs text-gray-500">
        {selectedSeeds.length}/5 seeds sélectionnés
      </p>
    </Card>
  );
}

// ================================
// Recommendations List Component
// ================================

interface RecommendationsListProps {
  tracks: RecommendedTrack[];
  isLoading: boolean;
  onRefresh: () => void;
}

function RecommendationsList({ tracks, isLoading, onRefresh }: RecommendationsListProps) {
  if (tracks.length === 0 && !isLoading) {
    return (
      <Card>
        <div className="py-8 text-center">
          <span className="mb-4 block text-5xl">🎵</span>
          <p className="text-gray-400">
            Ajustez les paramètres et sélectionnez des seeds pour générer des
            recommandations
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="🎧 Recommandations"
      subtitle={`${tracks.length} morceaux suggérés`}
    >
      {/* Refresh Button */}
      <div className="mb-4 flex justify-end">
        <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
          🔄 Actualiser
        </Button>
      </div>

      {/* Track List */}
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-zinc-800"
          >
            {/* Index */}
            <span className="w-6 text-center text-sm text-gray-500">
              {index + 1}
            </span>

            {/* Album Art Placeholder */}
            <div className="h-10 w-10 rounded bg-zinc-700" />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {track.name}
              </p>
              <p className="truncate text-xs text-gray-400">
                {track.artist} • {track.album}
              </p>
            </div>

            {/* Preview Button (placeholder) */}
            <Button variant="ghost" size="sm" className="text-gray-400">
              ▶️
            </Button>
          </div>
        ))}
      </div>

      {/* TODO Comment */}
      <p className="mt-4 text-center text-xs text-gray-600">
        💡 TODO: Appeler getRecommendations() avec les params et seeds
      </p>
    </Card>
  );
}

// ================================
// Save Playlist Component
// ================================

interface SavePlaylistProps {
  trackCount: number;
  onSave: (name: string) => void;
  isSaving: boolean;
}

function SavePlaylist({ trackCount, onSave, isSaving }: SavePlaylistProps) {
  const [playlistName, setPlaylistName] = useState('Ma playlist mood');

  if (trackCount === 0) {
    return null;
  }

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="playlist-name"
            className="mb-2 block text-sm text-gray-400"
          >
            Nom de la playlist
          </label>
          <input
            id="playlist-name"
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white focus:border-[#1DB954] focus:outline-none"
            placeholder="Ma super playlist"
          />
        </div>
        <Button
          variant="spotify"
          onClick={() => onSave(playlistName)}
          disabled={isSaving || !playlistName.trim()}
          isLoading={isSaving}
        >
          💾 Sauvegarder ({trackCount} titres)
        </Button>
      </div>

      {/* TODO Comment */}
      <p className="mt-4 text-xs text-gray-600">
        💡 TODO: Appeler createPlaylist() puis addTracksToPlaylist()
      </p>
    </Card>
  );
}

// ================================
// Mood Generator Page Component
// ================================

export default function MoodGeneratorPage() {
  // Mood parameters state
  const [moodParams, setMoodParams] = useState<MoodParams>({
    energy: 0.5,
    danceability: 0.5,
    valence: 0.5,
  });

  // Seeds state
  const [selectedSeeds, setSelectedSeeds] = useState<Seed[]>([]);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<RecommendedTrack[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  // Save state
  const [isSaving, setIsSaving] = useState(false);

  // Handle mood parameter change
  const handleMoodChange = (key: keyof MoodParams, value: number) => {
    setMoodParams((prev) => ({ ...prev, [key]: value }));
  };

  // Handle seed add
  const handleAddSeed = (seed: Seed) => {
    if (selectedSeeds.length < 5) {
      setSelectedSeeds((prev) => [...prev, seed]);
    }
  };

  // Handle seed remove
  const handleRemoveSeed = (id: string) => {
    setSelectedSeeds((prev) => prev.filter((s) => s.id !== id));
  };

  // Generate recommendations
  const handleGenerate = async () => {
    if (selectedSeeds.length === 0) {
      alert('Veuillez sélectionner au moins un seed (genre, artiste ou morceau)');
      return;
    }

    setIsLoadingRecs(true);
    console.log('TODO: Call getRecommendations with:', {
      moodParams,
      seeds: selectedSeeds,
    });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Use mock data for now
    setRecommendations(MOCK_RECOMMENDATIONS);
    setIsLoadingRecs(false);
  };

  // Save playlist
  const handleSavePlaylist = async (name: string) => {
    setIsSaving(true);
    console.log('TODO: Save playlist:', {
      name,
      tracks: recommendations.map((t) => t.id),
    });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert(`Playlist "${name}" créée avec succès ! (simulation)`);
    setIsSaving(false);
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">🎨 Générateur de Playlist</h1>
          <p className="mt-2 text-gray-400">
            Créez une playlist personnalisée selon votre humeur
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Mood Sliders */}
            <MoodSliders values={moodParams} onChange={handleMoodChange} />

            {/* Seeds Selector */}
            <SeedsSelector
              selectedSeeds={selectedSeeds}
              onAddSeed={handleAddSeed}
              onRemoveSeed={handleRemoveSeed}
            />

            {/* Generate Button */}
            <Button
              variant="spotify"
              size="lg"
              fullWidth
              onClick={handleGenerate}
              isLoading={isLoadingRecs}
              disabled={selectedSeeds.length === 0}
            >
              ✨ Générer des recommandations
            </Button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Recommendations */}
            <RecommendationsList
              tracks={recommendations}
              isLoading={isLoadingRecs}
              onRefresh={handleGenerate}
            />

            {/* Save Playlist */}
            <SavePlaylist
              trackCount={recommendations.length}
              onSave={handleSavePlaylist}
              isSaving={isSaving}
            />
          </div>
        </div>

        {/* Development Note */}
        <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-300">
            📝 Notes de développement
          </h3>
          <ul className="space-y-1 text-xs text-gray-500">
            <li>
              • TODO: Utiliser getRecommendations() avec target_energy, target_danceability, target_valence
            </li>
            <li>
              • TODO: Implémenter la recherche d&apos;artistes/tracks avec search()
            </li>
            <li>
              • TODO: Charger les genres disponibles avec getAvailableGenreSeeds()
            </li>
            <li>
              • TODO: Sauvegarder avec createPlaylist() + addTracksToPlaylist()
            </li>
            <li>
              • TODO: Ajouter la prévisualisation audio avec preview_url
            </li>
          </ul>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
