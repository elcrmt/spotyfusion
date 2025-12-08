// GET /api/spotify/me/player/recently-played - Récupère les derniers titres écoutés (B3)

import { NextRequest, NextResponse } from 'next/server';

// Type simplifié pour un titre récemment écouté (B3)
export interface RecentTrack {
  id: string;
  name: string;
  albumName: string;
  albumImageUrl: string | null;
  artists: Array<{ id: string; name: string }>;
  playedAt: string; // ISO 8601 timestamp
  duration_ms: number;
  externalUrl: string;
}

export interface RecentlyPlayedResponse {
  items: RecentTrack[];
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

  // Récupère le paramètre limit (par défaut 5 pour B3)
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit') || '5';

  try {
    // Appel à l'API Spotify
    const params = new URLSearchParams({
      limit: limit,
    });

    const response = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Token expiré ou invalide
    if (response.status === 401) {
      console.error('[B3] Token Spotify invalide ou expiré');
      return NextResponse.json({ error: 'TOKEN_EXPIRED' }, { status: 401 });
    }

    if (!response.ok) {
      console.error('[B3] Erreur Spotify recently-played:', response.status);
      return NextResponse.json(
        { error: 'SPOTIFY_ERROR' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transforme les données en format simplifié (B3)
    const items: RecentTrack[] = data.items.map((item: {
      played_at: string;
      track: {
        id: string;
        name: string;
        album?: {
          name?: string;
          images?: Array<{ url: string }>;
        };
        artists?: Array<{ id: string; name: string }>;
        duration_ms?: number;
        external_urls?: { spotify?: string };
      };
    }) => ({
      id: item.track.id,
      name: item.track.name,
      albumName: item.track.album?.name || '',
      albumImageUrl: item.track.album?.images?.[0]?.url || null,
      artists: item.track.artists?.map((a) => ({ id: a.id, name: a.name })) || [],
      playedAt: item.played_at,
      duration_ms: item.track.duration_ms || 0,
      externalUrl: item.track.external_urls?.spotify || '',
    }));

    const result: RecentlyPlayedResponse = {
      items,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('[B3] Erreur fetch recently-played:', error);
    return NextResponse.json({ error: 'FETCH_ERROR' }, { status: 500 });
  }
}
