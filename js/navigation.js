/**
 * STACKLY ADVENTURE TOURISM — NAVIGATION SCRIPT (js/navigation.js)
 * Sticky header, active page indicator, mobile drawer, search overlay
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-menu-drawer');
  const backdrop = document.querySelector('.mobile-menu-backdrop');
  const searchBtn = document.querySelector('.btn-search-trigger');
  const searchOverlay = document.getElementById('searchModalOverlay');
  const searchClose = document.getElementById('searchModalClose');
  const searchInput = document.getElementById('globalSearchInput');
  const searchResults = document.getElementById('globalSearchResults');

  // Sticky Navbar with scroll detection
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Active link detection based on pathname
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  // Mobile menu toggle
  if (toggleBtn && drawer && backdrop) {
    const openMenu = () => {
      toggleBtn.classList.add('open');
      drawer.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      toggleBtn.classList.remove('open');
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    };

    toggleBtn.addEventListener('click', () => {
      if (drawer.classList.contains('open')) closeMenu();
      else openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    document.querySelectorAll('.mobile-nav-list a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });
  }

  // Global search modal
  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      if (searchInput) {
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 100);
      }
      renderSearchResults('');
    });

    if (searchClose) {
      searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
      });
    }

    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) {
        searchOverlay.classList.remove('active');
      }
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderSearchResults(e.target.value.trim().toLowerCase());
      });
    }
  }

  function renderSearchResults(query) {
    if (!searchResults) return;
    if (typeof Storage === 'undefined') return;

    const packages = Storage.getPackages();
    const destinations = Storage.getDestinations();

    let matches = [];
    if (!query) {
      matches = packages.slice(0, 4).map(p => ({
        type: 'Package',
        title: p.title,
        sub: `${p.location} • ${formatCurrency(p.price)}`,
        link: `Services.html?id=${p.id}`
      }));
    } else {
      packages.filter(p => p.title.toLowerCase().includes(query) || p.destination.toLowerCase().includes(query) || p.activity.toLowerCase().includes(query))
        .forEach(p => {
          matches.push({
            type: 'Package',
            title: p.title,
            sub: `${p.location} • ${formatCurrency(p.price)}`,
            link: `Services.html?id=${p.id}`
          });
        });

      destinations.filter(d => d.name.toLowerCase().includes(query) || d.category.toLowerCase().includes(query))
        .forEach(d => {
          matches.push({
            type: 'Destination',
            title: d.name,
            sub: `${d.category} • ${d.region}`,
            link: `Destinations.html?id=${d.id}`
          });
        });
    }

    if (matches.length === 0) {
      searchResults.innerHTML = `<p style="padding:1rem;color:var(--text-muted);text-align:center;">No matching adventures found for "${query}".</p>`;
      return;
    }

    searchResults.innerHTML = matches.map(m => `
      <a href="${m.link}" class="search-result-item">
        <i class="fa-solid ${m.type === 'Package' ? 'fa-mountain-sun' : 'fa-location-dot'}" style="color:var(--accent);"></i>
        <div>
          <div style="font-weight:600;font-size:0.95rem;">${m.title}</div>
          <div style="font-size:0.8rem;color:var(--text-muted);">${m.sub}</div>
        </div>
      </a>
    `).join('');
  }
});
