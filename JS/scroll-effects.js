export function setupScrollEffects() {
  const blogFeed = document.getElementById('blogFeed');
  const blogGrid = document.getElementById('blogGrid');
  const hero = document.querySelector('.hero');
  const navbar = document.querySelector('.navbar');
  const navbarHeight = 40;

  // Exit if any required elements are missing
  if (!blogFeed || !blogGrid || !hero || !navbar) return;

  // Scroll listener
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Fade hero image on scroll
    const opacity = Math.max(0.1, 1 - scrollY / 50);
    hero.style.opacity = opacity;

    // Reveal blog feed and grid
    if (scrollY === 0) {
      blogFeed.classList.remove("reveal");
      blogGrid.classList.remove("reveal");
    } else {
      blogFeed.classList.add("reveal");
      blogGrid.classList.add("reveal");
    }

    // Add background to navbar after scrolling past hero
    if (scrollY > 0) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // One-time check on load in case user starts below hero
  window.addEventListener("load", () => {
    const scrollY = window.scrollY;
    const heroBottom = hero.getBoundingClientRect().bottom;

    if (scrollY > 0 || heroBottom <= 0) {
      blogFeed.classList.add("reveal");
      blogGrid.classList.add("reveal");
    }
  });

  // Smooth scroll to blog section
  const blogLink = document.querySelector('a[href="#blogFeed"]');
  if (blogLink) {
    blogLink.addEventListener("click", (e) => {
      e.preventDefault();
      const offset = window.scrollY + 50;
      window.scrollTo({ top: 10, behavior: "smooth" });
    });
  }
}
