// GET /api/spotify/search - Recherche artistes, tracks et genres (D2)

import { NextRequest, NextResponse } from 'next/server';

// Types pour les résultats de recherche (D2)
export interface SearchArtist {
  id: string;
  name: string;
  type: 'artist';
  imageUrl: string | null;
}

export interface SearchTrack {
  id: string;
  name: string;
  type: 'track';
  artists: string[];
  imageUrl: string | null;
}

export interface SearchResult {
  artists: SearchArtist[];
  tracks: SearchTrack[];
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
  const query = searchParams.get('q');
  const types = searchParams.get('type') || 'artist,track'; // Par défaut: artistes et tracks
  const limit = searchParams.get('limit') || '5';

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: 'MISSING_QUERY' }, { status: 400 });
  }

  try {
    // Appel à l'API Spotify
    const params = new URLSearchParams({
      q: query,
      type: types,
      limit: limit,
    });

    const response = await fetch(
      `https://api.spotify.com/v1/search?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Token expiré ou invalide
    if (response.status === 401) {
      console.error('[D2] Token Spotify invalide ou expiré');
      return NextResponse.json({ error: 'TOKEN_EXPIRED' }, { status: 401 });
    }

    if (!response.ok) {
      console.error('[D2] Erreur Spotify search:', response.status);
      return NextResponse.json(
        { error: 'SPOTIFY_ERROR' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transforme les données en format simplifié (D2)
    const artists: SearchArtist[] = data.artists?.items.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      type: 'artist' as const,
      imageUrl: artist.images?.[0]?.url || null,
    })) || [];

    const tracks: SearchTrack[] = data.tracks?.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      type: 'track' as const,
      artists: track.artists?.map((a: any) => a.name) || [],
      imageUrl: track.album?.images?.[0]?.url || null,
    })) || [];

    const result: SearchResult = {
      artists,
      tracks,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('[D2] Erreur fetch search:', error);
    return NextResponse.json({ error: 'FETCH_ERROR' }, { status: 500 });
  }
}
