/* ═══════════════════════════════════════════════════════════════
   MatériaPro — Mode cinématique (desktop)
   Lenis (défilement inertiel) + GSAP ScrollTrigger (scènes épinglées
   pilotées par le scroll). Mobile et prefers-reduced-motion gardent
   l'expérience classique gérée par main.js.
   ═══════════════════════════════════════════════════════════════ */

import anime from "animejs";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function initCinematic() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const cinematicViewport = window.matchMedia(
    "(min-width: 1081px) and (hover: hover) and (pointer: fine)"
  ).matches;

  if (prefersReducedMotion || !cinematicViewport) return;

  document.documentElement.classList.add("is-cinematic");
  gsap.registerPlugin(ScrollTrigger);

  /* ── Défilement inertiel ─────────────────────────────────── */
  const lenis = new Lenis({ duration: 1.15 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.lenis = lenis; // accessible en console / debug

  // Les ancres passent par Lenis pour garder la même inertie.
  // Pas d'offset manuel : Lenis respecte déjà scroll-padding-top.
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.5 });
    });
  });

  /* ── Scène 1 · HÉRO ÉPINGLÉ ──────────────────────────────────
     Le héro reste à l'écran pendant ~110 vh de scroll : les lignes
     du titre se séparent à des vitesses différentes, le contenu
     s'efface, le fond zoome — un plan d'ouverture. */
  // Si l'utilisateur scrolle pendant l'intro Anime.js, les deux moteurs
  // écriraient les mêmes propriétés : au premier scrub, GSAP prend la main.
  let introInterrupted = false;
  const interruptIntro = () => {
    if (introInterrupted) return;
    introInterrupted = true;
    anime.remove(
      ".hero__eyebrow, .hero__sub, .hero__actions, .hero__meta, .hero__line > span"
    );
  };

  const heroTl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "+=110%",
      scrub: true,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        if (self.progress > 0.02) interruptIntro();
      },
    },
  });

  heroTl
    .to(".hero__line:nth-child(1)", { yPercent: -60 }, 0)
    .to(".hero__line:nth-child(2)", { yPercent: -28 }, 0)
    .to(".hero__line:nth-child(3)", { yPercent: 10 }, 0)
    // fromTo + immediateRender:false : l'intro Anime.js pose des
    // styles inline sur ces éléments, on fixe donc les bornes nous-mêmes
    .fromTo(
      ".hero__eyebrow",
      { opacity: 1, y: 0 },
      { opacity: 0, y: -50, immediateRender: false },
      0
    )
    .fromTo(
      [".hero__sub", ".hero__actions", ".hero__meta"],
      { opacity: 1, y: 0 },
      { opacity: 0, y: 70, stagger: 0.05, immediateRender: false },
      0
    )
    .to(".hero__bg img", { scale: 1.15 }, 0)
    .to(".hero__scroll", { opacity: 0 }, 0)
    .to(".hero__shapes", { opacity: 0 }, 0.2);

  /* ── Scène 2 · GALERIE PRODUITS HORIZONTALE ──────────────────
     La section s'épingle et les cinq familles défilent
     horizontalement, pilotées par le scroll vertical. */
  const grid = document.querySelector(".products__grid");

  if (grid) {
    const horizDistance = () => {
      const container = grid.parentElement;
      const cs = getComputedStyle(container);
      const contentW =
        container.clientWidth -
        parseFloat(cs.paddingLeft) -
        parseFloat(cs.paddingRight);
      return Math.max(0, grid.scrollWidth - contentW);
    };

    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".products",
          start: "top top",
          end: () => "+=" + Math.round(horizDistance() + window.innerHeight * 0.25),
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      .to(grid, { x: () => -horizDistance() }, 0)
      .to("#productsProgress", { scaleX: 1 }, 0);
  }

  /* ── Scène 3 · PLAN DE CLÔTURE ───────────────────────────────
     Le fond du CTA final dézoome lentement pendant que la section
     entre à l'écran. */
  gsap.fromTo(
    ".cta-final__bg img",
    { scale: 1.14 },
    {
      scale: 1,
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: ".cta-final",
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
      },
    }
  );

  /* ── Scène 4 · COUCHES LIÉES AU SCROLL ───────────────────────
     Micro-mouvements scrubbés en continu — chaque cible est choisie
     pour ne jamais entrer en conflit avec les révélations one-shot
     d'Anime.js (qui animent d'autres éléments). */

  // Les grands titres dérivent lentement pendant leur traversée de
  // l'écran ; les mots s'animent indépendamment à l'intérieur.
  document.querySelectorAll("[data-split]").forEach((el) => {
    if (el.closest(".products")) return; // section épinglée : déjà une scène
    gsap.fromTo(
      el,
      { y: 48 },
      {
        y: -48,
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  });

  // Les grands chiffres des légendes (FCQ, 14) remontent à
  // contre-courant de leur image — effet de profondeur.
  document.querySelectorAll(".media-caption__num").forEach((num) => {
    gsap.fromTo(
      num,
      { yPercent: 60 },
      {
        yPercent: -60,
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: num.closest("figure") || num,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });

  // Les séparateurs se tracent au rythme exact du scroll
  // (la transition CSS one-shot est désactivée en mode cinématique).
  document.querySelectorAll(".divider span").forEach((line) => {
    gsap.fromTo(
      line,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: line.parentElement,
          start: "top 92%",
          end: "top 45%",
          scrub: true,
        },
      }
    );
  });

  // Les fonds techniques (grille blueprint, halos) glissent plus
  // lentement que leur section — parallaxe d'arrière-plan.
  [
    { el: ".why__bg", trigger: ".why" },
    { el: ".stats__bg", trigger: ".stats" },
  ].forEach(({ el, trigger }) => {
    gsap.fromTo(
      el,
      { yPercent: -9 },
      {
        yPercent: 9,
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  });

  // La grille de statistiques monte doucement pendant que la section
  // défile (les compteurs one-shot vivent dans ses enfants).
  gsap.fromTo(
    ".stats__grid",
    { y: 44 },
    {
      y: -24,
      ease: "none",
      immediateRender: false,
      scrollTrigger: { trigger: ".stats", start: "top bottom", end: "bottom top", scrub: true },
    }
  );

  // Les dimensions bougent quand images et polices arrivent
  window.addEventListener("load", () => ScrollTrigger.refresh());
}
