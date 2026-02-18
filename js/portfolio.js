/* ===================================================
   PORTFOLIO PAGE - IMMERSIVE INTERACTIONS
   Inspired by: ToyFight filters, Zetr scroll,
   Camille Mormal slider, Modular clip-paths
   =================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    /* --- REGISTER GSAP PLUGINS --- */
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    CustomEase.create(
      "hop",
      "M0,0 C0.053,0.604 0.157,0.72 0.293,0.837 0.435,0.959 0.633,1 1,1"
    );

    /* --- LENIS SMOOTH SCROLL --- */
    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    /* --- FILTER BAR FIXED SHOW/HIDE (Lenis-compatible sticky) --- */
    var filterBar = document.querySelector(".filter-bar");
    var heroSection = document.querySelector(".portfolio-hero");

    if (filterBar && heroSection) {
      lenis.on("scroll", function (e) {
        var heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        if (e.scroll > heroBottom - 80) {
          filterBar.classList.add("is-visible");
        } else {
          filterBar.classList.remove("is-visible");
        }
      });
    }

    /* --- CUSTOM CURSOR --- */
    var cursor = document.querySelector(".cursor");
    var follower = document.querySelector(".cursor-follower");

    if (cursor && follower && window.innerWidth > 768) {
      var mouseX = 0, mouseY = 0;
      var cursorX = 0, cursorY = 0;
      var followerX = 0, followerY = 0;

      document.addEventListener("mousemove", function (e) {
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

      var hoverTargets = document.querySelectorAll("a, button, .filter-btn, .project-card");
      hoverTargets.forEach(function (el) {
        el.addEventListener("mouseenter", function () { follower.classList.add("hover"); });
        el.addEventListener("mouseleave", function () { follower.classList.remove("hover"); });
      });
    }

    /* --- PAGE TRANSITION (ENTRY) --- */
    var blocks = document.querySelectorAll(".block");
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
    var internalLinks = document.querySelectorAll("a[href]");
    internalLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (
        href &&
        href.indexOf("#") !== 0 &&
        href.indexOf("http") !== 0 &&
        href.indexOf("mailto") !== 0 &&
        href.indexOf("tel") !== 0
      ) {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          gsap.to(blocks, {
            scaleY: 1,
            duration: 0.6,
            stagger: 0.04,
            ease: "power4.inOut",
            onComplete: function () {
              window.location.href = href;
            },
          });
        });
      }
    });

    /* --- MOBILE MENU --- */
    var hamburger = document.querySelector(".nav__hamburger");
    var mobileMenu = document.querySelector(".mobile-menu");

    if (hamburger && mobileMenu) {
      hamburger.addEventListener("click", function () {
        hamburger.classList.toggle("active");
        mobileMenu.classList.toggle("active");
        document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "";
      });
      mobileMenu.querySelectorAll(".mobile-menu__link").forEach(function (link) {
        link.addEventListener("click", function () {
          hamburger.classList.remove("active");
          mobileMenu.classList.remove("active");
          document.body.style.overflow = "";
        });
      });
    }

    /* ===================================================
       HERO REVEAL - Cinematic entrance
       =================================================== */
    var heroTL = gsap.timeline({ delay: 0.8 });

    heroTL
      .to(".portfolio-hero__tag", {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
      })
      .to(".title-word", {
        y: "0%", duration: 1.2, stagger: 0.15, ease: "hop",
      }, "-=0.5")
      .to(".portfolio-hero__desc", {
        opacity: 1, duration: 0.8, ease: "power3.out",
      }, "-=0.6")
      .to(".stat", {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
        onStart: animateCounters,
      }, "-=0.4")
      .to(".portfolio-hero__scroll", {
        opacity: 1, duration: 0.6, ease: "power3.out",
      }, "-=0.3");

    /* --- Counter Animation --- */
    function animateCounters() {
      var counters = document.querySelectorAll(".stat__number");
      counters.forEach(function (counter) {
        var target = parseInt(counter.getAttribute("data-target"));
        var obj = { value: 0 };
        gsap.to(obj, {
          value: target,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: function () {
            counter.textContent = Math.round(obj.value);
          },
        });
      });
    }

    /* ===================================================
       FILTER SYSTEM - ToyFight-inspired with
       GSAP clip-path + stagger animations
       =================================================== */
    var filterBtns = document.querySelectorAll(".filter-btn");
    var projectCards = document.querySelectorAll(".project-card");
    var emptyState = document.querySelector(".empty-state");
    var isFiltering = false;

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (isFiltering) return;
        isFiltering = true;

        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        var filterValue = btn.dataset.filter;
        var visibleCount = 0;

        gsap.to(projectCards, {
          opacity: 0, scale: 0.95, y: 20,
          duration: 0.3, stagger: 0.02, ease: "power2.in",
          onComplete: function () {
            projectCards.forEach(function (card) {
              var category = card.dataset.category;
              if (filterValue === "all" || category === filterValue) {
                card.style.display = "";
                visibleCount++;
              } else {
                card.style.display = "none";
              }
            });

            if (emptyState) {
              emptyState.style.display = visibleCount === 0 ? "block" : "none";
            }

            var cardsToAnimate = [];
            projectCards.forEach(function (card) {
              if (card.style.display !== "none") {
                cardsToAnimate.push(card);
              }
            });

            if (cardsToAnimate.length > 0) {
              gsap.fromTo(cardsToAnimate,
                { opacity: 0, y: 40, scale: 0.97 },
                {
                  opacity: 1, y: 0, scale: 1,
                  duration: 0.6, stagger: 0.06, ease: "hop",
                  onComplete: function () {
                    isFiltering = false;
                    ScrollTrigger.refresh();
                  },
                }
              );
            } else {
              isFiltering = false;
            }
          },
        });
      });
    });

    /* ===================================================
       PROJECT CARDS REVEAL - Zetr-inspired
       clip-path + scale entrance on scroll
       =================================================== */
    projectCards.forEach(function (card) {
      gsap.fromTo(card,
        {
          opacity: 0, y: 60,
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        },
        {
          opacity: 1, y: 0,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1, ease: "hop",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    /* ===================================================
       VIDEO CARDS - Play on hover
       =================================================== */
    var videoCards = document.querySelectorAll(".project-card--video");
    videoCards.forEach(function (card) {
      var video = card.querySelector("video");
      var playBtn = card.querySelector(".project-card__play-btn");

      if (video) {
        card.addEventListener("mouseenter", function () {
          video.play().catch(function () {});
          if (playBtn) {
            gsap.to(playBtn, { scale: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
          }
        });

        card.addEventListener("mouseleave", function () {
          video.pause();
          video.currentTime = 0;
          if (playBtn) {
            gsap.to(playBtn, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
          }
        });

        card.addEventListener("click", function () {
          if (video.paused) {
            video.controls = true;
            video.muted = false;
            video.play().catch(function () {});
          } else {
            video.pause();
            video.controls = false;
            video.muted = true;
          }
        });
      }
    });

    /* ===================================================
       CTA BANNER REVEAL
       =================================================== */
    var ctaBanner = document.querySelector(".cta-banner");
    if (ctaBanner) {
      gsap.from(".cta-banner__tag", {
        y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".cta-banner", start: "top 80%" },
      });

      gsap.from(".cta-banner__title", {
        y: 40, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".cta-banner", start: "top 75%" },
      });

      gsap.from(".cta-banner__desc", {
        y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".cta-banner", start: "top 70%" },
      });

      gsap.from(".cta-banner__btn", {
        y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".cta-banner__btn", start: "top 90%" },
      });
    }

    /* ===================================================
       FOOTER REVEAL
       =================================================== */
    gsap.from(".footer__inner", {
      y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ".footer", start: "top 90%" },
    });

    /* --- BACK TO TOP --- */
    var backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      window.addEventListener("scroll", function () {
        if (window.scrollY > 600) {
          backToTop.style.opacity = "1";
          backToTop.style.visibility = "visible";
        } else {
          backToTop.style.opacity = "0";
          backToTop.style.visibility = "hidden";
        }
      });

      backToTop.addEventListener("click", function () {
        lenis.scrollTo(0, { duration: 1.5 });
      });
    }

    /* --- SMOOTH ANCHOR SCROLL --- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        var target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          lenis.scrollTo(target, { offset: -60, duration: 1.2 });
        }

        if (hamburger && mobileMenu && mobileMenu.classList.contains("active")) {
          hamburger.classList.remove("active");
          mobileMenu.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    });

    /* --- PARALLAX EFFECTS ON HERO --- */
    if (window.innerWidth > 768) {
      gsap.to(".portfolio-hero__content", {
        y: -80, ease: "none",
        scrollTrigger: {
          trigger: ".portfolio-hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }

  });
})();