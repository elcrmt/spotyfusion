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

        console.log('[D3] Appel recommendations avec params:', params.toString());

        // Appel à l'API Spotify Recommendations
        const response = await fetch(
            `https://api.spotify.com/v1/recommendations?${params}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Token expiré ou invalide
        if (response.status === 401) {
            console.error('[D3] Token Spotify invalide ou expiré');
            return NextResponse.json({ error: 'TOKEN_EXPIRED' }, { status: 401 });
        }

        // Erreur 400 : paramètres invalides
        if (response.status === 400) {
            const errorData = await response.json();
            console.error('[D3] Paramètres invalides:', errorData);
            return NextResponse.json(
                {
                    error: 'INVALID_PARAMS',
                    message: 'Combinaison de paramètres invalide. Vérifiez vos semences et caractéristiques audio.'
                },
                { status: 400 }
            );
        }

        // Erreur 404 : API Recommendations restreinte par Spotify (depuis Nov 2024)
        if (response.status === 404) {
            console.error('[D3] API Recommendations non accessible (restriction Spotify)');
            return NextResponse.json(
                {
                    error: 'API_RESTRICTED',
                    message: 'L\'API Spotify Recommendations n\'est plus accessible. Depuis novembre 2024, Spotify a restreint cet endpoint aux applications avec "Extended Quota Mode". Contactez Spotify Developer pour demander l\'accès étendu.'
                },
                { status: 403 }
            );
        }

        if (!response.ok) {
            console.error('[D3] Erreur Spotify recommendations:', response.status);
            return NextResponse.json(
                { error: 'SPOTIFY_ERROR', message: `Erreur Spotify (code ${response.status})` },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Récupère les IDs des tracks pour obtenir les audio features
        const trackIds = data.tracks.map((track: { id: string }) => track.id).join(',');

        // Appel pour récupérer les audio features (pour l'energy score)
        let audioFeatures: Record<string, number> = {};

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
                    // Crée un map id -> energy
                    featuresData.audio_features?.forEach((feature: { id: string; energy: number } | null) => {
                        if (feature) {
                            audioFeatures[feature.id] = feature.energy;
                        }
                    });
                }
            } catch (err) {
                console.warn('[D3] Impossible de récupérer les audio features:', err);
                // Continue sans les features, ce n'est pas bloquant
            }
        }

        // Transforme les données en format simplifié (D3)
        const tracks: RecommendedTrack[] = data.tracks.map((track: {
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
            energy: audioFeatures[track.id] ?? undefined,
        }));

        const result: RecommendationsResponse = {
            tracks,
            seeds: data.seeds?.map((seed: { id: string; type: string }) => ({
                id: seed.id,
                type: seed.type,
            })) || [],
        };

        console.log('[D3] Recommandations générées:', tracks.length, 'titres');
        return NextResponse.json(result);
    } catch (error) {
        console.error('[D3] Erreur fetch recommendations:', error);
        return NextResponse.json({ error: 'FETCH_ERROR' }, { status: 500 });
    }
}
