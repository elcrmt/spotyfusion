// GET /api/spotify/playlists/[id]/tracks - Récupère les tracks d'une playlist (C1)

import { NextRequest, NextResponse } from 'next/server';

// Type simplifié pour un track de playlist
export interface PlaylistTrackItem {
    id: string;
    name: string;
    artists: string[];
    albumName: string;
    albumImageUrl: string | null;
    previewUrl: string | null;
}

export interface PlaylistTracksResponse {
    items: PlaylistTrackItem[];
    total: number;
    totalWithPreview: number;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: playlistId } = await params;
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
        // Récupère les tracks de la playlist (limite 100)
        const response = await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&fields=items(track(id,name,artists(name),album(name,images),preview_url)),total`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

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

        // Transforme TOUS les tracks (pas de filtre sur preview_url)
        const tracks: PlaylistTrackItem[] = data.items
            .filter((item: any) => item?.track?.id && item?.track?.name)
            .map((item: any) => ({
                id: item.track.id,
                name: item.track.name,
                artists: item.track.artists?.map((a: any) => a.name) || [],
                albumName: item.track.album?.name || '',
                albumImageUrl: item.track.album?.images?.[0]?.url || null,
                previewUrl: item.track.preview_url || null,
            }));

        const tracksWithPreview = tracks.filter(t => t.previewUrl).length;
        console.log(`[C1] Playlist ${playlistId}: ${tracksWithPreview}/${tracks.length} tracks avec preview`);

        const result: PlaylistTracksResponse = {
            items: tracks,
            total: tracks.length,
            totalWithPreview: tracksWithPreview,
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('[C1] Erreur fetch playlist tracks:', error);
        return NextResponse.json({ error: 'FETCH_ERROR' }, { status: 500 });
    }
}

