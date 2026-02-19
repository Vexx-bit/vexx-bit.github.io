/* ===================================================
   SAMUEL KAMAU KANGETHE - MAIN JS
   =================================================== */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    gsap.registerPlugin(ScrollTrigger, CustomEase);

    CustomEase.create(
      "hop",
      "M0,0 C0.29,0 0.348,0.05 0.422,0.134 0.494,0.217 0.484,0.355 0.5,0.5 0.518,0.662 0.515,0.793 0.596,0.876 0.701,0.983 0.72,0.987 1,1"
    );

    var lenis = new Lenis({ lerp: 0.07, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    setupCursor();
    gsap.set(".block", { scaleY: 0, visibility: "hidden" });
    startPreloader();
    setupPageTransitions();
    setupWorkScroll();
    setupScrollAnimations();
    setupNav(lenis);
    setupMobileMenu();

    function setupCursor() {
      var cursor = document.querySelector(".cursor");
      var follower = document.querySelector(".cursor-follower");
      if (!cursor || !follower || window.innerWidth <= 768) return;

      var mouseX = 0, mouseY = 0;
      var cX = 0, cY = 0, fX = 0, fY = 0;

      document.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      (function loop() {
        cX += (mouseX - cX) * 0.2;
        cY += (mouseY - cY) * 0.2;
        fX += (mouseX - fX) * 0.07;
        fY += (mouseY - fY) * 0.07;
        cursor.style.left = (cX - 3) + "px";
        cursor.style.top = (cY - 3) + "px";
        follower.style.left = (fX - 22) + "px";
        follower.style.top = (fY - 22) + "px";
        requestAnimationFrame(loop);
      })();

      var targets = document.querySelectorAll("a, button, .work__project, .services__card, .connect__link");
      targets.forEach(function (el) {
        el.addEventListener("mouseenter", function () {
          follower.classList.add("hover");
          cursor.style.transform = "scale(0.5)";
        });
        el.addEventListener("mouseleave", function () {
          follower.classList.remove("hover");
          cursor.style.transform = "scale(1)";
        });
      });
    }

    function startPreloader() {
      var preloader = document.querySelector(".preloader");
      var digit = document.querySelector(".preloader__digit");
      var progress = document.querySelector(".preloader__progress");
      var text = document.querySelector(".preloader__text");

      if (!preloader || !digit || !progress) {
        revealHero();
        return;
      }

      gsap.fromTo(digit,
        { y: 120, opacity: 1 },
        { y: 0, duration: 0.8, ease: "power3.out", delay: 0.2, onComplete: runCounter }
      );

      if (text) {
        gsap.to(text, { opacity: 1, duration: 0.5, delay: 0.4 });
      }

      function runCounter() {
        var current = 0;
        var start = Date.now();

        function tick() {
          var elapsed = Date.now() - start;
          if (elapsed < 1600) {
            current = Math.min(current + Math.floor(Math.random() * 20) + 10, 99);
            digit.textContent = current;
            gsap.to(progress, { width: current + "%", duration: 0.25, ease: "power2.out" });
            setTimeout(tick, 180);
          } else {
            current = 100;
            digit.textContent = 100;
            gsap.to(progress, { width: "100%", duration: 0.3, ease: "power2.out" });
            setTimeout(dismissPreloader, 400);
          }
        }
        tick();
      }

      function dismissPreloader() {
        var tl = gsap.timeline({
          onComplete: function () {
            preloader.style.display = "none";
            revealHero();
          }
        });
        tl.to(digit, { y: -40, opacity: 0, duration: 0.4, ease: "power3.in" }, 0);
        if (text) { tl.to(text, { opacity: 0, duration: 0.3 }, 0); }
        tl.to(progress, { opacity: 0, duration: 0.3 }, 0.1);
        tl.to(preloader, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 0.2);
      }
    }

    function revealHero() {
      var hero = document.querySelector(".hero");
      if (!hero) return;

      var tl = gsap.timeline();
      tl.to(hero, { clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)", duration: 1.8, ease: "hop" })
        .to(".hero__bg img", { scale: 1, duration: 2, ease: "power3.inOut" }, "-=1.5")
        .to(".hero__title-word", { y: -6, duration: 1.2, stagger: 0.15, ease: "power4.out" }, "-=1.5")
        .to(".hero__tag", { opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.8")
        .to(".hero__bottom", { opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5");
    }

    function setupPageTransitions() {
      document.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function (e) {
          var href = link.getAttribute("href");
          if (!href) return;
          if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto")) return;
          if (href === window.location.pathname) return;

          e.preventDefault();
          gsap.set(".block", { visibility: "visible", scaleY: 0 });
          gsap.to(".block", {
            scaleY: 1, duration: 0.7,
            stagger: { each: 0.06, from: "start", grid: [2, 5], axis: "x" },
            ease: "power4.inOut",
            onComplete: function () { window.location.href = href; }
          });
        });
      });
    }

    function setupWorkScroll() {
      var stickySection = document.querySelector(".work__sticky");
      var workHeader = document.querySelector(".work__header");
      var cards = document.querySelectorAll(".work__card");
      if (!stickySection || !workHeader || cards.length === 0) return;

      /* ── CriticalDanger horizontal scroll — all screens ── */
      var stickyHeight = window.innerHeight * 5;

      var transforms = [
        [[10, 50, -10, 10], [15, -8, -35, 15]],
        [[0, 47.5, -10, 15], [-20, 12, -40, 25]],
        [[0, 52.5, -10, 5], [12, -5, -30, 50]],
        [[0, 50, 30, -70], [18, -8, 50, 5]],
        [[5, 48, -15, 20], [-15, 10, -25, 35]]
      ];

      ScrollTrigger.create({
        trigger: stickySection,
        start: "top top",
        end: "+=" + stickyHeight + "px",
        pin: true,
        pinSpacing: true,
        onUpdate: function (self) {
          var progress = self.progress;

          var maxTranslate = workHeader.offsetWidth - window.innerWidth;
          gsap.set(workHeader, { x: -progress * maxTranslate });

          cards.forEach(function (card, index) {
            var delay = index * 0.12;
            var cardProgress = Math.max(0, Math.min((progress - delay) * 2.2, 1));

            if (cardProgress > 0) {
              var startX = 25;
              var endX = -650;
              var yPos = transforms[index][0];
              var rotations = transforms[index][1];

              var cardX = gsap.utils.interpolate(startX, endX, cardProgress);
              var yProgress = cardProgress * 3;
              var yIndex = Math.min(Math.floor(yProgress), yPos.length - 2);
              var yInterp = yProgress - yIndex;
              var cardY = gsap.utils.interpolate(yPos[yIndex], yPos[yIndex + 1], yInterp);
              var cardR = gsap.utils.interpolate(rotations[yIndex], rotations[yIndex + 1], yInterp);

              gsap.set(card, {
                xPercent: cardX,
                yPercent: cardY,
                rotation: cardR,
                opacity: 1
              });
            } else {
              gsap.set(card, { opacity: 0 });
            }
          });
        }
      });
    }

    function setupScrollAnimations() {
      var heroImg = document.querySelector(".hero__bg img");
      if (heroImg) {
        gsap.to(heroImg, {
          yPercent: 20, ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
      }

      gsap.utils.toArray(".section-header__title").forEach(function (el) {
        gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
        });
      });

      gsap.utils.toArray(".section-header__tag").forEach(function (el) {
        gsap.from(el, { y: 20, opacity: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" }
        });
      });

      var aboutReveal = document.querySelector(".about__image-reveal");
      if (aboutReveal) {
        gsap.to(aboutReveal, { scaleY: 0, duration: 1.2, ease: "power4.inOut",
          scrollTrigger: { trigger: ".about__image-wrapper", start: "top 75%", toggleActions: "play none none reverse" }
        });
      }

      gsap.utils.toArray(".about__text p").forEach(function (p, i) {
        gsap.from(p, { y: 40, opacity: 0, duration: 0.8, delay: i * 0.15, ease: "power3.out",
          scrollTrigger: { trigger: p, start: "top 85%", toggleActions: "play none none reverse" }
        });
      });

      document.querySelectorAll(".about__stat-number").forEach(function (stat) {
        var target = parseInt(stat.dataset.count, 10);
        if (isNaN(target)) return;
        ScrollTrigger.create({
          trigger: stat, start: "top 85%", once: true,
          onEnter: function () {
            gsap.to(stat, { innerText: target, duration: 2, ease: "power2.out",
              snap: { innerText: 1 },
              onUpdate: function () { stat.textContent = Math.round(parseFloat(stat.textContent)); }
            });
          }
        });
      });

      gsap.utils.toArray(".services__card").forEach(function (card, i) {
        gsap.from(card, { y: 60, opacity: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" }
        });
      });

      var connectTitle = document.querySelector(".connect__title");
      if (connectTitle) {
        gsap.from(connectTitle, { y: 80, opacity: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: connectTitle, start: "top 85%", toggleActions: "play none none reverse" }
        });
      }

      gsap.utils.toArray(".connect__link").forEach(function (link, i) {
        gsap.from(link, { y: 30, opacity: 0, duration: 0.6, delay: i * 0.08, ease: "power3.out",
          scrollTrigger: { trigger: link, start: "top 90%", toggleActions: "play none none reverse" }
        });
      });
    }

    function setupNav(lenis) {
      var nav = document.querySelector(".nav");
      if (!nav) return;

      ScrollTrigger.create({
        trigger: "body", start: "top top", end: "bottom bottom",
        onUpdate: function (self) {
          if (self.progress > 0.01) { nav.classList.add("scrolled"); }
          else { nav.classList.remove("scrolled"); }
        }
      });

      document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          var id = anchor.getAttribute("href");
          var target = document.querySelector(id);
          if (target) {
            lenis.scrollTo(target, { offset: -80 });
            var mm = document.getElementById("mobileMenu");
            var hb = document.getElementById("hamburger");
            if (mm && mm.classList.contains("active")) {
              mm.classList.remove("active");
              if (hb) hb.classList.remove("active");
            }
          }
        });
      });
    }

    function setupMobileMenu() {
      var hamburger = document.getElementById("hamburger");
      var mobileMenu = document.getElementById("mobileMenu");
      if (!hamburger || !mobileMenu) return;

      hamburger.addEventListener("click", function () {
        hamburger.classList.toggle("active");
        mobileMenu.classList.toggle("active");
      });
    }
  }
})();
