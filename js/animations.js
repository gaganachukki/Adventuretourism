/**
 * STACKLY ADVENTURE TOURISM — ANIMATIONS SYSTEM (js/animations.js)
 * GSAP & ScrollTrigger Animations with Full CSS-Safe Hover Support
 */

document.addEventListener('DOMContentLoaded', () => {
  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    // Refresh ScrollTrigger when all assets/images finish loading
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  // 1. Navbar Entrance Animation
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    gsap.from(siteHeader, {
      y: -60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      clearProps: 'all'
    });
  }

  // 2. Hero Section Entrance Animation
  const heroSection = document.querySelector('.hero-section, .page-hero');
  if (heroSection) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    const badge = heroSection.querySelector('.hero-badge, .intro-badge, .section-badge');
    const heading = heroSection.querySelector('.hero-heading, h1');
    const desc = heroSection.querySelector('.hero-desc, p');
    const cta = heroSection.querySelector('.hero-cta-group, .hero-actions');
    const searchStrip = heroSection.querySelector('.hero-search-strip-box');

    if (badge) {
      heroTl.from(badge, { opacity: 0, y: -20, duration: 0.7 }, 0.1);
    }
    if (heading) {
      heroTl.from(heading, { opacity: 0, y: 35, duration: 0.9 }, '-=0.4');
    }
    if (desc) {
      heroTl.from(desc, { opacity: 0, y: 25, duration: 0.7 }, '-=0.5');
    }
    if (cta) {
      heroTl.from(cta, { opacity: 0, y: 20, duration: 0.7, clearProps: 'all' }, '-=0.4');
    }
    if (searchStrip) {
      heroTl.from(searchStrip, { opacity: 0, y: 30, duration: 0.8, clearProps: 'all' }, '-=0.4');
    }

    // Subtle parallax on hero background with mouse movement
    const heroBg = document.querySelector('.hero-bg-parallax');
    if (heroBg) {
      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 18;
        const y = (e.clientY / window.innerHeight - 0.5) * 18;
        gsap.to(heroBg, {
          x: x,
          y: y,
          duration: 1.2,
          ease: 'power1.out'
        });
      });
    }
  }

  // 3. Floating Adventure Decorations (Smooth infinite oscillation)
  const floatingElements = document.querySelectorAll('.floating-adventure-item');
  if (floatingElements.length) {
    floatingElements.forEach((el, index) => {
      gsap.to(el, {
        y: index % 2 === 0 ? -16 : 16,
        x: index % 3 === 0 ? 8 : -8,
        duration: 3 + (index * 0.4),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }

  // 4. Scroll-Triggered Stagger Animations for Grids & Cards
  if (typeof ScrollTrigger !== 'undefined') {
    // Animate every grid section independently
    const gridSelectors = [
      '.destination-grid-standard',
      '.packages-grid',
      '.activities-grid',
      '.exp-hero-grid',
      '.dest-intl-grid',
      '.gems-grid',
      '.testimonials-grid',
      '.gallery-masonry',
      '.features-grid',
      '.values-grid',
      '.team-grid',
      '.activity-highlights'
    ];

    gridSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(grid => {
        const cards = Array.from(grid.children).filter(el => !el.classList.contains('wave-divider'));
        if (cards.length > 0) {
          gsap.from(cards, {
            scrollTrigger: {
              trigger: grid,
              start: 'top 85%',
              once: true
            },
            opacity: 0,
            y: 40,
            stagger: 0.08,
            duration: 0.7,
            ease: 'power2.out',
            clearProps: 'transform,opacity' // Crucial: enables CSS :hover transforms to work 100%!
          });
        }
      });
    });

    // Feature Rows (e.g., in Destinations Mountain section & About page)
    document.querySelectorAll('.dest-feature-row, .about-split-row').forEach(row => {
      gsap.from(row, {
        scrollTrigger: {
          trigger: row,
          start: 'top 82%',
          once: true
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'transform,opacity'
      });
    });

    // Timeline Steps in How It Works
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineContainer) {
      const steps = timelineContainer.querySelectorAll('.timeline-step-item');
      if (steps.length) {
        gsap.from(steps, {
          scrollTrigger: {
            trigger: timelineContainer,
            start: 'top 80%',
            once: true
          },
          opacity: 0,
          y: 35,
          stagger: 0.15,
          duration: 0.75,
          ease: 'power2.out',
          clearProps: 'transform,opacity'
        });
      }
    }
  }

  // 5. KPI Counter Animations (Homepage, Dashboards)
  animateKpiCounters();
});

/**
 * Universal KPI Counter Animator
 * Can be called on load or when dashboard tabs change
 */
function animateKpiCounters() {
  if (typeof gsap === 'undefined') return;

  const counters = document.querySelectorAll('.kpi-counter:not([data-animated="true"])');
  if (!counters.length) return;

  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target') || '0');
    const prefix = counter.getAttribute('data-prefix') || '';
    const suffix = counter.getAttribute('data-suffix') || '';

    const runCount = () => {
      counter.setAttribute('data-animated', 'true');
      gsap.to({ val: 0 }, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: function() {
          const current = Math.floor(this.targets()[0].val);
          counter.innerText = prefix + (target >= 1000 ? current.toLocaleString('en-IN') : current) + suffix;
        }
      });
    };

    if (typeof ScrollTrigger !== 'undefined' && counter.closest('.section-padding, .hero-section')) {
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 90%',
        once: true,
        onEnter: runCount
      });
    } else {
      // In dashboards or visible viewport, run immediately
      runCount();
    }
  });
}
