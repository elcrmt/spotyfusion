'use client';

/**
 * SpotyFusion - Authentication Context
 *
 * This context manages the authentication state for the entire application.
 * It will handle Spotify OAuth tokens and user profile data.
 *
 * TODO: Implement real OAuth flow with PKCE
 * TODO: Implement token refresh logic
 * TODO: Implement persistent session storage
 *
 * @module context/AuthContext
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import type { SpotifyUser, AuthTokens } from '@/lib/spotify/types';

// ================================
// Types
// ================================

interface AuthContextType {
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;

  /** Whether authentication state is being loaded */
  isLoading: boolean;

  /** Current user profile (null if not authenticated) */
  user: SpotifyUser | null;

  /** Current access token (null if not authenticated) */
  accessToken: string | null;

  /**
   * Initiates the Spotify OAuth login flow
   * TODO: Implement PKCE flow
   */
  login: () => void;

  /**
   * Logs out the user and clears all tokens
   */
  logout: () => void;

  /**
   * Sets authentication tokens after successful OAuth callback
   * TODO: Implement when handling OAuth callback
   */
  setTokens: (tokens: AuthTokens) => void;

  /**
   * Refreshes the access token using the refresh token
   * TODO: Implement token refresh logic
   */
  refreshAccessToken: () => Promise<void>;
}

// ================================
// Mock Data (for development)
// ================================

/**
 * Mock user for development purposes
 * Remove this when implementing real authentication
 */
const MOCK_USER: SpotifyUser = {
  id: 'mock-user-id',
  display_name: 'Demo User',
  email: 'demo@spotyfusion.dev',
  country: 'FR',
  external_urls: { spotify: 'https://open.spotify.com/user/mock-user-id' },
  followers: { href: null, total: 42 },
  href: 'https://api.spotify.com/v1/users/mock-user-id',
  images: [
    {
      url: 'https://i.pravatar.cc/300',
      height: 300,
      width: 300,
    },
  ],
  product: 'premium',
  type: 'user',
  uri: 'spotify:user:mock-user-id',
};

// ================================
// Context Creation
// ================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ================================
// Provider Component
// ================================

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider - Wraps the app and provides authentication state
 *
 * Usage:
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // ================================
  // State
  // ================================

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [_refreshToken, setRefreshToken] = useState<string | null>(null);
  const [_expiresAt, setExpiresAt] = useState<number | null>(null);

  // Derived state
  const isAuthenticated = !!accessToken && !!user;

  // ================================
  // Effects
  // ================================

  /**
   * Initialize auth state on mount
   * TODO: Check for existing session in localStorage/cookies
   * TODO: Validate and refresh tokens if needed
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // TODO: Implement real session restoration
        // For now, check localStorage for mock auth state
        const storedAuth = localStorage.getItem('spotyfusion_auth');

        if (storedAuth) {
          const { user: storedUser, accessToken: storedToken } =
            JSON.parse(storedAuth);
          setUser(storedUser);
          setAccessToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to restore auth session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ================================
  // Methods
  // ================================

  /**
   * Initiates the Spotify OAuth login flow
   *
   * TODO: Implement real PKCE flow:
   * 1. Generate code_verifier and code_challenge
   * 2. Store code_verifier in sessionStorage
   * 3. Redirect to Spotify authorization URL with:
   *    - client_id
   *    - response_type=code
   *    - redirect_uri
   *    - code_challenge_method=S256
   *    - code_challenge
   *    - scope
   *    - state (for CSRF protection)
   */
  const login = useCallback(() => {
    console.log('TODO: Implement Spotify OAuth PKCE flow');

    // For development: simulate login with mock data
    // Remove this block when implementing real OAuth
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      const mockToken = 'mock-access-token-' + Date.now();
      setUser(MOCK_USER);
      setAccessToken(mockToken);
      setRefreshToken('mock-refresh-token');
      setExpiresAt(Date.now() + 3600000); // 1 hour from now

      // Persist mock auth state
      localStorage.setItem(
        'spotyfusion_auth',
        JSON.stringify({
          user: MOCK_USER,
          accessToken: mockToken,
        })
      );

      console.log('Mock login successful');
      return;
    }

    // TODO: Real implementation
    // const codeVerifier = generateCodeVerifier();
    // const codeChallenge = await generateCodeChallenge(codeVerifier);
    // sessionStorage.setItem('code_verifier', codeVerifier);
    //
    // const params = new URLSearchParams({
    //   client_id: spotifyConfig.clientId,
    //   response_type: 'code',
    //   redirect_uri: spotifyConfig.redirectUri,
    //   code_challenge_method: 'S256',
    //   code_challenge: codeChallenge,
    //   scope: spotifyConfig.scopes.join(' '),
    //   state: generateRandomString(16),
    // });
    //
    // window.location.href = `${spotifyConfig.authUrl}?${params}`;
  }, []);

  /**
   * Logs out the user and clears all authentication state
   */
  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresAt(null);

    // Clear persisted auth state
    localStorage.removeItem('spotyfusion_auth');

    // TODO: Optionally revoke token on Spotify's end

    console.log('User logged out');
  }, []);

  /**
   * Sets authentication tokens after successful OAuth callback
   *
   * TODO: Implement when handling the /callback route:
   * 1. Exchange authorization code for tokens
   * 2. Fetch user profile
   * 3. Call this method with the tokens
   */
  const setTokens = useCallback((tokens: AuthTokens) => {
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    setExpiresAt(tokens.expiresAt);

    // TODO: Fetch user profile with the new access token
    // const profile = await spotifyClient.getCurrentUser(tokens.accessToken);
    // setUser(profile);

    console.log('TODO: Set tokens and fetch user profile');
  }, []);

  /**
   * Refreshes the access token using the refresh token
   *
   * TODO: Implement token refresh:
   * 1. POST to Spotify token endpoint with:
   *    - grant_type=refresh_token
   *    - refresh_token
   *    - client_id
   * 2. Update tokens in state
   * 3. Update persisted session
   */
  const refreshAccessToken = useCallback(async () => {
    console.log('TODO: Implement token refresh');

    // TODO: Real implementation
    // if (!refreshToken) {
    //   throw new Error('No refresh token available');
    // }
    //
    // const response = await fetch(spotifyConfig.tokenUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: new URLSearchParams({
    //     grant_type: 'refresh_token',
    //     refresh_token: refreshToken,
    //     client_id: spotifyConfig.clientId,
    //   }),
    // });
    //
    // const data = await response.json();
    // setAccessToken(data.access_token);
    // setExpiresAt(Date.now() + data.expires_in * 1000);
    // if (data.refresh_token) {
    //   setRefreshToken(data.refresh_token);
    // }
  }, []);

  // ================================
  // Context Value
  // ================================

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    accessToken,
    login,
    logout,
    setTokens,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ================================
// Custom Hook
// ================================

/**
 * useAuth - Hook to access authentication context
 *
 * @throws Error if used outside of AuthProvider
 *
 * Usage:
 * ```tsx
 * const { isAuthenticated, user, login, logout } = useAuth();
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default AuthContext;
