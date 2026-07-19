/* ═══════════════════════════════════════════════════════════════
   MatériaPro — Chorégraphie de scroll cinématique
   Lenis (défilement inertiel) + GSAP ScrollTrigger (scènes scrubbées).

   Deux niveaux d'expérience :
   · desktop  (.is-cinematic) — scènes épinglées, inertie, vélocité
   · tactile  (.is-cinelite)  — mêmes couches scrubbées, amplitudes
     réduites, sans épinglage ni inertie (adapté au toucher)
   prefers-reduced-motion coupe tout ; main.js garde les révélations.
   ═══════════════════════════════════════════════════════════════ */

import anime from "animejs";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

/* ── Défilement inertiel (desktop) ───────────────────────────── */
function initSmoothScroll() {
  const lenis = new Lenis({ duration: 1.15 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.lenis = lenis; // accessible en console / debug

  // Les ancres passent par Lenis pour garder la même inertie.
  // Pas d'offset manuel : Lenis respecte déjà scroll-padding-top.
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = $(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.5 });
    });
  });

  return lenis;
}

/* ── Scène 1 · HÉRO ÉPINGLÉ (desktop) ────────────────────────────
   Pendant ~110 vh de scroll : le titre se compresse et ses lignes
   se séparent, le contenu se dissout dans un léger flou, le fond
   zoome — puis la section suivante prend le relais en glissant. */
function initHeroScene() {
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

  gsap
    .timeline({
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
    })
    .to(".hero__title", { scale: 0.94, transformOrigin: "0% 20%" }, 0)
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
    .to(".hero__shapes", { opacity: 0 }, 0.2)
    // Dissolution finale : le héro s'efface dans un léger flou
    .fromTo(
      ".hero__content",
      { filter: "blur(0px)" },
      { filter: "blur(5px)", immediateRender: false },
      0.55
    );

  // Passage de relais : la section suivante monte pendant que le
  // héro se libère — pas de coupe sèche.
  gsap.fromTo(
    ".about .container",
    { y: 90 },
    {
      y: 0,
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: ".about",
        start: "top bottom",
        end: "top 35%",
        scrub: true,
      },
    }
  );
}

/* ── Scène 2 · GALERIE PRODUITS HORIZONTALE (desktop) ─────────── */
function initProductsScene() {
  const grid = $(".products__grid");
  if (!grid) return null;

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

  return grid;
}

/* ── TRANSITIONS DE SECTIONS · masques expansifs ─────────────────
   Les sections sombres entrent comme des cartes aux angles arrondis
   qui s'étendent plein cadre au fil du scroll — pas de coupe sèche
   entre chapitres. */
function initSectionMasks(inset, radius) {
  [".why", ".stats", ".cta-final"].forEach((sel) => {
    const el = $(sel);
    if (!el) return;
    gsap.fromTo(
      el,
      { clipPath: `inset(${inset}% ${inset / 2}% ${inset}% ${inset / 2}% round ${radius}px)` },
      {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 92%", end: "top 28%", scrub: true },
      }
    );
  });
}

/* ── RÉVÉLATION DES IMAGES · balayage de masque ──────────────────
   Les visuels éditoriaux se découvrent de haut en bas au rythme du
   scroll (en plus de leur zoom de pose et de leur parallaxe). */
function initMediaWipes() {
  $$(".media-frame img").forEach((img) => {
    gsap.fromTo(
      img,
      { clipPath: "inset(0% 0% 38% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: img.closest("figure") || img,
          start: "top 92%",
          end: "top 40%",
          scrub: true,
        },
      }
    );
  });
}

/* ── COUCHES LIÉES AU SCROLL ─────────────────────────────────────
   Micro-mouvements scrubbés en continu — chaque cible est choisie
   pour ne jamais entrer en conflit avec les révélations one-shot
   d'Anime.js (qui animent d'autres éléments). */
function initScrubLayer(amplitude, excludePinnedHeading) {
  // Les grands titres dérivent lentement pendant leur traversée de
  // l'écran ; les mots s'animent indépendamment à l'intérieur.
  $$("[data-split]").forEach((el) => {
    if (excludePinnedHeading && el.closest(".products")) return;
    gsap.fromTo(
      el,
      { y: 48 * amplitude },
      {
        y: -48 * amplitude,
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  });

  // Les grands chiffres des légendes (FCQ, 14) remontent à
  // contre-courant de leur image — effet de profondeur.
  $$(".media-caption__num").forEach((num) => {
    gsap.fromTo(
      num,
      { yPercent: 60 * amplitude },
      {
        yPercent: -60 * amplitude,
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
  $$(".divider span").forEach((line) => {
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
      { yPercent: -9 * amplitude },
      {
        yPercent: 9 * amplitude,
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
    { y: 44 * amplitude },
    {
      y: -24 * amplitude,
      ease: "none",
      immediateRender: false,
      scrollTrigger: { trigger: ".stats", start: "top bottom", end: "bottom top", scrub: true },
    }
  );
}

/* ── PLAN DE CLÔTURE · le fond du CTA final se pose ──────────── */
function initClosingShot() {
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
}

/* ── COUCHE DE VÉLOCITÉ (desktop) ────────────────────────────────
   La typographie réagit organiquement à l'énergie du scroll : un
   cisaillement infime, proportionnel à la vitesse, qui retombe à
   zéro dès que le défilement s'apaise. Les cibles sont déjà pilotées
   par GSAP, les deux transformations se composent proprement. */
function initVelocityLayer(lenis, productsGrid) {
  const headingSkews = $$("[data-split]").map((el) =>
    gsap.quickTo(el, "skewY", { duration: 0.5, ease: "power3.out" })
  );
  const gridSkew = productsGrid
    ? gsap.quickTo(productsGrid, "skewX", { duration: 0.45, ease: "power3.out" })
    : null;

  lenis.on("scroll", (e) => {
    const v = gsap.utils.clamp(-1, 1, e.velocity / 90);
    headingSkews.forEach((to) => to(v * -2.2));
    if (gridSkew) gridSkew(v * -3.5);
  });
}

/* ── Point d'entrée ──────────────────────────────────────────── */
export function initCinematic() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  const isDesktop = window.matchMedia(
    "(min-width: 1081px) and (hover: hover) and (pointer: fine)"
  ).matches;

  if (isDesktop) {
    document.documentElement.classList.add("is-cinematic");
    const lenis = initSmoothScroll();
    initHeroScene();
    const grid = initProductsScene();
    initSectionMasks(6, 28);
    initMediaWipes();
    initScrubLayer(1, true);
    initClosingShot();
    initVelocityLayer(lenis, grid);
  } else {
    // Tactile / petits écrans : la même narration scrubbée, adaptée —
    // amplitudes réduites, pas d'épinglage, défilement natif.
    document.documentElement.classList.add("is-cinelite");
    initSectionMasks(3.5, 18);
    initMediaWipes();
    initScrubLayer(0.55, false);
    initClosingShot();
  }

  // Les dimensions bougent quand images et polices arrivent
  window.addEventListener("load", () => ScrollTrigger.refresh());
}
