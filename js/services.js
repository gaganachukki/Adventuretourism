/**
 * STACKLY ADVENTURE TOURISM — SERVICES SCRIPT (js/services.js)
 * Coordinates Tour Packages, Adventure Experiences & Services Subnav
 */

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Subnav Active State on Scroll
  const subnavLinks = document.querySelectorAll('.services-subnav-link');
  const sections = [
    document.getElementById('services-packages'),
    document.getElementById('services-experiences'),
    document.getElementById('services-custom')
  ].filter(Boolean);

  if (subnavLinks.length > 0 && sections.length > 0) {
    const onScroll = () => {
      const scrollPos = window.scrollY + 140;
      let currentSectionId = '';

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId) {
        subnavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Handle URL hash on initial load (e.g., Services.html#services-experiences)
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }
});
