// GET /api/spotify/me/playlists - Récupère les playlists de l'utilisateur (C1)

import { NextRequest, NextResponse } from 'next/server';

// Type simplifié pour une playlist
export interface PlaylistItem {
    id: string;
    name: string;
    imageUrl: string | null;
    tracksCount: number;
    owner: string;
}

export interface PlaylistsResponse {
    items: PlaylistItem[];
    total: number;
}

export async function GET(request: NextRequest) {
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

    try {
        // Récupère les playlists de l'utilisateur (limite 50)
        const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.status === 401) {
            console.error('[C1] Token Spotify invalide ou expiré');
            return NextResponse.json({ error: 'TOKEN_EXPIRED' }, { status: 401 });
        }

        if (!response.ok) {
            console.error('[C1] Erreur Spotify:', response.status);
            return NextResponse.json(
                { error: 'SPOTIFY_ERROR' },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Transforme les données pour ne garder que l'essentiel
        const playlists: PlaylistItem[] = data.items
            .filter((item: any) => item && item.tracks.total > 0) // Filtre les playlists vides
            .map((item: any) => ({
                id: item.id,
                name: item.name,
                imageUrl: item.images?.[0]?.url || null,
                tracksCount: item.tracks.total,
                owner: item.owner?.display_name || 'Unknown',
            }));

        const result: PlaylistsResponse = {
            items: playlists,
            total: playlists.length,
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('[C1] Erreur fetch playlists:', error);
        return NextResponse.json({ error: 'FETCH_ERROR' }, { status: 500 });
    }
}
