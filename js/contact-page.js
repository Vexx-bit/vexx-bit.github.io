/* =============================================
   CONTACT PAGE - INTERACTIONS & ANIMATIONS
   ============================================= */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {

    /* --- REGISTER GSAP PLUGINS --- */
    gsap.registerPlugin(CustomEase);
    CustomEase.create("hop", "M0,0 C0.053,0.604 0.157,0.72 0.293,0.837 0.435,0.959 0.633,1 1,1");

    /* --- LENIS SMOOTH SCROLL --- */
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    /* --- CUSTOM CURSOR --- */
    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");

    if (cursor && follower && window.innerWidth > 768) {
      let mouseX = 0, mouseY = 0;
      let cursorX = 0, cursorY = 0;
      let followerX = 0, followerY = 0;

      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        followerX += (mouseX - followerX) * 0.08;
        followerY += (mouseY - followerY) * 0.08;

        cursor.style.left = cursorX - 4 + "px";
        cursor.style.top = cursorY - 4 + "px";
        follower.style.left = followerX - 20 + "px";
        follower.style.top = followerY - 20 + "px";
        requestAnimationFrame(animateCursor);
      }
      animateCursor();

      const hoverTargets = document.querySelectorAll("a, button, input, textarea, select, .social-pill, .info-card");
      hoverTargets.forEach((el) => {
        el.addEventListener("mouseenter", () => follower.classList.add("hover"));
        el.addEventListener("mouseleave", () => follower.classList.remove("hover"));
      });
    }

    /* --- PAGE TRANSITION (ENTRY) --- */
    const blocks = document.querySelectorAll(".block");
    if (blocks.length > 0) {
      gsap.set(blocks, { scaleY: 1 });
      gsap.to(blocks, {
        scaleY: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power4.inOut",
        delay: 0.2,
      });
    }

    /* --- PAGE TRANSITION (EXIT) --- */
    const internalLinks = document.querySelectorAll("a[href]");
    internalLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (
        href &&
        !href.startsWith("#") &&
        !href.startsWith("http") &&
        !href.startsWith("mailto") &&
        !href.startsWith("tel")
      ) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          gsap.to(blocks, {
            scaleY: 1,
            duration: 0.6,
            stagger: 0.04,
            ease: "power4.inOut",
            onComplete: () => { window.location.href = href; },
          });
        });
      }
    });

    /* --- MOBILE MENU --- */
    const hamburger = document.querySelector(".nav__hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (hamburger && mobileMenu) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        mobileMenu.classList.toggle("active");
        document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "";
      });

      mobileMenu.querySelectorAll(".mobile-menu__link").forEach((link) => {
        link.addEventListener("click", () => {
          hamburger.classList.remove("active");
          mobileMenu.classList.remove("active");
          document.body.style.overflow = "";
        });
      });
    }

    /* =============================================
       HERO REVEAL - Cinematic entrance
       ============================================= */
    const heroTL = gsap.timeline({ delay: 0.8 });

    heroTL
      .to(".contact-hero__badge", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      })
      .to(".title-word", {
        y: "-6px",
        duration: 1,
        stagger: 0.12,
        ease: "hop",
      }, "-=0.3")
      .to(".contact-hero__desc", {
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
      }, "-=0.5");

    /* =============================================
       FORM CARD REVEAL - Slides up
       ============================================= */
    gsap.to(".form-card", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      delay: 1.5,
    });

    /* =============================================
       INFO CARDS REVEAL - Stagger from right
       ============================================= */
    gsap.to(".info-card", {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      delay: 1.8,
    });

    /* --- Form input focus animations --- */
    const formInputs = document.querySelectorAll(".form-input");
    formInputs.forEach((input) => {
      input.addEventListener("focus", () => {
        gsap.to(input.parentElement, {
          y: -2,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      input.addEventListener("blur", () => {
        gsap.to(input.parentElement, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    /* --- Info card hover tilt (desktop) --- */
    if (window.innerWidth > 768) {
      const infoCards = document.querySelectorAll(".info-card");
      infoCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { scale: 1.02, duration: 0.3, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
        });
      });
    }

    /* --- Footer reveal --- */
    gsap.from(".footer__content", {
      y: 20, opacity: 0, duration: 0.6, ease: "power3.out",
      delay: 2.2,
    });

  });
})();