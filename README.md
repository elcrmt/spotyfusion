# 🎧 SpotyFusion

> Votre compagnon Spotify - Statistiques, Blind Test et Générateur de Playlists

SpotyFusion est une application web moderne qui se connecte à votre compte Spotify pour vous offrir :
- 📊 Un **Dashboard** avec vos statistiques d'écoute personnelles
- 🎵 Un **Blind Test** musical basé sur vos playlists
- 🎨 Un **Générateur de Playlist** selon votre humeur

## 🛠️ Stack Technique

| Technologie | Version | Description |
|-------------|---------|-------------|
| [Next.js](https://nextjs.org/) | 16.x | Framework React avec App Router |
| [React](https://react.dev/) | 19.x | Bibliothèque UI |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Typage statique |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Styling utilitaire |
| [Spotify Web API](https://developer.spotify.com/documentation/web-api/) | - | API Spotify |

## 📋 Prérequis

- **Node.js** : v18.x ou supérieur (recommandé : v20.x)
- **npm** : v9.x ou supérieur
- **Compte Spotify Developer** : Pour obtenir les credentials de l'API

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/elcrmt/spotyfusion.git
cd spotyfusion
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env.local

# Éditer .env.local avec vos credentials Spotify
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🔐 Spotify Auth Setup (A1)

### Étape 1 : Configurer .env.local

```bash
# Spotify API Configuration
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=votre_client_id_ici
SPOTIFY_CLIENT_SECRET=votre_client_secret_ici
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/auth/callback
SPOTIFY_SCOPES=user-read-private user-read-email user-top-read user-read-recently-played playlist-read-private playlist-modify-public playlist-modify-private

# App Configuration
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
```

### Étape 2 : Vérifier la Redirect URI

⚠️ **Important** : La Redirect URI dans Spotify Dashboard doit correspondre **exactement** à `SPOTIFY_REDIRECT_URI` dans votre `.env.local` :

```
http://127.0.0.1:3000/api/auth/callback
```


## 📁 Structure du Projet

```
spotyfusion/
├── src/
│   ├── app/
│   │   ├── api/auth/           # Routes API d'authentification
│   │   │   ├── login/route.ts  # Initie le flux OAuth
│   │   │   ├── callback/route.ts # Gère le callback Spotify
│   │   │   ├── session/route.ts  # Retourne l'état de session
│   │   │   └── logout/route.ts   # Déconnexion
│   │   ├── dashboard/page.tsx  # Page protégée
│   │   ├── layout.tsx          # Layout racine
│   │   ├── page.tsx            # Page d'accueil / Login
│   │   ├── providers.tsx       # Context providers
│   │   └── globals.css         # Styles globaux
│   │
│   ├── components/
│   │   └── Common/             # Composants génériques
│   │
│   ├── context/
│   │   └── AuthContext.tsx     # Contexte d'authentification
│   │
│   ├── lib/
│   │   ├── auth/
│   │   │   └── pkce.ts         # Utilitaires PKCE
│   │   └── spotify/
│   │       ├── spotifyClient.ts
│   │       └── types.ts
│   │
│   └── config/
│       └── env.ts
│
├── .env.example
├── .env.local                  # (non versionné)
```
