'use client';

// Contexte d'authentification + profil utilisateur (A1 + A3)

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
  user: SpotifyUserProfile | null; // A3
  isLoadingUser: boolean; // A3
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
  const [user, setUser] = useState<SpotifyUserProfile | null>(null); // A3
  const [isLoadingUser, setIsLoadingUser] = useState(false); // A3

  // Récupère l'état de la session depuis le serveur
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

  // Récupère le profil utilisateur Spotify (A3)
  const fetchUserProfile = useCallback(async () => {
    setIsLoadingUser(true);
    try {
      const profile = await fetchCurrentUserProfile();
      setUser(profile);
    } catch (error) {
      console.error('[A3] Erreur profil:', error);
      // Si 401 = session invalide, on déconnecte
      if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
        setIsAuthenticated(false);
        setUser(null);
        // TODO: améliorer le refresh / logout dans A4
        window.location.href = '/';
      }
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  // Vérifie la session au chargement
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Charge le profil quand l'utilisateur est authentifié (A3)
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchUserProfile();
    }
  }, [isAuthenticated, isLoading, fetchUserProfile]);

  // Redirige vers Spotify pour se connecter
  const login = useCallback(() => {
    window.location.href = '/api/auth/login';
  }, []);

  // Déconnecte l'utilisateur
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
