// GET /api/spotify/me/top/tracks - Récupère les top tracks de l'utilisateur (B1)

import { NextRequest, NextResponse } from 'next/server';

// Type simplifié pour un track du top (B1)
export interface TopTrack {
  id: string;
  name: string;
  albumName: string;
  albumImageUrl: string | null;
  artists: Array<{ id: string; name: string }>;
  duration_ms: number;
  popularity: number;
  previewUrl: string | null;
  externalUrl: string;
}

export interface TopTracksResponse {
  items: TopTrack[];
  total: number;
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

  // Récupère les paramètres de query (optionnels)
  const searchParams = request.nextUrl.searchParams;
  const timeRange = searchParams.get('time_range') || 'medium_term';
  const limit = searchParams.get('limit') || '10';

  try {
    // Appel à l'API Spotify
    const params = new URLSearchParams({
      time_range: timeRange,
      limit: limit,
    });

    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Token expiré ou invalide
    if (response.status === 401) {
      console.error('[B1] Token Spotify invalide ou expiré');
      return NextResponse.json({ error: 'TOKEN_EXPIRED' }, { status: 401 });
    }

    if (!response.ok) {
      console.error('[B1] Erreur Spotify top/tracks:', response.status);
      return NextResponse.json(
        { error: 'SPOTIFY_ERROR' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transforme les données en format simplifié (B1)
    const items: TopTrack[] = data.items.map((track: {
      id: string;
      name: string;
      album?: {
        name?: string;
        images?: Array<{ url: string }>;
      };
      artists?: Array<{ id: string; name: string }>;
      duration_ms?: number;
      popularity?: number;
      preview_url?: string | null;
      external_urls?: { spotify?: string };
    }) => ({
      id: track.id,
      name: track.name,
      albumName: track.album?.name || '',
      albumImageUrl: track.album?.images?.[0]?.url || null,
      artists: track.artists?.map((a) => ({ id: a.id, name: a.name })) || [],
      duration_ms: track.duration_ms || 0,
      popularity: track.popularity || 0,
      previewUrl: track.preview_url || null,
      externalUrl: track.external_urls?.spotify || '',
    }));

    const result: TopTracksResponse = {
      items,
      total: data.total,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('[B1] Erreur fetch top/tracks:', error);
    return NextResponse.json({ error: 'FETCH_ERROR' }, { status: 500 });
  }
}
