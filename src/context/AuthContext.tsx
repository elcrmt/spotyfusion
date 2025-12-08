'use client';

// Contexte d'authentification pour gérer l'état de connexion dans toute l'app

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  expiresAt: number | null;
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

  // Vérifie la session au chargement
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Redirige vers Spotify pour se connecter
  const login = useCallback(() => {
    window.location.href = '/api/auth/login';
  }, []);

  // Déconnecte l'utilisateur
  const logout = useCallback(() => {
    window.location.href = '/api/auth/logout';
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    expiresAt,
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
