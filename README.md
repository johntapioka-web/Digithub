# DFX — Cyber-Shogun · Brand Visuals

Implémentation **statique et autonome** (HTML / CSS / JS, aucune dépendance, aucun build)
de la charte validée **Cyan Glace + Galaxie** pour le projet DJ **DFX (Dark Fen'X)**.

Issu d'un export Claude Design (`project/DFX Cyber-Shogun.dc.html`) — voir `chats/` et
`project/` pour la source d'origine et l'historique de conception.

## Deux pages

- **`landing.html`** — le **site vitrine** Dark Fen'X (loading screen animé, hero, mixes, tour,
  galerie, stats, contact). Adapté de la structure d'une landing React/GSAP, mais en
  **HTML/CSS/JS statique** (les libs React/Vite/GSAP/hls.js n'étaient pas installables dans
  l'environnement) : animations en JS/CSS natif, et fond galaxie animé à la place de la vidéo HLS.
- **`index.html`** — le **kit de marque** (7 visuels réseaux + pack avatar, panneau Tweaks,
  glisser-déposer, export PNG). La galerie de `landing.html` pointe vers ce kit.

> Pour faire de la vitrine la page d'accueil sur Netlify : renomme `landing.html` → `index.html`
> et le kit actuel → `kit.html` (et mets à jour les liens). Sinon, les deux cohabitent.

`LOGO-brief-image-gen.md` contient le brief d'art-direction (rééquilibrage tête de lecture/VU +
couleurs VU métallisées) à donner à une session de génération d'image pour la v2 photoréaliste du logo.

## Lancer

Ouvre simplement `index.html` (kit) ou `landing.html` (vitrine) dans un navigateur. Aucune installation requise.
Une connexion réseau permet de charger les polices Google (Orbitron / Montserrat /
Chakra Petch) ; hors-ligne, le rendu se rabat sur des polices système.

## Les 7 visuels

| ID | Format | Dimensions |
|----|--------|-----------|
| 2a | Bannière YouTube — emblème centré symétrique | 2560 × 1440 |
| 2b | Bannière YouTube — editorial, lame de lumière cyan | 2560 × 1440 |
| 2c | Header artiste Spotify | 2660 × 1140 |
| 2d | Bannière SoundCloud | 2480 × 520 |
| 2e | Cover Facebook (CTA « Listen Now ») | 1640 × 624 |
| 2f | Story Instagram — carte structurée | 1080 × 1920 |
| 2g | Story Instagram — full-bleed cinématique | 1080 × 1920 |
| A1 / A2 | Pack avatar — rond / carré | 1080 × 1080 |
| B1 | Bannière YouTube avec avatar | 2560 × 1440 |
| B2 | Post carré (mix) avec égaliseur cyan | 1080 × 1080 |
| C1 | Portrait cosmique — avatar **masqué** | 1080 × 1350 |
| C2 | Portrait terrestre — avatar **démasqué** | 1080 × 1350 |

### Système d'identité visuelle
- **Blason** (`dfx-logo.webp`) = la **marque** : logo nav, favicon, icône, petits formats, galerie.
- **Avatar** = le **personnage**, porte la communication grand format :
  - `avatar-cyan.webp` — **démasqué = terrestre** → nommé **« DFX »** (live, warehouse, booking)
  - `avatar-masked-cyan.webp` — **masqué (menpo) = cosmique** → nommé **« Dark Fen'X »** (mystique, galaxie)
  - Résidus chauds de la recoloration **conservés volontairement** (choix créatif).
- Les deux avatars sont l'Image 2 et l'Image 1 fournies, **recolorées rouge → cyan glace** (canvas)
  pour respecter la charte, et embarqués en data-URI dans `app.js` (pour l'export PNG).
- Présence : avatar en hero de la landing + cartes mix + portraits C1/C2 + bannière B1 ;
  blason en nav/favicon/galerie/icônes → équilibre marque ↔ personnage.

Chaque visuel est affiché dans un cadre réduit (`transform: scale`) mais reste rendu à
ses dimensions natives — l'export PNG sort donc en pleine résolution.

## Système graphique

- **Fonds** obsidienne `#07080C` / `#0A0A0C`
- **Métaux** titane mats `#565C62` / `#8C9298` / `#C6CBCF` (jamais chromé)
- **Carbone** tissé `#15171B`
- **Accent signature** cyan glace `#3FD2D9`
- **Cœur galaxie** violet `#1C1840 → #3A3070 → #7A66BE`
- **Typo** Orbitron (titres) × Montserrat (corps) × Chakra Petch (libellés techniques)
- **Blason DFX** dessiné en SVG (`#dfx-emblem`) : phénix carbone, ailes plumes-lames,
  disque vinyle, bras/tête de lecture titane, cœur galaxie, contour cyan.

## Fonctionnalités

- **Panneau Tweaks « Glace & Galaxie »** (en haut à droite, repliable) :
  - Couleur accent (nuanciers cyan + violet galaxie, ou couleur libre)
  - Densité d'étoiles (`starDensity`)
  - Lueur cyan (`cyanGlow`)
  - Bascule des circuits imprimés (`showCircuit`)
- **Zones photo glisser-déposer** (`<image-slot>`) sur les deux stories — dépose un
  avatar / fond mystique, persistance via `localStorage`.
- **Export PNG plein format** : bouton `⤓ PNG` dans la légende de chaque visuel.
- **Animations** : étoiles montantes, pulsation des barres d'égaliseur, lueur galaxie,
  balayage de lumière.

## Architecture

| Fichier | Rôle |
|---------|------|
| `index.html` | Markup des 7 visuels (styles inline repris au pixel près du prototype) + panneau Tweaks |
| `styles.css` | Chrome de page, keyframes, panneau Tweaks, `<image-slot>` |
| `app.js` | Génération étoiles/égaliseurs (RNG déterministe identique au prototype), `<image-slot>`, panneau Tweaks, export PNG |

### Export PNG — méthode

L'export sérialise le nœud natif du visuel dans un `<foreignObject>` SVG, rastérise via
une `<img>` puis un `<canvas>` → `toDataURL`. Les polices web sont embarquées en `data:`
au moment de l'export pour garder un rendu typographique fidèle **et** un canvas non
« tainted ». Les `<defs>` SVG partagés (motif circuit, dégradés, blason) sont inclus dans
le document exporté pour que les références `url(#…)` / `<use>` se résolvent. Les
animations sont figées à leur phase courante le temps de la capture, puis relancées.
Entièrement natif — aucune librairie externe.
