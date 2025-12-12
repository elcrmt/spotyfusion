# 👨‍💻 Dev 2 — Explication Technique : Dashboard + Mood Generator

---

## 📊 MODULE B — DASHBOARD PERSONNEL

---

### 🔵 US B1 — Affichage Top 10 Artistes & Titres (3 pts)

#### Comment ça fonctionne ?

**1. Flux de données :**
```
[Composant React] → [API Route Next.js] → [API Spotify] → [Réponse JSON]
     TopArtists.tsx    /api/spotify/me/top/artists    api.spotify.com
```

**2. Côté Client (`src/components/Dashboard/TopArtists.tsx`) :**
```typescript
// Hook useEffect pour charger les données au montage
useEffect(() => {
  async function loadTopArtists() {
    setIsLoading(true);
    const data = await fetchTopArtists(timeRange, 10); // Appel client
    setArtists(data.items);
    setIsLoading(false);
  }
  loadTopArtists();
}, [timeRange]); // Se recharge quand on change de période
```

**3. Fonction Client (`src/lib/spotify/spotifyClient.ts`) :**
```typescript
export async function fetchTopArtists(timeRange, limit) {
  const params = new URLSearchParams({
    time_range: timeRange,  // "short_term" | "medium_term" | "long_term"
    limit: limit.toString(), // "10"
  });
  
  const response = await fetch(`/api/spotify/me/top/artists?${params}`);
  return response.json();
}
```

**4. API Route (`src/app/api/spotify/me/top/artists/route.ts`) :**
```typescript
export async function GET(request: NextRequest) {
  // 1. Récupère le token depuis le cookie de session
  const session = JSON.parse(request.cookies.get('sf_session')?.value);
  const { accessToken } = session;
  
  // 2. Appelle l'API Spotify avec le token
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  
  // 3. Transforme les données en format simplifié
  const data = await response.json();
  const items = data.items.map(artist => ({
    id: artist.id,
    name: artist.name,
    imageUrl: artist.images?.[0]?.url,
    genres: artist.genres,
    popularity: artist.popularity,
  }));
  
  return NextResponse.json({ items, total: data.total });
}
```

**5. Affichage :**
- Chaque artiste = 1 ligne avec : Rang, Photo, Nom, Genres, Popularité 🔥
- Clic sur un artiste → ouvre Spotify dans un nouvel onglet

---

### 🔵 US B2 — Filtres Temporels (3 pts)

#### Comment ça fonctionne ?

**1. État React dans la page Dashboard :**
```typescript
// src/app/(app)/dashboard/page.tsx
const [timeRange, setTimeRange] = useState<TopTimeRange>('medium_term');
```

**2. 3 boutons qui changent l'état :**
```tsx
<button onClick={() => setTimeRange('short_term')}>4 semaines</button>
<button onClick={() => setTimeRange('medium_term')}>6 mois</button>
<button onClick={() => setTimeRange('long_term')}>Tout le temps</button>
```

**3. Passage en prop aux composants enfants :**
```tsx
<TopArtists timeRange={timeRange} />
<TopTracks timeRange={timeRange} />
```

**4. Le composant se recharge automatiquement :**
```typescript
// Dans TopArtists.tsx
useEffect(() => {
  loadTopArtists();
}, [timeRange]); // ← Dépendance : quand timeRange change, on refait l'appel API
```

**Mapping des valeurs :**
| Bouton UI | Valeur API | Signification Spotify |
|-----------|------------|----------------------|
| 4 dernières semaines | `short_term` | ~4 semaines |
| 6 derniers mois | `medium_term` | ~6 mois |
| Depuis toujours | `long_term` | Plusieurs années |

---

### 🔵 US B3 — Recently Played (3 pts)

#### Comment ça fonctionne ?

**1. Endpoint Spotify différent :**
```
GET https://api.spotify.com/v1/me/player/recently-played?limit=5
```

**2. API Route (`src/app/api/spotify/me/player/recently-played/route.ts`) :**
```typescript
export async function GET(request: NextRequest) {
  const response = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=5`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  
  const data = await response.json();
  
  // Transformation : on extrait played_at pour l'horodatage
  const items = data.items.map(item => ({
    id: item.track.id,
    name: item.track.name,
    artists: item.track.artists,
    albumImageUrl: item.track.album.images?.[0]?.url,
    playedAt: item.played_at, // ← ISO 8601 timestamp
  }));
  
  return NextResponse.json({ items });
}
```

**3. Formatage de l'horodatage côté client :**
```typescript
// src/components/Dashboard/RecentlyPlayed.tsx
function formatPlayedAt(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMinutes = Math.floor((now - date) / 60000);
  
  if (diffMinutes < 1) return "À l'instant";
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  // etc.
}
```

---

## 🎨 MODULE D — GÉNÉRATEUR DE PLAYLISTS

---

### 🟣 US D1 — Formulaire de Réglages Audio (3 pts)

#### Comment ça fonctionne ?

**1. État React pour les 3 sliders :**
```typescript
// src/app/(app)/mood-generator/page.tsx
const [currentFeatures, setCurrentFeatures] = useState<AudioFeatures>({
  danceability: 0.5, // Valeur par défaut : milieu
  energy: 0.5,
  valence: 0.5,
});
```

**2. Composant AudioFeaturesForm (`src/components/MoodGenerator/AudioFeaturesForm.tsx`) :**
```tsx
// Configuration des 3 sliders
const sliderConfig = [
  {
    key: 'danceability',
    label: '💃 Danceability',
    description: 'Adapté à la danse',
    color: 'from-purple-500 to-pink-500',
  },
  {
    key: 'energy',
    label: '⚡ Energy',
    description: 'Intensité du morceau',
    color: 'from-orange-500 to-red-500',
  },
  {
    key: 'valence',
    label: '😊 Valence',
    description: 'Humeur (triste → joyeux)',
    color: 'from-blue-500 to-green-500',
  },
];
```

**3. Input Range HTML :**
```tsx
<input
  type="range"
  min={0}
  max={100}
  value={features.energy * 100}  // Converti 0.0-1.0 en 0-100
  onChange={(e) => handleChange('energy', e.target.value / 100)}
/>
```

**4. Barre de progression colorée CSS :**
```css
/* Style custom pour le slider */
input[type='range']::-webkit-slider-thumb {
  background-color: #1db954; /* Vert Spotify */
  width: 16px;
  height: 16px;
  border-radius: 50%;
}
```

---

### 🟣 US D2 — Seeds / Semences (5 pts)

#### Comment ça fonctionne ?

**1. Concept de "Semences" :**
L'API Spotify Recommendations a besoin de "graines" pour générer des recommandations :
- **seed_artists** : IDs d'artistes
- **seed_tracks** : IDs de titres  
- **seed_genres** : Noms de genres

Maximum 5 semences au total.

**2. Composant SeedSelector (`src/components/MoodGenerator/SeedSelector.tsx`) :**
```typescript
// État local pour la recherche
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState({ artists: [], tracks: [] });

// Debounce : attend 300ms après la dernière frappe avant de chercher
useEffect(() => {
  const timer = setTimeout(() => {
    if (searchQuery.length >= 2) {
      searchSpotify(searchQuery).then(setSearchResults);
    }
  }, 300);
  return () => clearTimeout(timer);
}, [searchQuery]);
```

**3. API de recherche (`src/app/api/spotify/search/route.ts`) :**
```typescript
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');
  
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=artist,track&limit=5`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  
  const data = await response.json();
  
  return NextResponse.json({
    artists: data.artists.items.map(a => ({
      id: a.id,
      name: a.name,
      type: 'artist',
      imageUrl: a.images?.[0]?.url,
    })),
    tracks: data.tracks.items.map(t => ({
      id: t.id,
      name: t.name,
      type: 'track',
      artists: t.artists.map(a => a.name),
      imageUrl: t.album.images?.[0]?.url,
    })),
  });
}
```

**4. Gestion des tags sélectionnés :**
```tsx
// Affichage des seeds sélectionnées
{seeds.map(seed => (
  <span className="tag">
    {seed.type === 'artist' ? '🎤' : '🎵'} {seed.name}
    <button onClick={() => removeSeed(seed.id)}>×</button>
  </span>
))}
```

---

### 🟣 US D3 — Génération des Recommandations (5 pts)

#### Comment ça fonctionne ?

**1. Au clic sur "Générer" :**
```typescript
// src/app/(app)/mood-generator/page.tsx
const handleSubmit = async (features: AudioFeatures) => {
  setIsLoading(true);
  
  // Sépare les seeds par type
  const seedArtists = seeds.filter(s => s.type === 'artist').map(s => s.id);
  const seedTracks = seeds.filter(s => s.type === 'track').map(s => s.id);
  
  const result = await fetchRecommendations({
    seedArtists,
    seedTracks,
    targetDanceability: features.danceability,
    targetEnergy: features.energy,
    targetValence: features.valence,
    limit: 30,
  });
  
  setRecommendations(result.tracks);
  setIsLoading(false);
};
```

**2. API Route Recommendations (`src/app/api/spotify/recommendations/route.ts`) :**

⚠️ **Note importante** : L'API Spotify `/recommendations` est restreinte depuis Nov 2024.
On utilise une **solution alternative** :

```typescript
export async function GET(request: NextRequest) {
  // SOLUTION ALTERNATIVE (sans /recommendations)
  
  // 1. Récupère les top tracks des artistes seeds
  for (const artistId of seedArtists) {
    const topTracks = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=FR`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    allTracks.push(...topTracks.tracks);
  }
  
  // 2. Récupère les audio features pour filtrer
  const features = await fetch(
    `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  
  // 3. Filtre selon les critères (danceability, energy, valence)
  const filteredTracks = allTracks.filter(track => {
    const f = audioFeatures[track.id];
    const distance = 
      Math.abs(f.danceability - targetDanceability) +
      Math.abs(f.energy - targetEnergy) +
      Math.abs(f.valence - targetValence);
    return distance / 3 < 0.3; // Tolérance de 30%
  });
  
  // 4. Trie par popularité
  filteredTracks.sort((a, b) => b.popularity - a.popularity);
  
  return NextResponse.json({ tracks: filteredTracks.slice(0, 30) });
}
```

**3. Affichage des résultats (`src/components/MoodGenerator/RecommendationsList.tsx`) :**
```tsx
{tracks.map((track, index) => (
  <li key={track.id}>
    <span>{index + 1}</span>
    <Image src={track.albumImageUrl} />
    <div>
      <p>{track.name}</p>
      <p>{track.artists.map(a => a.name).join(', ')}</p>
    </div>
    <EnergyScore energy={track.energy} /> {/* Barre visuelle */}
    <span>{formatDuration(track.duration_ms)}</span>
  </li>
))}
```

**4. Composant EnergyScore :**
```tsx
function EnergyScore({ energy }: { energy?: number }) {
  const percent = Math.round(energy * 100);
  
  // Couleur selon le niveau
  const gradient = percent >= 70 
    ? 'from-orange-500 to-red-500'    // Haute énergie = rouge
    : percent >= 40 
      ? 'from-yellow-500 to-orange-500' // Moyenne = orange
      : 'from-blue-500 to-cyan-500';    // Basse = bleu
  
  return (
    <div className="flex items-center gap-1">
      <Zap className="w-3.5 h-3.5" />
      <div className="w-12 h-1.5 bg-zinc-700 rounded-full">
        <div className={`h-full bg-gradient-to-r ${gradient}`} 
             style={{ width: `${percent}%` }} />
      </div>
      <span>{percent}%</span>
    </div>
  );
}
```

---

## 📐 Schéma d'Architecture Simplifié

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVIGATEUR                              │
├─────────────────────────────────────────────────────────────────┤
│  Dashboard Page          │  Mood Generator Page                 │
│  ┌───────────────────┐   │  ┌────────────────────────────────┐  │
│  │ TopArtists.tsx    │   │  │ AudioFeaturesForm.tsx          │  │
│  │ TopTracks.tsx     │   │  │ SeedSelector.tsx               │  │
│  │ RecentlyPlayed.tsx│   │  │ RecommendationsList.tsx        │  │
│  └───────────────────┘   │  └────────────────────────────────┘  │
│           │              │              │                       │
│           ▼              │              ▼                       │
│  spotifyClient.ts        │     spotifyClient.ts                 │
│  fetchTopArtists()       │     fetchRecommendations()           │
│  fetchRecentlyPlayed()   │     searchSpotify()                  │
└───────────┬──────────────┴──────────────┬───────────────────────┘
            │                             │
            ▼                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVEUR NEXT.JS (API Routes)                │
├─────────────────────────────────────────────────────────────────┤
│  /api/spotify/me/top/artists    │  /api/spotify/recommendations │
│  /api/spotify/me/top/tracks     │  /api/spotify/search          │
│  /api/spotify/me/player/...     │                               │
│                                 │                               │
│  📌 Lit le token depuis le cookie sf_session                   │
│  📌 Appelle l'API Spotify avec Authorization: Bearer           │
│  📌 Transforme les données en format simplifié                 │
└───────────┬─────────────────────────────┬───────────────────────┘
            │                             │
            ▼                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API SPOTIFY                                │
│  https://api.spotify.com/v1/...                                │
│  - /me/top/artists                                              │
│  - /me/top/tracks                                               │
│  - /me/player/recently-played                                   │
│  - /artists/{id}/top-tracks                                     │
│  - /audio-features                                              │
│  - /search                                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎤 Points Clés pour l'Oral (Dev 2)

1. **Pourquoi un proxy API ?**
   - Sécurité : le token n'est jamais exposé au navigateur
   - Évite les problèmes CORS
   - Permet de transformer les données avant de les renvoyer

2. **Comment fonctionne le filtrage temporel ?**
   - État React `timeRange` qui change au clic
   - Passé en prop aux composants enfants
   - `useEffect` avec dépendance sur `timeRange` → nouvel appel API

3. **Comment fonctionne la recherche de seeds ?**
   - Input contrôlé avec debounce (300ms)
   - Appel à `/api/spotify/search` après 2 caractères minimum
   - Résultats affichés en dropdown
   - Sélection ajoute au tableau de seeds (max 5)

4. **Pourquoi une solution alternative pour D3 ?**
   - API `/recommendations` restreinte par Spotify (Nov 2024)
   - Solution : récupérer les top tracks des artistes seeds
   - Filtrer avec les audio features récupérées via `/audio-features`
   - Trier par popularité et proximité aux critères

5. **Comment s'affiche l'Energy Score ?**
   - Valeur 0.0 à 1.0 convertie en pourcentage
   - Barre de progression avec gradient de couleur
   - Rouge = haute énergie, Bleu = basse énergie
