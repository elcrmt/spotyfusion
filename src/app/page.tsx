'use client';

// Page d'accueil - Login Spotify
// Redirige vers /dashboard si déjà connecté

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Music2 } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();

  // Redirige vers dashboard si déjà connecté
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Loader pendant la vérification
  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-green-500" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Gradient de fond - du haut (vert) vers le bas (noir) */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/30 via-green-950/10 to-black" />
      
      {/* Image de fond positionnée à droite */}
      <div className="absolute top-0 right-0 w-1/2 h-2/3 opacity-40">
        <Image
          src="/fond.png"
          alt="Background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Card centrale avec contenu */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 sm:p-12 text-center shadow-2xl">
          {/* Icône musicale verte */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
              <Music2 className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-4xl font-bold text-white mb-4">
            SpotyFusion
          </h1>

          {/* Description */}
          <p className="text-zinc-400 text-sm leading-relaxed mb-8 px-4">
            Enrichissez votre expérience Spotify avec des statistiques détaillées, des blind tests et un générateur de playlists intelligent
          </p>

          {/* Bouton de connexion */}
          <button
            onClick={login}
            className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-3.5 px-6 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Se Connecter avec Spotify
          </button>

          {/* Note en bas */}
          <p className="text-zinc-500 text-xs mt-6">
            Vous serez redirigé vers Spotify pour autoriser l'accès
          </p>
        </div>
      </div>
    </div>
  );
}
