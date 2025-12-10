/**
 * SpotyFusion - Spotify API Types
 *
 * TypeScript interfaces for Spotify Web API entities.
 * Based on: https://developer.spotify.com/documentation/web-api
 *
 * @module lib/spotify/types
 */

// ================================
// Base Types
// ================================

/**
 * Spotify Image object
 * Images can be in different sizes (64x64, 300x300, 640x640)
 */
export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

/**
 * External URLs object
 */
export interface ExternalUrls {
  spotify: string;
}

/**
 * External IDs object (ISRC, EAN, UPC)
 */
export interface ExternalIds {
  isrc?: string;
  ean?: string;
  upc?: string;
}

/**
 * Followers object
 */
export interface Followers {
  href: string | null;
  total: number;
}

// ================================
// User Types
// ================================

/**
 * Spotify User Profile
 * @see https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
 */
export interface SpotifyUser {
  id: string;
  display_name: string | null;
  email?: string;
  country?: string;
  external_urls: ExternalUrls;
  followers?: Followers;
  href: string;
  images: SpotifyImage[];
  product?: 'free' | 'premium' | 'open';
  type: 'user';
  uri: string;
}

// ================================
// Artist Types
// ================================

/**
 * Simplified Artist object (used in tracks, albums)
 */
export interface SpotifyArtistSimplified {
  id: string;
  name: string;
  external_urls: ExternalUrls;
  href: string;
  type: 'artist';
  uri: string;
}

/**
 * Full Artist object
 * @see https://developer.spotify.com/documentation/web-api/reference/get-an-artist
 */
export interface SpotifyArtist extends SpotifyArtistSimplified {
  followers: Followers;
  genres: string[];
  images: SpotifyImage[];
  popularity: number;
}

// ================================
// Album Types
// ================================

/**
 * Album types
 */
export type AlbumType = 'album' | 'single' | 'compilation';

/**
 * Simplified Album object (used in tracks)
 */
export interface SpotifyAlbumSimplified {
  id: string;
  name: string;
  album_type: AlbumType;
  total_tracks: number;
  available_markets?: string[];
  external_urls: ExternalUrls;
  href: string;
  images: SpotifyImage[];
  release_date: string;
  release_date_precision: 'year' | 'month' | 'day';
  type: 'album';
  uri: string;
  artists: SpotifyArtistSimplified[];
}

/**
 * Full Album object
 * @see https://developer.spotify.com/documentation/web-api/reference/get-an-album
 */
export interface SpotifyAlbum extends SpotifyAlbumSimplified {
  genres: string[];
  label: string;
  popularity: number;
  copyrights: Array<{ text: string; type: string }>;
  external_ids: ExternalIds;
  tracks: PaginatedResponse<SpotifyTrackSimplified>;
}

// ================================
// Track Types
// ================================

/**
 * Simplified Track object
 */
export interface SpotifyTrackSimplified {
  id: string;
  name: string;
  artists: SpotifyArtistSimplified[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  is_local: boolean;
  is_playable?: boolean;
  preview_url: string | null;
  track_number: number;
  type: 'track';
  uri: string;
}

/**
 * Full Track object
 * @see https://developer.spotify.com/documentation/web-api/reference/get-track
 */
export interface SpotifyTrack extends SpotifyTrackSimplified {
  album: SpotifyAlbumSimplified;
  external_ids: ExternalIds;
  popularity: number;
}

/**
 * Track with played_at timestamp (for recently played)
 */
export interface SpotifyPlayHistory {
  track: SpotifyTrack;
  played_at: string;
  context: SpotifyContext | null;
}

/**
 * Context object (what the user was playing from)
 */
export interface SpotifyContext {
  type: 'artist' | 'playlist' | 'album' | 'show';
  href: string;
  external_urls: ExternalUrls;
  uri: string;
}

// ================================
// Audio Features Types
// ================================

/**
 * Audio Features for a track
 * @see https://developer.spotify.com/documentation/web-api/reference/get-audio-features
 */
export interface SpotifyAudioFeatures {
  id: string;
  uri: string;
  track_href: string;
  analysis_url: string;
  duration_ms: number;
  time_signature: number;
  // Key: -1 = no key, 0 = C, 1 = C#/Db, 2 = D, etc.
  key: number;
  // Mode: 0 = minor, 1 = major
  mode: number;
  // All these are 0.0 to 1.0
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number; // dB, typically -60 to 0
  speechiness: number;
  valence: number;
  tempo: number; // BPM
}

// ================================
// Playlist Types
// ================================

/**
 * Simplified Playlist object
 */
export interface SpotifyPlaylistSimplified {
  id: string;
  name: string;
  description: string | null;
  external_urls: ExternalUrls;
  href: string;
  images: SpotifyImage[];
  owner: SpotifyUser;
  public: boolean | null;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: 'playlist';
  uri: string;
  collaborative: boolean;
}

/**
 * Full Playlist object
 * @see https://developer.spotify.com/documentation/web-api/reference/get-playlist
 */
export interface SpotifyPlaylist extends SpotifyPlaylistSimplified {
  followers: Followers;
  tracks: PaginatedResponse<SpotifyPlaylistTrack>;
}

/**
 * Playlist Track object (track with added_at and added_by)
 */
export interface SpotifyPlaylistTrack {
  added_at: string | null;
  added_by: SpotifyUser | null;
  is_local: boolean;
  track: SpotifyTrack | null;
}

// ================================
// Recommendations Types
// ================================

/**
 * Recommendations request parameters
 * @see https://developer.spotify.com/documentation/web-api/reference/get-recommendations
 */
export interface RecommendationsParams {
  // Seeds (at least one required, max 5 total)
  seed_artists?: string[];
  seed_genres?: string[];
  seed_tracks?: string[];
  // Limit
  limit?: number;
  // Target attributes (0.0 - 1.0 unless noted)
  target_acousticness?: number;
  target_danceability?: number;
  target_energy?: number;
  target_instrumentalness?: number;
  target_liveness?: number;
  target_loudness?: number; // dB
  target_speechiness?: number;
  target_tempo?: number; // BPM
  target_valence?: number;
  // Min/Max attributes
  min_energy?: number;
  max_energy?: number;
  min_danceability?: number;
  max_danceability?: number;
  min_valence?: number;
  max_valence?: number;
  // ... more min/max options available
}

/**
 * Recommendations response
 */
export interface SpotifyRecommendations {
  seeds: Array<{
    id: string;
    type: 'artist' | 'track' | 'genre';
    href: string | null;
    initialPoolSize: number;
    afterFilteringSize: number;
    afterRelinkingSize: number;
  }>;
  tracks: SpotifyTrack[];
}

// ================================
// Paginated Response Types
// ================================

/**
 * Generic paginated response from Spotify API
 */
export interface PaginatedResponse<T> {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

/**
 * Cursor-based pagination (used for play history)
 */
export interface CursorPaginatedResponse<T> {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  cursors: {
    after: string | null;
    before: string | null;
  };
  total?: number;
}

// ================================
// API Error Types
// ================================

/**
 * Spotify API Error response
 */
export interface SpotifyApiError {
  error: {
    status: number;
    message: string;
  };
}

// ================================
// Time Range Type
// ================================

/**
 * Time range for top items
 */
export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

// ================================
// App-specific Types
// ================================

/**
 * Authentication tokens stored in the app
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp
}

/**
 * Mood parameters for the playlist generator
 */
export interface MoodParams {
  energy: number; // 0-1
  danceability: number; // 0-1
  valence: number; // 0-1 (happiness)
}

/**
 * Blind test question
 */
export interface BlindTestQuestion {
  track: SpotifyTrack;
  options: string[]; // Track names to choose from
  correctIndex: number;
}

/**
 * Blind test game state
 */
export interface BlindTestState {
  questions: BlindTestQuestion[];
  currentQuestionIndex: number;
  score: number;
  isFinished: boolean;
}
