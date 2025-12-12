# 🎧 SpotyFusion - Présentation Orale

---

## 📌 SLIDE 1 : Introduction & Stack Technique

### SpotyFusion - Votre compagnon Spotify

**Qu'est-ce que c'est ?**
Application web qui se connecte à votre compte Spotify pour offrir :
- 📊 Un **Dashboard** avec vos statistiques d'écoute
- 🎵 Un **Blind Test** musical basé sur vos playlists  
- 🎨 Un **Générateur de Playlist** selon votre humeur

### Stack Technique

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Next.js** | 16.x | Framework React (App Router) |
| **React** | 19.x | Bibliothèque UI |
| **TypeScript** | 5.x | Typage statique |
| **Tailwind CSS** | 4.x | Styling utilitaire |
| **Lucide React** | - | Icônes |
| **Spotify Web API** | - | API Spotify |

---

## 📌 SLIDE 2 : Module A - Authentification (11 pts)

### ✅ US A1 - Login OAuth (5 pts)
- Bouton **"Se connecter avec Spotify"** sur la page d'accueil
- Flux **PKCE** (Proof Key for Code Exchange) sécurisé
- Stockage du token via **cookies HttpOnly**
- Redirection automatique vers le Dashboard

### ✅ US A2 - Navigation (2 pts)
- **Sidebar fixe** avec liens vers les 3 fonctionnalités
- Navigation **SPA** (Single Page Application) sans rechargement
- État actif visuel sur la route courante

### ✅ US A3 - Profil utilisateur (3 pts)
- Affichage du **nom** et **photo de profil**
- Badge **Premium ⭐** ou **Free**
- Route API : `GET /api/spotify/me`

### ✅ US A4 - Logout (1 pt)
- Suppression des cookies de session
- Redirection vers la page de login

---

## 📌 SLIDE 3 : Module B - Dashboard Personnel (9 pts)

### ✅ US B1 - Top 10 Artistes & Titres (3 pts)
- Affichage des **Top 10 artistes** avec photo, genres, popularité
- Affichage des **Top 10 titres** avec pochette, artiste, durée
- Routes : `GET /me/top/artists` et `GET /me/top/tracks`

### ✅ US B2 - Filtres temporels (3 pts)
3 périodes sélectionnables via boutons :
| Période | Paramètre API |
|---------|---------------|
| 4 dernières semaines | `short_term` |
| 6 derniers mois | `medium_term` |
| Depuis toujours | `long_term` |

### ✅ US B3 - Recently Played (3 pts)
- 5 derniers titres écoutés avec **horodatage** ("Il y a 5 min", "Il y a 2h")
- Pochette, nom du titre, artiste
- Route : `GET /me/player/recently-played`

---

## 📌 SLIDE 4 : Module C - Blind Test Musical (19 pts)

### ✅ US C1 - Sélection Playlist (3 pts)
- Liste des playlists personnelles via `GET /me/playlists`
- Affichage pochette, nom, nombre de titres

### ✅ US C2 - Extrait Audio 30s (5 pts)
- Lecture automatique via `<audio>` HTML5
- Utilisation de la `preview_url` des tracks
- Barre de progression visuelle

### ✅ US C3 - Choix 4 réponses (5 pts)
- 1 bonne réponse + 3 distracteurs
- Distracteurs choisis aléatoirement dans la playlist

### ✅ US C4 - Score & Feedback (3 pts)
- **Vert** = bonne réponse, **Rouge** = mauvaise
- Score affiché en temps réel

### ✅ US C5 - Fin de partie (3 pts)
- 10 questions par partie
- Écran final avec score + bouton **Rejouer**

---

## 📌 SLIDE 5 : Module D - Générateur de Playlists (21 pts)

### ✅ US D1 - Réglages Audio (3 pts)
3 sliders visuels (0.0 à 1.0) :
| Paramètre | Description |
|-----------|-------------|
| **Danceability** | Adapté à la danse |
| **Energy** | Intensité du morceau |
| **Valence** | Humeur (triste → joyeux) |

### ✅ US D2 - Seeds / Semences (5 pts)
- Recherche auto-complétée via `GET /search`
- Sélection jusqu'à **5 semences** (artistes ou titres)
- Tags visuels supprimables

### ✅ US D3 - Génération Recommandations (5 pts)
- **20-50 résultats** basés sur les critères
- Affichage : Titre, Artiste, **Energy Score** (barre visuelle)
- Gestion des erreurs 400 (paramètres invalides)
- *Note : API Recommendations restreinte par Spotify depuis Nov 2024 → Solution alternative implémentée*

### ⏳ US D4 - Sauvegarde Playlist (8 pts) - *À implémenter*
- `POST /users/{id}/playlists` pour créer
- `POST /playlists/{id}/tracks` pour ajouter les titres

---

## 📌 SLIDE 6 : Architecture & Points Techniques

### Architecture du Projet
```
src/
├── app/                    # Next.js App Router
│   ├── (app)/              # Routes protégées (authentifiées)
│   │   ├── dashboard/      # Page statistiques
│   │   ├── blind-test/     # Page quiz musical
│   │   └── mood-generator/ # Page générateur
│   ├── api/                # Routes API (Backend)
│   │   ├── auth/           # OAuth (login, callback, logout)
│   │   └── spotify/        # Proxy vers Spotify API
│   └── page.tsx            # Page de login
├── components/             # Composants React réutilisables
├── context/                # AuthContext (gestion session)
├── lib/                    # Logique métier (spotifyClient, PKCE)
└── config/                 # Variables d'environnement
```

### Points Techniques Clés
| Aspect | Solution |
|--------|----------|
| **Auth sécurisée** | PKCE Flow + Cookies HttpOnly |
| **Tokens** | Stockés côté serveur, pas exposés au client |
| **API Proxy** | Routes `/api/spotify/*` pour éviter CORS |
| **Design** | Thème sombre Spotify + Couleur verte #1db954 |
| **Responsive** | Layout adaptatif mobile/desktop |

### Récapitulatif Points
| Module | Points | Status |
|--------|--------|--------|
| A - Auth & Navigation | 11 pts | ✅ Complet |
| B - Dashboard | 9 pts | ✅ Complet |
| C - Blind Test | 19 pts | ✅ Complet |
| D - Générateur | 21 pts | ⏳ 13/21 (D4 restant) |
| **TOTAL** | **60 pts** | **~52 pts implémentés** |

---

## 🎤 Notes pour l'Oral

**Points à mentionner :**
1. **Choix de Next.js 16** : App Router moderne, Server Components, Routes API intégrées
2. **Sécurité PKCE** : Plus sécurisé que l'Implicit Grant, recommandé par Spotify
3. **TypeScript** : Typage fort pour éviter les bugs, auto-complétion dans l'IDE
4. **Tailwind CSS 4** : Styling rapide, design system cohérent
5. **Architecture proxy** : Les appels à Spotify passent par notre serveur pour sécuriser les tokens

**Démo suggérée :**
1. Login avec Spotify
2. Montrer le Dashboard (Top 10 + filtres temporels)
3. Lancer un Blind Test rapide (2-3 questions)
4. Configurer et générer une playlist avec le Mood Generator
