# MatériaPro — Site vitrine

Site vitrine de MatériaPro, agence commerciale de matériaux de construction à
Ouagadougou. Construit avec [Astro](https://astro.build). Toutes les
bibliothèques sont bundlées, aucune dépendance CDN au runtime :

- **Anime.js** — micro-interactions et révélations au scroll
- **GSAP ScrollTrigger + Lenis** — mode cinématique desktop : défilement
  inertiel et scènes épinglées pilotées par le scroll (héro, galerie
  produits horizontale, plan de clôture). Mobile et
  `prefers-reduced-motion` conservent l'expérience classique.
- **Lucide** — icônes (sous-ensemble importé, tree-shaken)

## Développement

```bash
npm install
npm run dev        # serveur de dev sur http://localhost:4321
```

## Production

```bash
npm run build      # génère le site statique dans dist/
npm run preview    # prévisualise le build localement
```

Le contenu de `dist/` est entièrement statique : il se déploie tel quel sur
n'importe quel hébergement (GitHub Pages, Netlify, Vercel, serveur classique).

## Structure

- `src/pages/index.astro` — page unique, assemble les sections
- `src/layouts/BaseLayout.astro` — `<head>`, loader, navbar, footer, curseur
- `src/components/` — une section par composant, contenu en tableaux de données
- `src/styles/global.css` — design tokens et styles globaux
- `src/scripts/main.js` — interactions et animations (Anime.js + icônes Lucide)
- `src/scripts/cinematic.js` — scènes cinématiques desktop (GSAP + Lenis)
