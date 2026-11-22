/**
 * STACKLY ADVENTURE TOURISM — PACKAGES SCRIPT (js/packages.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('allPackagesContainer');
  const searchInput = document.getElementById('pkgSearchInput');
  const destFilter = document.getElementById('pkgDestFilter');
  const actFilter = document.getElementById('pkgActFilter');
  const budgetFilter = document.getElementById('pkgBudgetFilter');
  const durationFilter = document.getElementById('pkgDurationFilter');
  const sortSelect = document.getElementById('pkgSortSelect');
  const activeTagsContainer = document.getElementById('pkgActiveTags');

  // Check URL query parameters (e.g. from hero search or customizer: ?destination=Manali)
  const urlParams = new URLSearchParams(window.location.search);
  const qDest = urlParams.get('destination');
  const qAct = urlParams.get('activity');
  const qId = urlParams.get('id');

  if (qDest && destFilter) destFilter.value = qDest;
  if (qAct && actFilter) actFilter.value = qAct;

  function renderPackages() {
    if (!container || typeof Storage === 'undefined') return;
    let packages = Storage.getPackages();

    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const dest = destFilter ? destFilter.value : 'all';
    const act = actFilter ? actFilter.value : 'all';
    const budget = budgetFilter ? budgetFilter.value : 'all';
    const duration = durationFilter ? durationFilter.value : 'all';
    const sort = sortSelect ? sortSelect.value : 'default';

    // Filter
    packages = packages.filter(p => {
      const matchQuery = !query || p.title.toLowerCase().includes(query) || p.location.toLowerCase().includes(query);
      const matchDest = dest === 'all' || p.destination.toLowerCase().includes(dest.toLowerCase());
      const matchAct = act === 'all' || p.activity.toLowerCase().includes(act.toLowerCase());

      let matchBudget = true;
      if (budget === 'under10k') matchBudget = p.price < 10000;
      else if (budget === '10k-20k') matchBudget = p.price >= 10000 && p.price <= 20000;
      else if (budget === 'above20k') matchBudget = p.price > 20000;

      let matchDuration = true;
      if (duration === 'short') matchDuration = p.durationDays <= 3;
      else if (duration === 'medium') matchDuration = p.durationDays >= 4 && p.durationDays <= 6;
      else if (duration === 'long') matchDuration = p.durationDays >= 7;

      return matchQuery && matchDest && matchAct && matchBudget && matchDuration;
    });

    // Sort
    if (sort === 'price-low') {
      packages.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      packages.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      packages.sort((a, b) => b.rating - a.rating);
    }

    // Render active tags
    if (activeTagsContainer) {
      let tagsHtml = '';
      if (dest !== 'all') tagsHtml += `<span class="filter-tag">Destination: ${dest} <i class="fa-solid fa-xmark tag-remove" onclick="clearFilter('dest')"></i></span>`;
      if (act !== 'all') tagsHtml += `<span class="filter-tag">Activity: ${act} <i class="fa-solid fa-xmark tag-remove" onclick="clearFilter('act')"></i></span>`;
      if (budget !== 'all') tagsHtml += `<span class="filter-tag">Budget: ${budget} <i class="fa-solid fa-xmark tag-remove" onclick="clearFilter('budget')"></i></span>`;
      if (duration !== 'all') tagsHtml += `<span class="filter-tag">Duration: ${duration} <i class="fa-solid fa-xmark tag-remove" onclick="clearFilter('dur')"></i></span>`;
      activeTagsContainer.innerHTML = tagsHtml;
    }

    if (packages.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <i class="fa-solid fa-compass" style="font-size: 3rem; color: var(--accent); margin-bottom: 1rem;"></i>
          <h3>No matching adventure packages found</h3>
          <p style="margin-top: 0.5rem; color: var(--text-muted);">Try adjusting your search criteria or resetting filters.</p>
        </div>
      `;
      return;
    }

    const wishlist = Storage.getWishlist();

    container.innerHTML = packages.map(pkg => {
      const isWishlisted = wishlist.includes(pkg.id);
      return `
        <div class="package-card" data-package-id="${pkg.id}">
          <div class="pkg-img-wrap">
            <img src="${pkg.image}" alt="${pkg.title}" loading="lazy">
            <button class="pkg-wishlist-btn ${isWishlisted ? 'active' : ''}" data-wishlist-id="${pkg.id}" onclick="handleWishlistClick(event, '${pkg.id}')" title="Save to Wishlist">
              <i class="fa-solid fa-heart"></i>
            </button>
            <div class="pkg-meta-top">
              <span class="badge-difficulty ${pkg.difficulty.toLowerCase()}">${pkg.difficulty}</span>
              <span class="badge-rating"><i class="fa-solid fa-star"></i> ${pkg.rating} (${pkg.reviews})</span>
            </div>
          </div>
          <div class="pkg-body">
            <div class="pkg-location"><i class="fa-solid fa-location-dot"></i> ${pkg.location}</div>
            <h3 class="pkg-title">${pkg.title}</h3>
            <p class="pkg-desc">${pkg.desc}</p>
            <div class="pkg-specs">
              <div class="pkg-spec-item"><i class="fa-solid fa-clock"></i> ${pkg.duration}</div>
              <div class="pkg-spec-item"><i class="fa-solid fa-users"></i> ${pkg.groupSize}</div>
            </div>
            <div class="pkg-footer">
              <div class="pkg-price-wrap">
                <span class="pkg-price-label">Starting From</span>
                <span class="pkg-price">${formatCurrency(pkg.price)}</span>
              </div>
              <div class="pkg-actions">
                <button class="btn btn-outline btn-sm" onclick="openPackageDetailModal('${pkg.id}')">Details</button>
                <button class="btn btn-primary btn-sm" onclick="openBookingModal('${pkg.id}')">Book Now</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (typeof gsap !== 'undefined') {
      gsap.from(container.children, {
        opacity: 0,
        y: 25,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
        clearProps: 'transform,opacity'
      });
    }

    if (qId) {
      setTimeout(() => openPackageDetailModal(qId), 400);
    }
  }

  // Clear specific filter function
  window.clearFilter = (type) => {
    if (type === 'dest' && destFilter) destFilter.value = 'all';
    if (type === 'act' && actFilter) actFilter.value = 'all';
    if (type === 'budget' && budgetFilter) budgetFilter.value = 'all';
    if (type === 'dur' && durationFilter) durationFilter.value = 'all';
    renderPackages();
  };

  if (searchInput) searchInput.addEventListener('input', renderPackages);
  if (destFilter) destFilter.addEventListener('change', renderPackages);
  if (actFilter) actFilter.addEventListener('change', renderPackages);
  if (budgetFilter) budgetFilter.addEventListener('change', renderPackages);
  if (durationFilter) durationFilter.addEventListener('change', renderPackages);
  if (sortSelect) sortSelect.addEventListener('change', renderPackages);

  renderPackages();
});

function openPackageDetailModal(pkgId) {
  if (typeof Storage === 'undefined') return;
  const pkg = Storage.getPackageById(pkgId);
  if (!pkg) return;

  let modal = document.getElementById('packageDetailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'packageDetailModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const includedHtml = (pkg.included || [
    'Professional Adventure Guide',
    'Permits & Forest Passes',
    'Camp Equipment / Stay',
    'First Aid & Safety Briefing'
  ]).map(item => `
    <li style="display:flex; align-items:center; gap:0.5rem; font-size:0.88rem; color:var(--text-muted); margin-bottom:0.4rem;">
      <i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> ${item}
    </li>
  `).join('');

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 650px; padding:0; overflow:hidden;">
      <button class="modal-close" onclick="closePackageModal()"><i class="fa-solid fa-xmark"></i></button>
      <div style="height:260px; position:relative;">
        <img src="${pkg.image}" alt="${pkg.title}" style="width:100%; height:100%; object-fit:cover;">
        <div style="position:absolute; bottom:1rem; left:1.5rem; display:flex; gap:0.6rem;">
          <span class="badge-difficulty ${pkg.difficulty.toLowerCase()}">${pkg.difficulty}</span>
          <span class="badge-rating"><i class="fa-solid fa-star"></i> ${pkg.rating}</span>
        </div>
      </div>
      <div style="padding: 1.75rem;">
        <span style="color:var(--accent); font-size:0.85rem; font-weight:600;"><i class="fa-solid fa-location-dot"></i> ${pkg.location}</span>
        <h2 style="font-size:1.5rem; font-weight:700; margin:0.3rem 0 0.75rem;">${pkg.title}</h2>
        <p style="font-size:0.92rem; line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">${pkg.desc}</p>
        
        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:var(--radius-sm); padding:1rem; margin-bottom:1.5rem;">
          <h4 style="font-size:0.95rem; font-weight:600; margin-bottom:0.6rem; color:var(--secondary);">What's Included:</h4>
          <ul style="list-style:none;">${includedHtml}</ul>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid rgba(255,255,255,0.08); padding-top:1.25rem;">
          <div>
            <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Price per explorer</span>
            <div style="font-size:1.6rem; font-weight:800; color:var(--primary);">${formatCurrency(pkg.price)}</div>
          </div>
          <div style="display:flex; gap:0.75rem;">
            <button class="btn btn-outline btn-sm" onclick="closePackageModal()">Close</button>
            <button class="btn btn-primary btn-sm" onclick="closePackageModal(); openBookingModal('${pkg.id}')">Book This Trip</button>
          </div>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
}

function closePackageModal() {
  const modal = document.getElementById('packageDetailModal');
  if (modal) modal.classList.remove('active');
}
