'use client';

// Page Mood Generator - Maquette Figma - Générateur de Playlists

import { useState, useCallback } from 'react';
import { Sparkles, Info, X } from 'lucide-react';
import {
  RecommendationsList,
} from '@/components/MoodGenerator';
import { GreenSlider } from '@/components/Common/GreenSlider';
import {
  fetchRecommendations,
  type Seed,
  type RecommendedTrack,
  searchSpotify,
} from '@/lib/spotify/spotifyClient';

// Genres populaires selon la maquette
const POPULAR_GENRES = [
  'Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz',
  'Classical', 'R&B', 'Country'
];

export default function MoodGeneratorPage() {
  // États des sliders
  const [danceability, setDanceability] = useState(0.5);
  const [energy, setEnergy] = useState(0.5);
  const [valence, setValence] = useState(0.5);

  // États des semences
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ artists: any[]; tracks: any[] }>({ artists: [], tracks: [] });
  const [isSearching, setIsSearching] = useState(false);

  // États de génération
  const [recommendations, setRecommendations] = useState<RecommendedTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recherche
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults({ artists: [], tracks: [] });
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchSpotify(query, 'artist,track', 5);
      setSearchResults(results);
    } catch (err) {
      console.error('Erreur recherche:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Ajouter une semence (genre)
  const addGenreSeed = (genre: string) => {
    if (seeds.length >= 5) return;
    if (seeds.find(s => s.id === genre.toLowerCase())) return;

    setSeeds([...seeds, {
      id: genre.toLowerCase(),
      name: genre,
      type: 'genre',
      imageUrl: null,
    }]);
  };

  // Ajouter une semence (artiste ou track)
  const addSeed = (item: any, type: 'artist' | 'track') => {
    if (seeds.length >= 5) return;
    if (seeds.find(s => s.id === item.id)) return;

    setSeeds([...seeds, {
      id: item.id,
      name: item.name,
      type,
      imageUrl: item.imageUrl,
    }]);
    setSearchQuery('');
    setSearchResults({ artists: [], tracks: [] });
  };

  // Supprimer une semence
  const removeSeed = (id: string) => {
    setSeeds(seeds.filter(s => s.id !== id));
  };

  // Générer les recommandations
  const handleGenerate = useCallback(async () => {
    if (seeds.length === 0) {
      setError('Veuillez sélectionner au moins une semence.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const seedArtists = seeds.filter(s => s.type === 'artist').map(s => s.id);
      const seedTracks = seeds.filter(s => s.type === 'track').map(s => s.id);
      const seedGenres = seeds.filter(s => s.type === 'genre').map(s => s.id);

      const result = await fetchRecommendations({
        seedArtists: seedArtists.length > 0 ? seedArtists : undefined,
        seedTracks: seedTracks.length > 0 ? seedTracks : undefined,
        seedGenres: seedGenres.length > 0 ? seedGenres : undefined,
        targetDanceability: danceability,
        targetEnergy: energy,
        targetValence: valence,
        limit: 31,
      });

      setRecommendations(result.tracks);
    } catch (err) {
      console.error('Erreur génération:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur lors de la génération.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [seeds, danceability, energy, valence]);

  return (
    <div className="max-w-[1200px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Générateur de Playlists
        </h1>
        <p className="text-[#b3b3b3] text-sm">
          Créez des playlists personnalisées basées sur vos préférences musicales
        </p>
      </div>

      {/* Main Grid - 2 colonnes */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Colonne Gauche - Caractéristiques Audio */}
        <div className="bg-[#181818] rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Caractéristiques Audio</h2>

          {/* Danceability Slider */}
          <GreenSlider
            value={danceability}
            onChange={setDanceability}
            label="Danceability"
            description="À quel point la musique est adaptée à la danse"
          />

          {/* Energy Slider */}
          <GreenSlider
            value={energy}
            onChange={setEnergy}
            label="Energy"
            description="Intensité et activité de la musique"
          />

          {/* Valence Slider */}
          <GreenSlider
            value={valence}
            onChange={setValence}
            label="Valence (Positivité)"
            description="Humeur positive ou négative de la musique"
          />
        </div>

        {/* Colonne Droite - Semences */}
        <div className="bg-[#181818] rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Semences</h2>

          {/* Barre de recherche */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Rechercher artistes, pistes ou genres..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-[#282828] text-white rounded-md px-4 py-3 text-sm placeholder-[#6a6a6a] focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Résultats de recherche */}
            {(searchResults.artists.length > 0 || searchResults.tracks.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#282828] rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                {searchResults.artists.map((artist) => (
                  <button
                    key={artist.id}
                    onClick={() => addSeed(artist, 'artist')}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#333] text-left"
                  >
                    <span className="text-xs text-[#6a6a6a]">Artiste</span>
                    <span className="text-white text-sm">{artist.name}</span>
                  </button>
                ))}
                {searchResults.tracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => addSeed(track, 'track')}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#333] text-left"
                  >
                    <span className="text-xs text-[#6a6a6a]">Titre</span>
                    <span className="text-white text-sm">{track.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Genres populaires */}
          <div className="mb-4">
            <p className="text-[#b3b3b3] text-xs mb-2">Genres populaires :</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => addGenreSeed(genre)}
                  disabled={seeds.length >= 5 || seeds.find(s => s.id === genre.toLowerCase()) !== undefined}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${seeds.find(s => s.id === genre.toLowerCase())
                    ? 'bg-green-500 text-black border-green-500'
                    : 'border-[#333] text-white hover:border-white disabled:opacity-50'
                    }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Semences sélectionnées */}
          {seeds.length > 0 && (
            <div className="mb-4">
              <p className="text-[#b3b3b3] text-xs mb-2">Semences sélectionnées :</p>
              <div className="flex flex-wrap gap-2">
                {seeds.map((seed) => (
                  <span
                    key={seed.id}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-500 text-black"
                  >
                    {seed.name}
                    <button onClick={() => removeSeed(seed.id)} className="hover:bg-green-600 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="flex items-start gap-2 text-[#6a6a6a] text-xs">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>Ajoutez jusqu&apos;à 5 semences (artistes, pistes ou genres) pour personnaliser vos recommandations</p>
          </div>
        </div>
      </div>

      {/* Bouton Générer */}
      <div className="mb-6">
        <button
          onClick={handleGenerate}
          disabled={seeds.length === 0 || isLoading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-black font-semibold rounded-full hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Sparkles className="w-5 h-5" />
          {isLoading ? 'Génération en cours...' : 'Générer les recommandations'}
        </button>
      </div>

      {/* Section Recommandations */}
      <RecommendationsList
        tracks={recommendations}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
