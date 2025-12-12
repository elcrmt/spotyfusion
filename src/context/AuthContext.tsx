'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  fetchCurrentUserProfile,
  SpotifyUserProfile,
} from '@/lib/spotify/spotifyClient';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  expiresAt: number | null;
  user: SpotifyUserProfile | null;
  isLoadingUser: boolean;
  login: () => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [user, setUser] = useState<SpotifyUserProfile | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
      setExpiresAt(data.expiresAt || null);
    } catch (error) {
      console.error('[Auth] Erreur session:', error);
      setIsAuthenticated(false);
      setExpiresAt(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    setIsLoadingUser(true);
    try {
      const profile = await fetchCurrentUserProfile();
      setUser(profile);
    } catch (error) {
      console.error('Erreur profil:', error);
      // Si 401 = session invalide, on appelle logout pour supprimer le cookie
      if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
        setIsAuthenticated(false);
        setUser(null);
        // Appelle /api/auth/logout pour supprimer le cookie session
        window.location.href = '/api/auth/logout';
      }
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchUserProfile();
    }
  }, [isAuthenticated, isLoading, fetchUserProfile]);

  const login = useCallback(() => {
    window.location.href = '/api/auth/login';
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    window.location.href = '/api/auth/logout';
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    expiresAt,
    user,
    isLoadingUser,
    login,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook pour utiliser le contexte d'auth
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}

export default AuthContext;
