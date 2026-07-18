/* ═══════════════════════════════════════════════════════════════
   MatériaPro — Site vitrine · Interactions & animations
   Dépendances : Anime.js v3 (CDN), Lucide Icons (CDN)
   ═══════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isDesktopPointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  /* ── Icônes Lucide ─────────────────────────────────────────── */
  if (window.lucide) lucide.createIcons();

  /* ══════════════════════════════════════════════════════════
     1. LOADER + SÉQUENCE D'ENTRÉE
     ══════════════════════════════════════════════════════════ */
  const loader = document.getElementById("loader");
  const loaderBar = document.getElementById("loaderBar");
  const nav = document.getElementById("nav");

  function playIntro() {
    if (prefersReducedMotion) {
      loader.classList.add("is-done");
      nav.style.transform = "translateY(0)";
      return;
    }

    const tl = anime.timeline({ easing: "easeOutExpo" });

    tl.add({
      targets: loaderBar,
      width: "100%",
      duration: 900,
      easing: "easeInOutQuart",
    })
      .add({
        targets: loader,
        opacity: 0,
        duration: 600,
        complete: () => loader.classList.add("is-done"),
      })
      // Navbar
      .add(
        {
          targets: nav,
          translateY: ["-100%", "0%"],
          duration: 800,
        },
        "-=300"
      )
      // Badge héro
      .add(
        {
          targets: ".hero__eyebrow",
          opacity: [0, 1],
          translateY: [16, 0],
          duration: 700,
        },
        "-=500"
      )
      // Titre héro — révélation ligne par ligne
      .add(
        {
          targets: ".hero__line > span",
          translateY: ["110%", "0%"],
          duration: 1100,
          delay: anime.stagger(160),
        },
        "-=450"
      )
      // Sous-titre, actions, méta
      .add(
        {
          targets: [".hero__sub", ".hero__actions", ".hero__meta"],
          opacity: [0, 1],
          translateY: [24, 0],
          duration: 900,
          delay: anime.stagger(140),
        },
        "-=650"
      );
  }

  window.addEventListener("load", playIntro);
  // Sécurité : si "load" tarde (images lentes), on lance quand même
  setTimeout(() => {
    if (!loader.classList.contains("is-done")) playIntro();
  }, 3500);

  /* ══════════════════════════════════════════════════════════
     2. CURSEUR PERSONNALISÉ (desktop uniquement)
     ══════════════════════════════════════════════════════════ */
  if (isDesktopPointer && !prefersReducedMotion) {
    document.body.classList.add("has-cursor");
    const cursor = document.getElementById("cursor");
    const dot = document.getElementById("cursorDot");

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // L'anneau suit avec un léger retard (effet luxe)
    (function follow() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      cursor.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(follow);
    })();

    // Agrandissement sur éléments interactifs
    document
      .querySelectorAll("a, button, .card, .glass-card")
      .forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
        el.addEventListener("mouseleave", () =>
          cursor.classList.remove("is-hover")
        );
      });
  }

  /* ══════════════════════════════════════════════════════════
     3. EFFET MAGNÉTIQUE SUR LES BOUTONS
     ══════════════════════════════════════════════════════════ */
  if (isDesktopPointer && !prefersReducedMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = 22;

      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        anime({
          targets: el,
          translateX: (x / rect.width) * strength,
          translateY: (y / rect.height) * strength,
          duration: 300,
          easing: "easeOutQuad",
        });
      });

      el.addEventListener("mouseleave", () => {
        anime({
          targets: el,
          translateX: 0,
          translateY: 0,
          duration: 500,
          easing: "easeOutElastic(1, 0.5)",
        });
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     4. SCROLL : PROGRESSION + NAVBAR + PARALLAX HÉRO
     ══════════════════════════════════════════════════════════ */
  const progressBar = document.getElementById("scrollProgress");
  const heroBg = document.getElementById("heroBg");
  let ticking = false;

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    // Barre de progression
    progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;

    // Navbar opaque après le héro
    nav.classList.toggle("is-scrolled", scrollTop > 80);

    // Parallax subtil du fond héro
    if (!prefersReducedMotion && scrollTop < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollTop * 0.25}px)`;
    }

    updateActiveLink();
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  });

  /* ══════════════════════════════════════════════════════════
     5. INDICATEUR DE NAVIGATION ACTIF
     ══════════════════════════════════════════════════════════ */
  const navLinks = [...document.querySelectorAll(".nav__link")];
  const indicator = document.getElementById("navIndicator");
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function moveIndicator(link) {
    if (!link) {
      indicator.style.opacity = "0";
      return;
    }
    const parentRect = link.parentElement.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    indicator.style.opacity = "1";
    indicator.style.left = `${rect.left - parentRect.left}px`;
    indicator.style.width = `${rect.width}px`;
  }

  function updateActiveLink() {
    const fromTop = window.scrollY + window.innerHeight * 0.35;
    let current = null;

    sections.forEach((section, i) => {
      if (section.offsetTop <= fromTop) current = navLinks[i];
    });

    navLinks.forEach((l) => l.classList.toggle("is-active", l === current));
    moveIndicator(current);
  }

  /* ══════════════════════════════════════════════════════════
     6. RÉVÉLATION AU SCROLL (IntersectionObserver + Anime.js)
     ══════════════════════════════════════════════════════════ */
  const revealEls = document.querySelectorAll("[data-reveal]");

  if (prefersReducedMotion) {
    revealEls.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [36, 0],
            duration: 950,
            easing: "easeOutExpo",
            // Léger décalage naturel entre éléments voisins
            delay: (entry.target.dataset.delay || 0) * 1,
          });

          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    // Décalage en cascade pour les cartes d'une même grille
    document
      .querySelectorAll(
        ".products__grid, .why__grid, .services__grid, .testimonials__grid, .stats__grid, .process__list"
      )
      .forEach((grid) => {
        [...grid.querySelectorAll("[data-reveal]")].forEach((el, i) => {
          el.dataset.delay = i * 110;
        });
      });

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ══════════════════════════════════════════════════════════
     7. COMPTEURS ANIMÉS (statistiques)
     ══════════════════════════════════════════════════════════ */
  const counters = document.querySelectorAll(".counter");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);

        if (prefersReducedMotion) {
          el.textContent = target;
        } else {
          const obj = { value: 0 };
          anime({
            targets: obj,
            value: target,
            duration: 1800,
            easing: "easeOutExpo",
            round: 1,
            update: () => (el.textContent = obj.value),
          });
        }
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => counterObserver.observe(el));

  /* ══════════════════════════════════════════════════════════
     8. PULSATION DU CTA PRINCIPAL
     ══════════════════════════════════════════════════════════ */
  const ctaPulse = document.getElementById("ctaPulse");
  if (ctaPulse && !prefersReducedMotion) {
    anime({
      targets: ctaPulse,
      boxShadow: [
        "0 10px 26px rgba(200,146,26,0.35)",
        "0 10px 40px rgba(200,146,26,0.65)",
        "0 10px 26px rgba(200,146,26,0.35)",
      ],
      duration: 2600,
      loop: true,
      easing: "easeInOutSine",
    });
  }

  /* ══════════════════════════════════════════════════════════
     9. MENU MOBILE
     ══════════════════════════════════════════════════════════ */
  const burger = document.getElementById("navBurger");
  const mobileMenu = document.getElementById("mobileMenu");

  function toggleMenu(open) {
    burger.classList.toggle("is-open", open);
    mobileMenu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }

  burger.addEventListener("click", () =>
    toggleMenu(!mobileMenu.classList.contains("is-open"))
  );
  mobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => toggleMenu(false))
  );

  /* ══════════════════════════════════════════════════════════
     10. ÉTAT INITIAL
     ══════════════════════════════════════════════════════════ */
  updateActiveLink();
})();
