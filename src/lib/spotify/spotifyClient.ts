// Client Spotify pour les appels API

import { spotifyConfig } from '@/config/env';
import type {
  SpotifyUser,
  SpotifyArtist,
  SpotifyTrack,
  SpotifyPlaylist,
  SpotifyPlayHistory,
  SpotifyRecommendations,
  SpotifyAudioFeatures,
  PaginatedResponse,
  CursorPaginatedResponse,
  TimeRange,
  RecommendationsParams,
  SpotifyApiError,
} from './types';

// ================================
// Types A3
// ================================

// Profil utilisateur simplifié (A3)
export interface SpotifyUserProfile {
  id: string;
  displayName: string | null;
  imageUrl: string | null;
  product: 'premium' | 'free' | 'open' | null;
}

// ================================
// Types B1
// ================================

// Top artiste simplifié (B1)
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

// Top track simplifié (B1)
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

// Type pour la période de temps
export type TopTimeRange = 'short_term' | 'medium_term' | 'long_term';

// ================================
// Types B3
// ================================

// Titre récemment écouté (B3)
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

// ================================
// Client Functions A3
// ================================

// Récupère le profil de l'utilisateur connecté (A3)
export async function fetchCurrentUserProfile(): Promise<SpotifyUserProfile> {
  const response = await fetch('/api/spotify/me');

  if (response.status === 401) {
    throw new Error('UNAUTHENTICATED');
  }

  if (!response.ok) {
    throw new Error('FETCH_PROFILE_ERROR');
  }

  return response.json();
}

// ================================
// Client Functions B1
// ================================

// Récupère les top artistes de l'utilisateur (B1)
export async function fetchTopArtists(
  timeRange: TopTimeRange = 'medium_term',
  limit: number = 10
): Promise<TopArtistsResponse> {
  const params = new URLSearchParams({
    time_range: timeRange,
    limit: limit.toString(),
  });

  const response = await fetch(`/api/spotify/me/top/artists?${params}`);

  if (response.status === 401) {
    throw new Error('UNAUTHENTICATED');
  }

  if (!response.ok) {
    throw new Error('FETCH_TOP_ARTISTS_ERROR');
  }

  return response.json();
}

// Récupère les top tracks de l'utilisateur (B1)
export async function fetchTopTracks(
  timeRange: TopTimeRange = 'medium_term',
  limit: number = 10
): Promise<TopTracksResponse> {
  const params = new URLSearchParams({
    time_range: timeRange,
    limit: limit.toString(),
  });

  const response = await fetch(`/api/spotify/me/top/tracks?${params}`);

  if (response.status === 401) {
    throw new Error('UNAUTHENTICATED');
  }

  if (!response.ok) {
    throw new Error('FETCH_TOP_TRACKS_ERROR');
  }

  return response.json();
}

// ================================
// Client Functions B3
// ================================

// Récupère les titres récemment écoutés (B3)
export async function fetchRecentlyPlayed(
  limit: number = 5
): Promise<RecentlyPlayedResponse> {
  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  const response = await fetch(`/api/spotify/me/player/recently-played?${params}`);

  if (response.status === 401) {
    throw new Error('UNAUTHENTICATED');
  }

  if (!response.ok) {
    throw new Error('FETCH_RECENTLY_PLAYED_ERROR');
  }

  return response.json();
}

// ================================
// HTTP Client Base
// ================================

/**
 * Base fetch function for Spotify API calls
 *
 * TODO: Implement token refresh logic
 * TODO: Add proper error handling for rate limits (429)
 *
 * @param endpoint - API endpoint (without base URL)
 * @param accessToken - User's access token
 * @param options - Additional fetch options
 */
async function spotifyFetch<T>(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${spotifyConfig.apiBaseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // Handle errors
  if (!response.ok) {
    const error: SpotifyApiError = await response.json();
    throw new Error(
      `Spotify API Error: ${error.error.status} - ${error.error.message}`
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ================================
// User Profile
// ================================

/**
 * Get the current user's profile
 *
 * TODO: Implement when auth is ready
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
 */
export async function getCurrentUser(
  accessToken: string
): Promise<SpotifyUser> {
  // TODO: Uncomment when ready to implement
  // return spotifyFetch<SpotifyUser>('/me', accessToken);

  // Placeholder for development
  console.log('TODO: Implement getCurrentUser API call');
  throw new Error('Not implemented yet');
}

// ================================
// Top Items (User's Stats)
// ================================

/**
 * Get the current user's top artists
 *
 * TODO: Implement when auth is ready
 *
 * @param accessToken - User's access token
 * @param timeRange - Over what time frame ('short_term', 'medium_term', 'long_term')
 * @param limit - Number of items to return (max 50)
 * @param offset - Index of the first item to return
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
 */
export async function getTopArtists(
  accessToken: string,
  timeRange: TimeRange = 'medium_term',
  limit: number = 20,
  offset: number = 0
): Promise<PaginatedResponse<SpotifyArtist>> {
  // TODO: Uncomment when ready to implement
  // const params = new URLSearchParams({
  //   time_range: timeRange,
  //   limit: limit.toString(),
  //   offset: offset.toString(),
  // });
  // return spotifyFetch<PaginatedResponse<SpotifyArtist>>(
  //   `/me/top/artists?${params}`,
  //   accessToken
  // );

  console.log('TODO: Implement getTopArtists API call');
  throw new Error('Not implemented yet');
}

/**
 * Get the current user's top tracks
 *
 * TODO: Implement when auth is ready
 *
 * @param accessToken - User's access token
 * @param timeRange - Over what time frame
 * @param limit - Number of items to return (max 50)
 * @param offset - Index of the first item to return
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
 */
export async function getTopTracks(
  accessToken: string,
  timeRange: TimeRange = 'medium_term',
  limit: number = 20,
  offset: number = 0
): Promise<PaginatedResponse<SpotifyTrack>> {
  // TODO: Uncomment when ready to implement
  // const params = new URLSearchParams({
  //   time_range: timeRange,
  //   limit: limit.toString(),
  //   offset: offset.toString(),
  // });
  // return spotifyFetch<PaginatedResponse<SpotifyTrack>>(
  //   `/me/top/tracks?${params}`,
  //   accessToken
  // );

  console.log('TODO: Implement getTopTracks API call');
  throw new Error('Not implemented yet');
}

// ================================
// Recently Played
// ================================

/**
 * Get the current user's recently played tracks
 *
 * TODO: Implement when auth is ready
 *
 * @param accessToken - User's access token
 * @param limit - Number of items to return (max 50)
 * @param before - Unix timestamp in ms - returns items before this cursor position
 * @param after - Unix timestamp in ms - returns items after this cursor position
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/get-recently-played
 */
export async function getRecentlyPlayed(
  accessToken: string,
  limit: number = 20,
  before?: number,
  after?: number
): Promise<CursorPaginatedResponse<SpotifyPlayHistory>> {
  // TODO: Uncomment when ready to implement
  // const params = new URLSearchParams({ limit: limit.toString() });
  // if (before) params.append('before', before.toString());
  // if (after) params.append('after', after.toString());
  //
  // return spotifyFetch<CursorPaginatedResponse<SpotifyPlayHistory>>(
  //   `/me/player/recently-played?${params}`,
  //   accessToken
  // );

  console.log('TODO: Implement getRecentlyPlayed API call');
  throw new Error('Not implemented yet');
}

// ================================
// Playlists
// ================================

/**
 * Get the current user's playlists
 *
 * TODO: Implement when auth is ready
 *
 * @param accessToken - User's access token
 * @param limit - Number of items to return (max 50)
 * @param offset - Index of the first item to return
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists
 */
export async function getUserPlaylists(
  accessToken: string,
  limit: number = 20,
  offset: number = 0
): Promise<PaginatedResponse<SpotifyPlaylist>> {
  // TODO: Uncomment when ready to implement
  // const params = new URLSearchParams({
  //   limit: limit.toString(),
  //   offset: offset.toString(),
  // });
  // return spotifyFetch<PaginatedResponse<SpotifyPlaylist>>(
  //   `/me/playlists?${params}`,
  //   accessToken
  // );

  console.log('TODO: Implement getUserPlaylists API call');
  throw new Error('Not implemented yet');
}

/**
 * Get a playlist by ID
 *
 * TODO: Implement when auth is ready
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/get-playlist
 */
export async function getPlaylist(
  accessToken: string,
  playlistId: string
): Promise<SpotifyPlaylist> {
  // TODO: Uncomment when ready to implement
  // return spotifyFetch<SpotifyPlaylist>(`/playlists/${playlistId}`, accessToken);

  console.log('TODO: Implement getPlaylist API call');
  throw new Error('Not implemented yet');
}

/**
 * Create a new playlist
 *
 * TODO: Implement when auth is ready
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/create-playlist
 */
export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description?: string,
  isPublic: boolean = false
): Promise<SpotifyPlaylist> {
  // TODO: Uncomment when ready to implement
  // return spotifyFetch<SpotifyPlaylist>(
  //   `/users/${userId}/playlists`,
  //   accessToken,
  //   {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       name,
  //       description,
  //       public: isPublic,
  //     }),
  //   }
  // );

  console.log('TODO: Implement createPlaylist API call');
  throw new Error('Not implemented yet');
}

/**
 * Add tracks to a playlist
 *
 * TODO: Implement when auth is ready
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist
 */
export async function addTracksToPlaylist(
  accessToken: string,
  playlistId: string,
  trackUris: string[]
): Promise<{ snapshot_id: string }> {
  // TODO: Uncomment when ready to implement
  // return spotifyFetch<{ snapshot_id: string }>(
  //   `/playlists/${playlistId}/tracks`,
  //   accessToken,
  //   {
  //     method: 'POST',
  //     body: JSON.stringify({ uris: trackUris }),
  //   }
  // );

  console.log('TODO: Implement addTracksToPlaylist API call');
  throw new Error('Not implemented yet');
}

// ================================
// Recommendations
// ================================

/**
 * Get track recommendations based on seeds and audio features
 *
 * TODO: Implement when auth is ready
 *
 * @param accessToken - User's access token
 * @param params - Recommendation parameters (seeds, targets, limits)
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/get-recommendations
 */
export async function getRecommendations(
  accessToken: string,
  params: RecommendationsParams
): Promise<SpotifyRecommendations> {
  // TODO: Uncomment when ready to implement
  // const searchParams = new URLSearchParams();
  //
  // // Add seeds
  // if (params.seed_artists?.length) {
  //   searchParams.append('seed_artists', params.seed_artists.join(','));
  // }
  // if (params.seed_genres?.length) {
  //   searchParams.append('seed_genres', params.seed_genres.join(','));
  // }
  // if (params.seed_tracks?.length) {
  //   searchParams.append('seed_tracks', params.seed_tracks.join(','));
  // }
  //
  // // Add other params
  // if (params.limit) searchParams.append('limit', params.limit.toString());
  // if (params.target_energy !== undefined) {
  //   searchParams.append('target_energy', params.target_energy.toString());
  // }
  // // ... add other params
  //
  // return spotifyFetch<SpotifyRecommendations>(
  //   `/recommendations?${searchParams}`,
  //   accessToken
  // );

  console.log('TODO: Implement getRecommendations API call');
  throw new Error('Not implemented yet');
}

/**
 * Get available genre seeds for recommendations
 *
 * TODO: Implement when auth is ready
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/get-recommendation-genres
 */
export async function getAvailableGenreSeeds(
  accessToken: string
): Promise<{ genres: string[] }> {
  // TODO: Uncomment when ready to implement
  // return spotifyFetch<{ genres: string[] }>(
  //   '/recommendations/available-genre-seeds',
  //   accessToken
  // );

  console.log('TODO: Implement getAvailableGenreSeeds API call');
  throw new Error('Not implemented yet');
}

// ================================
// Audio Features
// ================================

/**
 * Get audio features for a track
 *
 * TODO: Implement when auth is ready
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/get-audio-features
 */
export async function getAudioFeatures(
  accessToken: string,
  trackId: string
): Promise<SpotifyAudioFeatures> {
  // TODO: Uncomment when ready to implement
  // return spotifyFetch<SpotifyAudioFeatures>(
  //   `/audio-features/${trackId}`,
  //   accessToken
  // );

  console.log('TODO: Implement getAudioFeatures API call');
  throw new Error('Not implemented yet');
}

/**
 * Get audio features for multiple tracks
 *
 * TODO: Implement when auth is ready
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/get-several-audio-features
 */
export async function getMultipleAudioFeatures(
  accessToken: string,
  trackIds: string[]
): Promise<{ audio_features: SpotifyAudioFeatures[] }> {
  // TODO: Uncomment when ready to implement
  // const params = new URLSearchParams({ ids: trackIds.join(',') });
  // return spotifyFetch<{ audio_features: SpotifyAudioFeatures[] }>(
  //   `/audio-features?${params}`,
  //   accessToken
  // );

  console.log('TODO: Implement getMultipleAudioFeatures API call');
  throw new Error('Not implemented yet');
}

// ================================
// Search
// ================================

/**
 * Search for tracks, artists, albums, or playlists
 *
 * TODO: Implement when auth is ready
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/search
 */
export async function search(
  accessToken: string,
  query: string,
  types: Array<'album' | 'artist' | 'playlist' | 'track'> = ['track'],
  limit: number = 20
): Promise<{
  tracks?: PaginatedResponse<SpotifyTrack>;
  artists?: PaginatedResponse<SpotifyArtist>;
}> {
  // TODO: Uncomment when ready to implement
  // const params = new URLSearchParams({
  //   q: query,
  //   type: types.join(','),
  //   limit: limit.toString(),
  // });
  // return spotifyFetch(`/search?${params}`, accessToken);

  console.log('TODO: Implement search API call');
  throw new Error('Not implemented yet');
}

// ================================
// Tracks
// ================================

/**
 * Get a track by ID
 *
 * TODO: Implement when auth is ready
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/get-track
 */
export async function getTrack(
  accessToken: string,
  trackId: string
): Promise<SpotifyTrack> {
  // TODO: Uncomment when ready to implement
  // return spotifyFetch<SpotifyTrack>(`/tracks/${trackId}`, accessToken);

  console.log('TODO: Implement getTrack API call');
  throw new Error('Not implemented yet');
}

// ================================
// Export all functions
// ================================

const spotifyClient = {
  // User
  getCurrentUser,
  // Top Items
  getTopArtists,
  getTopTracks,
  // Recently Played
  getRecentlyPlayed,
  // Playlists
  getUserPlaylists,
  getPlaylist,
  createPlaylist,
  addTracksToPlaylist,
  // Recommendations
  getRecommendations,
  getAvailableGenreSeeds,
  // Audio Features
  getAudioFeatures,
  getMultipleAudioFeatures,
  // Search
  search,
  // Tracks
  getTrack,
};

export default spotifyClient;
