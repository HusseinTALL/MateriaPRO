import { defineConfig } from "astro/config";

// En CI GitHub Pages, PAGES_SITE / PAGES_BASE préfixent les assets pour
// le déploiement sous /<repo>/. En local et sur un domaine racine,
// ces variables sont absentes et le site se construit à la racine.
export default defineConfig({
  site: process.env.PAGES_SITE,
  base: process.env.PAGES_BASE ?? "/",
});
