// Animations
document.addEventListener("DOMContentLoaded", () => {
    // Breadcrumb Animation
    gsap.from(".breadcrumb", {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power3.out",
    });
  
    // Header Animation
    gsap.from(".policy-header h1", {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      delay: 0.5,
      ease: "elastic.out(1, 0.75)",
    });
  
    // Section Animation
    gsap.from(".policy-content h2", {
      opacity: 0,
      x: -50,
      duration: 0.8,
      stagger: 0.3,
      ease: "power3.out",
    });
  
    gsap.from(".policy-content p, .policy-content ul", {
      opacity: 0,
      x: 50,
      duration: 0.8,
      delay: 0.5,
      stagger: 0.3,
      ease: "power3.out",
    });
  
    // Footer Animation
    gsap.from(".footer", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });
  });
  