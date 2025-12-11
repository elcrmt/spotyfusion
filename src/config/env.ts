/**
 * SpotyFusion - Environment Configuration
 *
 * This module provides type-safe access to environment variables.
 * All Spotify API and app configuration is centralized here.
 *
 * @module config/env
 */

/**
 * Spotify API Configuration
 * These values come from your Spotify Developer Dashboard
 */
export const spotifyConfig = {
  /**
   * Spotify Application Client ID
   * This is public and safe to expose in the browser
   */
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? '',

  /**
   * OAuth redirect URI - must match Spotify Dashboard settings
   */
  redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI ?? 'http://localhost:3000/callback',

  /**
   * Spotify Web API base URL
   */
  apiBaseUrl: process.env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL ?? 'https://api.spotify.com/v1',

  /**
   * Spotify Authorization endpoint
   */
  authUrl: process.env.NEXT_PUBLIC_SPOTIFY_AUTH_URL ?? 'https://accounts.spotify.com/authorize',

  /**
   * Spotify Token endpoint
   */
  tokenUrl: process.env.NEXT_PUBLIC_SPOTIFY_TOKEN_URL ?? 'https://accounts.spotify.com/api/token',

  /**
   * OAuth scopes required by the application
   * @see https://developer.spotify.com/documentation/web-api/concepts/scopes
   */
  scopes: (process.env.SPOTIFY_SCOPES
    ? process.env.SPOTIFY_SCOPES.split(' ')
    : [
      // User profile
      'user-read-private',
      'user-read-email',
      // User's top items
      'user-top-read',
      // Listening history
      'user-read-recently-played',
      'user-read-playback-state',
      'user-read-currently-playing',
      'user-modify-playback-state', // Requis pour contrôler le playback
      'streaming',                  // Requis pour le Web Playback SDK
      // Playlists
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-modify-private',
      // Library
      'user-library-read',
    ]),
} as const;

/**
 * Application Configuration
 */
export const appConfig = {
  /**
   * Application name
   */
  name: process.env.NEXT_PUBLIC_APP_NAME ?? 'SpotyFusion',

  /**
   * Application base URL
   */
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',

  /**
   * Whether to use mock data (for development without Spotify API)
   */
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
} as const;

/**
 * Validates that all required environment variables are set
 * Call this function during app initialization
 *
 * @returns {boolean} True if all required env vars are set
 */
export function validateEnvVariables(): boolean {
  const requiredVars = ['NEXT_PUBLIC_SPOTIFY_CLIENT_ID'];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(
      `⚠️ Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Copy .env.example to .env.local and fill in the values.'
    );
    return false;
  }

  return true;
}

/**
 * Helper to check if we're running in development mode
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Helper to check if we're running in production mode
 */
export const isProduction = process.env.NODE_ENV === 'production';
