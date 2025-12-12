// GET /api/spotify/recommendations - Récupère les recommandations Spotify (D3)

import { NextRequest, NextResponse } from 'next/server';

// Type simplifié pour un track recommandé (D3)
export interface RecommendedTrack {
    id: string;
    name: string;
    artists: Array<{ id: string; name: string }>;
    albumName: string;
    albumImageUrl: string | null;
    duration_ms: number;
    previewUrl: string | null;
    externalUrl: string;
    // Audio features utilisées pour l'affichage
    energy?: number;
}

export interface RecommendationsResponse {
    tracks: RecommendedTrack[];
    seeds: Array<{
        id: string;
        type: 'artist' | 'track' | 'genre';
    }>;
}

export async function GET(request: NextRequest) {
    // Récupère la session depuis le cookie
    const sessionCookie = request.cookies.get('sf_session')?.value;

    if (!sessionCookie) {
        return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
    }

    let session;
    try {
        session = JSON.parse(sessionCookie);
    } catch {
        return NextResponse.json({ error: 'INVALID_SESSION' }, { status: 401 });
    }

    const { accessToken } = session;

    if (!accessToken) {
        return NextResponse.json({ error: 'NO_TOKEN' }, { status: 401 });
    }

    // Récupère les paramètres de query
    const searchParams = request.nextUrl.searchParams;

    // Seeds (au moins 1 requis, max 5 au total)
    const seedArtists = searchParams.get('seed_artists') || '';
    const seedTracks = searchParams.get('seed_tracks') || '';
    const seedGenres = searchParams.get('seed_genres') || '';

    // Audio features (0.0 à 1.0)
    const targetDanceability = searchParams.get('target_danceability');
    const targetEnergy = searchParams.get('target_energy');
    const targetValence = searchParams.get('target_valence');

    // Limite (20-50 titres)
    const limit = searchParams.get('limit') || '30';

    // Validation : au moins une seed requise
    if (!seedArtists && !seedTracks && !seedGenres) {
        return NextResponse.json(
            { error: 'MISSING_SEEDS', message: 'Au moins une semence (artiste, track ou genre) est requise.' },
            { status: 400 }
        );
    }

    try {
        // Construit les paramètres pour l'API Spotify
        const params = new URLSearchParams();
        params.append('limit', limit);

        if (seedArtists) params.append('seed_artists', seedArtists);
        if (seedTracks) params.append('seed_tracks', seedTracks);
        if (seedGenres) params.append('seed_genres', seedGenres);

        if (targetDanceability) params.append('target_danceability', targetDanceability);
        if (targetEnergy) params.append('target_energy', targetEnergy);
        if (targetValence) params.append('target_valence', targetValence);

        console.log('[D3] Génération de recommandations alternatives (sans API Recommendations)');

        // ============================================
        // SOLUTION ALTERNATIVE : Sans API Recommendations
        // ============================================
        // 1. Récupérer les top tracks des artistes seeds
        // 2. Faire des recherches par genre si des genres sont fournis
        // 3. Récupérer les audio features et filtrer selon les critères
        
        const allTracks:    any[] = [];
        const targetLimit = parseInt(limit);

        // Étape 1 : Top tracks des artistes
        if (seedArtists) {
            const artistIds = seedArtists.split(',');
            for (const artistId of artistIds.slice(0, 3)) { // Max 3 artistes pour éviter trop d'appels
                try {
                    const topTracksResponse = await fetch(
                        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=FR`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );

                    if (topTracksResponse.ok) {
                        const topTracksData = await topTracksResponse.json();
                        allTracks.push(...(topTracksData.tracks || []).slice(0, 10));
                    }
                } catch (err) {
                    console.warn(`[D3] Erreur récupération top tracks artiste ${artistId}:`, err);
                }
            }
        }

        // Étape 2 : Recherche par genre
        if (seedGenres) {
            const genres = seedGenres.split(',');
            for (const genre of genres.slice(0, 2)) { // Max 2 genres
                try {
                    // Recherche de tracks populaires dans ce genre
                    const searchResponse = await fetch(
                        `https://api.spotify.com/v1/search?q=genre:${encodeURIComponent(genre)}&type=track&limit=20&market=FR`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );

                    if (searchResponse.ok) {
                        const searchData = await searchResponse.json();
                        allTracks.push(...(searchData.tracks?.items || []));
                    }
                } catch (err) {
                    console.warn(`[D3] Erreur recherche genre ${genre}:`, err);
                }
            }
        }

        // Étape 3 : Si on a des track seeds, on les ajoute aussi
        if (seedTracks) {
            const trackIds = seedTracks.split(',');
            for (const trackId of trackIds) {
                try {
                    const trackResponse = await fetch(
                        `https://api.spotify.com/v1/tracks/${trackId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );

                    if (trackResponse.ok) {
                        const trackData = await trackResponse.json();
                        allTracks.push(trackData);
                    }
                } catch (err) {
                    console.warn(`[D3] Erreur récupération track ${trackId}:`, err);
                }
            }
        }

        // Déduplique les tracks par ID
        const uniqueTracks = Array.from(
            new Map(allTracks.map(track => [track.id, track])).values()
        );

        console.log(`[D3] ${uniqueTracks.length} tracks uniques collectées`);

        // Si on n'a pas assez de tracks, on fait une recherche générique
        if (uniqueTracks.length < targetLimit) {
            try {
                const fallbackGenre = seedGenres?.split(',')[0] || 'pop';
                const searchResponse = await fetch(
                    `https://api.spotify.com/v1/search?q=genre:${fallbackGenre}&type=track&limit=${targetLimit}&market=FR`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (searchResponse.ok) {
                    const searchData = await searchResponse.json();
                    uniqueTracks.push(...(searchData.tracks?.items || []));
                }
            } catch (err) {
                console.warn('[D3] Erreur recherche fallback:', err);
            }
        }

        const data = {
            tracks: uniqueTracks.slice(0, Math.max(50, targetLimit * 2)), // On prend plus pour filtrer après
            seeds: []
        };

        // Récupère les IDs des tracks pour obtenir les audio features
        const trackIds = data.tracks.map((track: { id: string }) => track.id).join(',');

        // Appel pour récupérer les audio features (pour l'energy score ET le filtrage)
        let audioFeatures: Record<string, { energy: number; danceability: number; valence: number }> = {};

        if (trackIds) {
            try {
                const featuresResponse = await fetch(
                    `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (featuresResponse.ok) {
                    const featuresData = await featuresResponse.json();
                    // Crée un map id -> audio features
                    featuresData.audio_features?.forEach((feature: { 
                        id: string; 
                        energy: number;
                        danceability: number;
                        valence: number;
                    } | null) => {
                        if (feature) {
                            audioFeatures[feature.id] = {
                                energy: feature.energy,
                                danceability: feature.danceability,
                                valence: feature.valence,
                            };
                        }
                    });
                }
            } catch (err) {
                console.warn('[D3] Impossible de récupérer les audio features:', err);
                // Continue sans les features, ce n'est pas bloquant
            }
        }

        // Filtre et trie les tracks selon les critères audio
        let filteredTracks = data.tracks.filter((track: { id: string }) => {
            const features = audioFeatures[track.id];
            if (!features) return true; // Garde les tracks sans features

            // Calcule la distance par rapport aux valeurs cibles
            let distance = 0;
            let criteriaCount = 0;

            if (targetDanceability) {
                const target = parseFloat(targetDanceability);
                distance += Math.abs(features.danceability - target);
                criteriaCount++;
            }

            if (targetEnergy) {
                const target = parseFloat(targetEnergy);
                distance += Math.abs(features.energy - target);
                criteriaCount++;
            }

            if (targetValence) {
                const target = parseFloat(targetValence);
                distance += Math.abs(features.valence - target);
                criteriaCount++;
            }

            // Accepte les tracks avec une distance moyenne < 0.3 (tolérance)
            const avgDistance = criteriaCount > 0 ? distance / criteriaCount : 0;
            return avgDistance < 0.3;
        });

        // Trie par popularité et pertinence
        filteredTracks.sort((a: any, b: any) => {
            const popA = a.popularity || 0;
            const popB = b.popularity || 0;
            return popB - popA;
        });

        // Limite au nombre demandé
        filteredTracks = filteredTracks.slice(0, targetLimit);

        console.log(`[D3] ${filteredTracks.length} tracks après filtrage sur ${data.tracks.length}`);

        // Transforme les données en format simplifié (D3)
        const tracks: RecommendedTrack[] = filteredTracks.map((track: {
            id: string;
            name: string;
            artists?: Array<{ id: string; name: string }>;
            album?: {
                name?: string;
                images?: Array<{ url: string }>;
            };
            duration_ms?: number;
            preview_url?: string | null;
            external_urls?: { spotify?: string };
        }) => ({
            id: track.id,
            name: track.name,
            artists: track.artists?.map((a) => ({ id: a.id, name: a.name })) || [],
            albumName: track.album?.name || '',
            albumImageUrl: track.album?.images?.[0]?.url || null,
            duration_ms: track.duration_ms || 0,
            previewUrl: track.preview_url || null,
            externalUrl: track.external_urls?.spotify || '',
            energy: audioFeatures[track.id]?.energy ?? undefined,
        }));

        const result: RecommendationsResponse = {
            tracks,
            seeds: [], // Pas de seeds dans la solution alternative
        };

        console.log('[D3] Recommandations générées (mode alternatif):', tracks.length, 'titres');
        return NextResponse.json(result);
    } catch (error) {
        console.error('[D3] Erreur fetch recommendations:', error);
        return NextResponse.json({ error: 'FETCH_ERROR' }, { status: 500 });
    }
}
