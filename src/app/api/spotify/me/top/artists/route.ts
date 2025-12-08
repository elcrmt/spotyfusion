// GET /api/spotify/me/top/artists - Récupère les top artistes de l'utilisateur (B1)

import { NextRequest, NextResponse } from 'next/server';

// Type simplifié pour un artiste du top (B1)
export interface TopArtist {
  id: string;
  name: string;
  imageUrl: string | null;
  genres: string[];
  popularity: number;
  externalUrl: string;
}

export interface TopArtistsResponse {
  items: TopArtist[];
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
      `https://api.spotify.com/v1/me/top/artists?${params}`,
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
      console.error('[B1] Erreur Spotify top/artists:', response.status);
      return NextResponse.json(
        { error: 'SPOTIFY_ERROR' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transforme les données en format simplifié (B1)
    const items: TopArtist[] = data.items.map((artist: {
      id: string;
      name: string;
      images?: Array<{ url: string }>;
      genres?: string[];
      popularity?: number;
      external_urls?: { spotify?: string };
    }) => ({
      id: artist.id,
      name: artist.name,
      imageUrl: artist.images?.[0]?.url || null,
      genres: artist.genres || [],
      popularity: artist.popularity || 0,
      externalUrl: artist.external_urls?.spotify || '',
    }));

    const result: TopArtistsResponse = {
      items,
      total: data.total,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('[B1] Erreur fetch top/artists:', error);
    return NextResponse.json({ error: 'FETCH_ERROR' }, { status: 500 });
  }
}
