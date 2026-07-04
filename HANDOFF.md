# HANDOFF — DFX (Dark Fen'X) · relancer une nouvelle session

> **But de ce fichier** : tout ce qu'une nouvelle session Claude Code doit savoir
> pour reprendre le projet **sans repartir de zéro** — la charte, le système d'avatars,
> l'état du déploiement, l'inventaire des fichiers, et l'intégration des **vidéos**.
>
> **Pour démarrer** : ouvre une session dans ce dépôt et colle :
> *« Lis HANDOFF.md et reprends le projet DFX. »*

---

## 0. Résumé express

- **Projet** : **DFX (Dark Fen'X)** — projet DJ. Site + kit de marque **statique** (HTML/CSS/JS, aucun build).
- **Charte validée** : **« Cyan Glace + Galaxie »**. Le rouge / « Darth-Maul » est **ABANDONNÉ** (hors-charte).
- **Langue de travail** : **français**.
- **Déployé** : https://darkfenx.netlify.app
- **Code** : https://github.com/johntapioka-web/Digithub (branche `main`, auto-deploy Netlify ↔ GitHub actif).
- **Statut** : kit + landing **fonctionnels et en ligne**, export PNG vérifié (0 erreur JS). Working tree propre.

---

## 1. Identité de marque

### Charte « Cyan Glace + Galaxie »
| Rôle | Hex |
|---|---|
| Fond obsidienne | `#07080C` / `#0A0A0C` |
| Cyan glace (accent unique) | `#3FD2D9` |
| Cœur galaxie (violet) | `#1C1840 → #3A3070 → #7A66BE` |
| Titane / gunmetal mat | `#565C62` · `#8C9298` · `#C6CBCF` (jamais chromé) |
| Carbone tissé | `#15171B` |

**Typo** : Orbitron (titres) · Montserrat (corps) · Chakra Petch (libellés techniques).

**Interdits stricts** : rouge, crimson, orange, or, bronze, néon, « Darth », Darth-Maul, sabre laser, lumière chaude, braises.
> **Exception créative assumée par l'utilisateur** : les avatars source rouges ont été **recolorés rouge → cyan**,
> et on **conserve volontairement les résidus chauds** de la recoloration (« j'aime les résidus chauds »).

### Système d'identité : blason vs avatar
- **Blason** (`dfx-logo.webp`) = la **marque** : nav, favicon, icône, petits formats, galerie.
- **Avatar** = le **personnage**, porte la communication grand format. Règle de nommage :
  - **Démasqué = terrestre → « DFX »** → `avatar-cyan.webp` (live, warehouse, booking).
  - **Masqué (menpo) = cosmique → « Dark Fen'X »** → `avatar-masked-cyan.webp` (mystique, galaxie).

---

## 2. Les avatars (assets clés)

| Fichier | Rôle | Origine | Nom |
|---|---|---|---|
| `avatar-cyan.webp` (168 KB) | Avatar **démasqué / terrestre** | Image 2 fournie, recolorée rouge→cyan | **« DFX »** |
| `avatar-masked-cyan.webp` (105 KB) | Avatar **masqué / cosmique** | Image 1 fournie, recolorée rouge→cyan | **« Dark Fen'X »** |
| `dfx-logo.webp` (145 KB) | **Blason** (phénix, marque) | Logo réel transparent de l'utilisateur | — |

- **Recoloration** : hue-shift canvas HSL — pixels saturation > 0.12 et hue ≤38° ou ≥330° remappés vers hue 186° (cyan glace). Résidus chauds conservés.
- Dans `app.js`, les deux avatars sont embarqués en **data-URI** (`AVATAR_URI`, `AVATAR_MASKED_URI`) et assignés au init à `img.dfx-avatar` / `img.dfx-avatar-masked` — nécessaire pour que l'**export PNG** (canvas non « tainted ») fonctionne.
- Dans `landing.html`, les avatars sont référencés **par fichier** (`./avatar-masked-cyan.webp`, etc.) car pas d'export PNG là-bas.

**Briefs de régénération** (si on veut des avatars/logo v2 propres via session image-gen) :
- `AVATAR-brief.md` — prompt avatar en charte cyan/galaxie (+ negative prompt).
- `LOGO-brief-image-gen.md` — brief logo v2 (agrandir tête de lecture/VU, VU métallisées).

---

## 3. ▶ VIDÉOS — à intégrer (À FAIRE)

> ⚠️ **Aucune vidéo n'existe dans ce dépôt/cette session.** Rien n'a été produit ici en vidéo —
> seulement des visuels statiques (PNG/WebP). Les « vidéos réalisées » évoquées ont été faites
> **hors de cette session** (outils tiers de l'utilisateur).

**Pour la prochaine session — déposer les vidéos puis me dire où elles sont :**
1. Copier les fichiers dans le dépôt (suggestion : dossier `media/` ou `video/`).
2. Formats web recommandés : **`.mp4` (H.264/AAC)** + fallback **`.webm`** si possible ; poster `.webp`.
3. M'indiquer pour **chaque** vidéo : rôle voulu (hero de la landing ? teaser mix ? boucle de fond ?), format/ratio, et l'avatar concerné (terrestre DFX / cosmique Dark Fen'X).

**Points d'intégration prêts à recevoir de la vidéo dans `landing.html` :**
- **Hero** — actuellement fond galaxie animé en CSS/JS + avatar masqué. Peut devenir un `<video autoplay muted loop playsinline poster="…">` en fond (la structure HLS d'origine avait été remplacée par le fond animé, faute de libs installables).
- **Featured Drops (bento)** — chaque carte mix pourrait afficher une vidéo/preview au survol.
- **Visual Playground (galerie)** — vignettes vidéo possibles.

Table de suivi à compléter quand les fichiers arrivent :

| Fichier vidéo | Rôle | Ratio/format | Avatar | Emplacement cible |
|---|---|---|---|---|
| _(à fournir)_ | _hero ? teaser ?_ | _16:9 ? 9:16 ?_ | _DFX / Dark Fen'X_ | _landing hero / carte / galerie_ |

---

## 4. Inventaire des fichiers (`/home/claude/repo`)

| Fichier | Rôle |
|---|---|
| `index.html` (264 KB) | **Kit de marque** : 7 visuels (2a–2g) + Pack Avatar (A1/A2) + Réseaux-Avatar (B1/B2) + Système Avatar (C1 cosmique masqué / C2 terrestre démasqué). Panneau Tweaks, drag-and-drop, boutons export PNG. |
| `landing.html` (26 KB) | **Vitrine** Dark Fen'X : loading screen, hero (avatar masqué + role cycle), Featured Drops, Upcoming Sets, Visual Playground (→ index.html), stats, footer. Vanilla JS. Booking `booking@darkfenx.com`. |
| `styles.css` (8 KB) | Chrome de page, keyframes (starRise, eqPulse, glowPulse, sweep), panneau Tweaks, `<image-slot>`. |
| `app.js` (384 KB) | RNG déterministe (Lehmer/MINSTD → 133 étoiles), `buildStars`/`buildEq`, `<image-slot>`, Tweaks, `getFontCss` (fonts en data-URI), freeze/unfreeze animations, `exportPng`, avatars data-URI. |
| `avatar-cyan.webp` | Avatar terrestre « DFX ». |
| `avatar-masked-cyan.webp` | Avatar cosmique « Dark Fen'X ». |
| `dfx-logo.webp` | Blason (logo réel). |
| `README.md` | Doc projet (2 pages, tableau des visuels, système d'identité, méthode export). |
| `AVATAR-brief.md` | Brief image-gen avatar (charte cyan). |
| `LOGO-brief-image-gen.md` | Brief image-gen logo v2. |
| `project/`, `chats/` | Source d'origine (export Claude Design) + historique de conception. |

### Les visuels du kit (`index.html`)
| ID | Format | Dimensions |
|----|--------|-----------|
| 2a / 2b | Bannière YouTube (symétrique / editorial) | 2560 × 1440 |
| 2c | Header Spotify | 2660 × 1140 |
| 2d | Bannière SoundCloud | 2480 × 520 |
| 2e | Cover Facebook | 1640 × 624 |
| 2f / 2g | Story Instagram (carte / full-bleed) | 1080 × 1920 |
| A1 / A2 | Pack avatar (rond / carré) | 1080 × 1080 |
| B1 | Bannière YouTube avec avatar | 2560 × 1440 |
| B2 | Post carré (mix) égaliseur cyan | 1080 × 1080 |
| C1 | Portrait **cosmique** (avatar masqué) | 1080 × 1350 |
| C2 | Portrait **terrestre** (avatar démasqué) | 1080 × 1350 |

---

## 5. Détails techniques à retenir

- **Export PNG natif** (aucune lib) : nœud du visuel → `<foreignObject>` SVG → `<img>` → `<canvas>` → `toDataURL`. Fonts Google embarquées en data-URI au moment de l'export (canvas non « tainted » + typo fidèle). `<defs>` partagés (motif `#circuit`, dégradés, `#dfx-emblem`) inclus pour résoudre `url(#…)`/`<use>`. Animations figées à leur phase courante pendant la capture puis relancées.
- **Pourquoi tout est natif** : CDN/npm **bloqués (403)** dans l'environnement → impossible de vendorer html-to-image, React, GSAP, hls.js. D'où le fond galaxie animé au lieu de la vidéo HLS, et l'export maison.
- **Vérification headless** : Playwright (module global `/opt/node22/lib/node_modules/playwright`, import CJS `import pkg; const {chromium}=pkg`), chromium `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, servi via `python3 -m http.server` pour imiter Netlify.
- **Sécurité** : `ANTHROPIC_API_KEY` ne doit **JAMAIS** être dans du HTML/JS public. Toute feature IA passe par un **backend** (ex. Netlify Function).

---

## 6. État git & déploiement

- **Remote** : `github.com/johntapioka-web/Digithub`, branche `main`.
- **Netlify** : `darkfenx.netlify.app`, **auto-deploy connecté** à GitHub (push sur `main` → redéploie).
- **Working tree** : propre. Dernier commit local : `63f7a34` (nommage registre terrestre/cosmique).
- **Note push** : depuis le conteneur, le proxy git de session **refuse le push** (401/403) — les push se font **depuis le PC de l'utilisateur** (ou via l'auto-deploy après un push manuel).

> Pour faire de la vitrine la page d'accueil Netlify : renommer `landing.html` → `index.html` et le kit → `kit.html` (mettre à jour les liens).

---

## 7. Pistes ouvertes (non commencées)

- **Intégrer les vidéos** (voir §3) dès qu'elles sont fournies.
- **Logo v2** photoréaliste via `LOGO-brief-image-gen.md` (session image-gen).
- **Avatars v2** propres via `AVATAR-brief.md` (session image-gen).
- **Feature IA** optionnelle via Netlify Function (jamais de clé API côté client).
