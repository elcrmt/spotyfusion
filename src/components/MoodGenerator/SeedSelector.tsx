'use client';

// Composant SeedSelector - Sélection de semences avec recherche (D2)

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { searchSpotify, type Seed } from '@/lib/spotify/spotifyClient';

interface SeedSelectorProps {
  seeds: Seed[];
  onSeedsChange: (seeds: Seed[]) => void;
  maxSeeds?: number;
}

export function SeedSelector({
  seeds,
  onSeedsChange,
  maxSeeds = 5,
}: SeedSelectorProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Seed[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Recherche avec debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchSpotify(query, 'artist,track', 10);
        const allResults: Seed[] = [
          ...data.artists,
          ...data.tracks,
        ];
        setResults(allResults);
        setShowResults(true);
      } catch (error) {
        console.error('[D2] Erreur recherche:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Ferme les résultats en cliquant ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ajoute une semence
  const addSeed = useCallback(
    (seed: Seed) => {
      // Vérifie le maximum
      if (seeds.length >= maxSeeds) {
        return;
      }

      // Vérifie si déjà ajouté
      if (seeds.some((s) => s.id === seed.id && s.type === seed.type)) {
        return;
      }

      onSeedsChange([...seeds, seed]);
      setQuery('');
      setShowResults(false);
      inputRef.current?.focus();
    },
    [seeds, maxSeeds, onSeedsChange]
  );

  // Retire une semence
  const removeSeed = useCallback(
    (seedId: string, seedType: string) => {
      onSeedsChange(seeds.filter((s) => !(s.id === seedId && s.type === seedType)));
    },
    [seeds, onSeedsChange]
  );

  // Gère la touche Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      addSeed(results[0]);
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  const canAddMore = seeds.length < maxSeeds;

  return (
    <div className="space-y-4">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">
          🎯 Semences ({seeds.length}/{maxSeeds})
        </label>
        <span className="text-xs text-zinc-500">
          Artistes ou titres pour guider l&apos;algorithme
        </span>
      </div>

      {/* Tags des semences sélectionnées */}
      {seeds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {seeds.map((seed) => (
            <div
              key={`${seed.type}-${seed.id}`}
              className="flex items-center gap-2 rounded-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 group hover:border-zinc-600 transition-colors"
            >
              {/* Image */}
              {seed.imageUrl && (
                <div className="relative h-5 w-5 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={seed.imageUrl}
                    alt={seed.name}
                    fill
                    className="object-cover"
                    sizes="20px"
                  />
                </div>
              )}

              {/* Type icon */}
              <span className="text-xs">{seed.type === 'artist' ? '🎤' : '🎵'}</span>

              {/* Nom */}
              <span className="text-sm text-white truncate max-w-[150px]">
                {seed.name}
                {seed.type === 'track' && 'artists' in seed && seed.artists.length > 0 && (
                  <span className="text-zinc-500 ml-1">• {seed.artists[0]}</span>
                )}
              </span>

              {/* Bouton supprimer */}
              <button
                type="button"
                onClick={() => removeSeed(seed.id, seed.type)}
                className="text-zinc-500 hover:text-red-400 transition-colors"
                aria-label="Retirer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Champ de recherche */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder={
            canAddMore
              ? 'Rechercher un artiste ou un titre...'
              : `Maximum ${maxSeeds} semences atteint`
          }
          disabled={!canAddMore}
          className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-green-500" />
          </div>
        )}

        {/* Résultats de recherche */}
        {showResults && results.length > 0 && (
          <div
            ref={resultsRef}
            className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-zinc-800 border border-zinc-700 shadow-xl max-h-80 overflow-y-auto z-10"
          >
            {results.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                type="button"
                onClick={() => addSeed(result)}
                disabled={seeds.some((s) => s.id === result.id && s.type === result.type)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-700 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Image */}
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-700">
                  {result.imageUrl ? (
                    <Image
                      src={result.imageUrl}
                      alt={result.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg">
                      {result.type === 'artist' ? '🎤' : '🎵'}
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {result.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {result.type === 'artist' && 'Artiste'}
                    {result.type === 'track' && 'artists' in result && result.artists.join(', ')}
                  </p>
                </div>

                {/* Type badge */}
                <span className="text-xs text-zinc-500 uppercase">{result.type}</span>
              </button>
            ))}
          </div>
        )}

        {/* Aucun résultat */}
        {showResults && !isSearching && results.length === 0 && query.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-zinc-800 border border-zinc-700 p-4 text-center text-sm text-zinc-400">
            Aucun résultat pour &quot;{query}&quot;
          </div>
        )}
      </div>

      {/* Aide */}
      <p className="text-xs text-zinc-500">
        💡 Tapez au moins 2 caractères pour rechercher. Appuyez sur Entrée pour sélectionner le premier résultat.
      </p>
    </div>
  );
}

export default SeedSelector;
