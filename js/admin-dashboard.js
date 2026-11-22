/**
 * STACKLY Adventure Tourism — Executive Admin Dashboard (admin-dashboard.js)
 * Implements tab switching, mobile navigation, live expedition dispatch controls,
 * package catalog CRUD, master booking search/filters, and toast telemetry.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Scroll Reset
  window.scrollTo(0, 0);

  // 2. Tab Navigation
  const adminNavItems = document.querySelectorAll('.admin-sidebar .admin-nav-item[data-tab]');
  const adminTabPanels = document.querySelectorAll('.admin-tab-panel');

  function switchAdminTab(tabId) {
    if (!tabId) return;

    adminNavItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    adminTabPanels.forEach(panel => {
      if (panel.id === tabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    closeAdminMobileSidebar();

    if (history.pushState) {
      history.pushState(null, null, '#' + tabId);
    } else {
      location.hash = '#' + tabId;
    }
  }

  adminNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = item.getAttribute('data-tab');
      switchAdminTab(tabId);
    });
  });

  // Handle URL hash on load
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    switchAdminTab(hash);
  }

  // 3. Mobile Sidebar Controls
  const adminSidebar = document.getElementById('adminSidebar');
  const adminSidebarBackdrop = document.getElementById('adminSidebarBackdrop');
  const adminHamburgerBtn = document.getElementById('adminHamburgerBtn');
  const adminCloseBtn = document.getElementById('adminCloseBtn');

  function openAdminMobileSidebar() {
    if (adminSidebar && adminSidebarBackdrop) {
      adminSidebar.classList.add('active');
      adminSidebarBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAdminMobileSidebar() {
    if (adminSidebar && adminSidebarBackdrop) {
      adminSidebar.classList.remove('active');
      adminSidebarBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (adminHamburgerBtn) {
    adminHamburgerBtn.addEventListener('click', openAdminMobileSidebar);
  }

  if (adminCloseBtn) {
    adminCloseBtn.addEventListener('click', closeAdminMobileSidebar);
  }

  if (adminSidebarBackdrop) {
    adminSidebarBackdrop.addEventListener('click', closeAdminMobileSidebar);
  }

  // 4. Dropdowns: Notification Bell & Admin Profile
  const notifBellBtn = document.getElementById('notifBellBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const adminProfileBtn = document.getElementById('adminProfileBtn');
  const adminProfileDropdown = document.getElementById('adminProfileDropdown');

  if (notifBellBtn && notifDropdown) {
    notifBellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('active');
      if (adminProfileDropdown) adminProfileDropdown.classList.remove('active');
    });
  }

  if (adminProfileBtn && adminProfileDropdown) {
    adminProfileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      adminProfileDropdown.classList.toggle('active');
      if (notifDropdown) notifDropdown.classList.remove('active');
    });
  }

  document.addEventListener('click', (e) => {
    if (notifDropdown && !notifDropdown.contains(e.target) && notifBellBtn && !notifBellBtn.contains(e.target)) {
      notifDropdown.classList.remove('active');
    }
    if (adminProfileDropdown && !adminProfileDropdown.contains(e.target) && adminProfileBtn && !adminProfileBtn.contains(e.target)) {
      adminProfileDropdown.classList.remove('active');
    }
  });

  // 5. Advance Status for Live Expedition Dispatch Tickets
  const advanceStatusBtns = document.querySelectorAll('.btn-advance-status');
  const statusCycle = [
    { label: 'Ascent in Progress', class: 'warning', icon: 'fa-person-hiking' },
    { label: 'Summit Push Active', class: 'danger', icon: 'fa-flag' },
    { label: 'Descending to Base', class: 'info', icon: 'fa-person-walking-arrow-right' },
    { label: 'Expedition Completed', class: 'success', icon: 'fa-check-circle' }
  ];

  advanceStatusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const ticketId = btn.getAttribute('data-ticket');
      const ticketElem = document.getElementById(ticketId);
      if (!ticketElem) return;

      const badge = ticketElem.querySelector('.ticket-status-badge');
      if (!badge) return;

      const currentText = badge.textContent.trim();
      let nextIndex = 0;
      for (let i = 0; i < statusCycle.length; i++) {
        if (currentText.includes(statusCycle[i].label)) {
          nextIndex = (i + 1) % statusCycle.length;
          break;
        }
      }

      const nextStatus = statusCycle[nextIndex];
      badge.className = `status-pill ${nextStatus.class} ticket-status-badge`;
      badge.innerHTML = `<i class="fa-solid ${nextStatus.icon}"></i> ${nextStatus.label}`;

      showToast('Status Advanced', `${ticketElem.querySelector('.ticket-title').textContent} is now: ${nextStatus.label}.`);
    });
  });

  // 6. Search & Filters for Packages Catalog
  const packageSearchInput = document.getElementById('packageSearchInput');
  const packageDifficultyFilter = document.getElementById('packageDifficultyFilter');

  function filterPackages() {
    const query = (packageSearchInput ? packageSearchInput.value : '').toLowerCase().trim();
    const difficulty = (packageDifficultyFilter ? packageDifficultyFilter.value : 'all').toLowerCase();
    const packageCards = document.querySelectorAll('.admin-package-card');

    packageCards.forEach(card => {
      const title = (card.getAttribute('data-title') || card.querySelector('.pkg-title')?.textContent || '').toLowerCase();
      const cardDiff = (card.getAttribute('data-difficulty') || '').toLowerCase();

      const matchesQuery = !query || title.includes(query);
      const matchesDiff = difficulty === 'all' || cardDiff === difficulty;

      if (matchesQuery && matchesDiff) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (packageSearchInput) packageSearchInput.addEventListener('input', filterPackages);
  if (packageDifficultyFilter) packageDifficultyFilter.addEventListener('change', filterPackages);

  // 7. Search & Filters for Bookings Ledger
  const bookingSearchInput = document.getElementById('bookingSearchInput');
  const bookingStatusFilter = document.getElementById('bookingStatusFilter');

  function filterBookings() {
    const query = (bookingSearchInput ? bookingSearchInput.value : '').toLowerCase().trim();
    const status = (bookingStatusFilter ? bookingStatusFilter.value : 'all').toLowerCase();
    const rows = document.querySelectorAll('#bookingsTable tbody tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const statusPill = row.querySelector('.status-pill')?.textContent.toLowerCase() || '';

      const matchesQuery = !query || text.includes(query);
      let matchesStatus = true;
      if (status === 'confirmed') matchesStatus = statusPill.includes('confirmed');
      else if (status === 'progress') matchesStatus = statusPill.includes('progress') || statusPill.includes('preparation');
      else if (status === 'completed') matchesStatus = statusPill.includes('completed');

      if (matchesQuery && matchesStatus) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (bookingSearchInput) bookingSearchInput.addEventListener('input', filterBookings);
  if (bookingStatusFilter) bookingStatusFilter.addEventListener('change', filterBookings);

  // 8. Search & Filters for Field Dispatch Telemetry
  const dispatchSearchInput = document.getElementById('dispatchSearchInput');
  const dispatchStatusFilter = document.getElementById('dispatchStatusFilter');

  function filterDispatch() {
    const query = (dispatchSearchInput ? dispatchSearchInput.value : '').toLowerCase().trim();
    const status = (dispatchStatusFilter ? dispatchStatusFilter.value : 'all').toLowerCase();
    const rows = document.querySelectorAll('#dispatchTable tbody tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const statusPill = row.querySelector('.status-pill')?.textContent.toLowerCase() || '';

      const matchesQuery = !query || text.includes(query);
      let matchesStatus = true;
      if (status === 'ascent') matchesStatus = statusPill.includes('ascent');
      else if (status === 'briefing') matchesStatus = statusPill.includes('briefing') || statusPill.includes('river');
      else if (status === 'summit') matchesStatus = statusPill.includes('summit') || statusPill.includes('flight');

      if (matchesQuery && matchesStatus) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (dispatchSearchInput) dispatchSearchInput.addEventListener('input', filterDispatch);
  if (dispatchStatusFilter) dispatchStatusFilter.addEventListener('change', filterDispatch);

  // 9. Add Tour Package Modal Handlers
  const addPackageModal = document.getElementById('addPackageModal');
  const openAddPackageBtn = document.getElementById('openAddPackageBtn');
  const openAddPackageBtn2 = document.getElementById('openAddPackageBtn2');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const addPackageForm = document.getElementById('addPackageForm');

  function openAddModal() {
    if (addPackageModal) {
      addPackageModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAddModal() {
    if (addPackageModal) {
      addPackageModal.classList.remove('active');
      document.body.style.overflow = '';
      if (addPackageForm) addPackageForm.reset();
    }
  }

  if (openAddPackageBtn) openAddPackageBtn.addEventListener('click', openAddModal);
  if (openAddPackageBtn2) openAddPackageBtn2.addEventListener('click', openAddModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeAddModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeAddModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeAddModal);

  // Add Package Form Submission
  if (addPackageForm) {
    addPackageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('pkgTitle').value.trim();
      const region = document.getElementById('pkgRegion').value.trim();
      const duration = document.getElementById('pkgDuration').value.trim();
      const difficulty = document.getElementById('pkgDifficulty').value;
      const price = document.getElementById('pkgPrice').value.trim();
      const desc = document.getElementById('pkgDesc').value.trim() || 'Custom guided high-altitude expedition.';

      if (!title || !price) return;

      const packagesContainer = document.getElementById('packagesContainer');
      if (packagesContainer) {
        const newCard = document.createElement('div');
        newCard.className = 'admin-package-card';
        newCard.setAttribute('data-title', title);
        newCard.setAttribute('data-difficulty', difficulty);

        const diffBadgeClass = difficulty === 'extreme' ? 'extreme' : (difficulty === 'hard' ? 'hard' : (difficulty === 'easy' ? 'easy' : 'moderate'));

        newCard.innerHTML = `
          <div class="pkg-thumb-wrap">
            <img src="assets/images/himalayas.webp" alt="${title}" class="pkg-thumb-img">
            <span class="pkg-badge-diff ${diffBadgeClass}">${difficulty.toUpperCase()}</span>
          </div>
          <div class="pkg-body">
            <h4 class="pkg-title">${title}</h4>
            <span class="pkg-location"><i class="fa-solid fa-location-dot" style="color:var(--dash-primary);"></i> ${region}</span>
            <p style="font-size:0.78rem; color:var(--text-light); line-height:1.4;">${duration} &bull; ${desc}</p>
            <div class="pkg-meta-row">
              <span class="pkg-price">₹${Number(price).toLocaleString('en-IN')}</span>
              <div class="pkg-actions">
                <button class="table-action-btn" title="Edit" onclick="showToast('Edit Package', 'Editing ${title}.');"><i class="fa-solid fa-pen"></i></button>
                <button class="table-action-btn delete" title="Delete" onclick="deletePackageCard(this);"><i class="fa-solid fa-trash"></i></button>
              </div>
            </div>
          </div>
        `;

        packagesContainer.prepend(newCard);
      }

      closeAddModal();
      showToast('Package Added', `"${title}" has been successfully added to the live catalog.`);
    });
  }

  // 10. Sync Admin Profile from localStorage if available
  try {
    const savedUser = JSON.parse(localStorage.getItem('stackly_user') || '{}');
    if (savedUser && savedUser.name) {
      document.querySelectorAll('.sync-admin-name').forEach(el => el.textContent = savedUser.name);
      const initials = savedUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      document.querySelectorAll('.sync-admin-avatar').forEach(el => el.textContent = initials);
      if (savedUser.email) {
        document.querySelectorAll('.sync-admin-email').forEach(el => el.textContent = savedUser.email);
      }
    }
  } catch (err) {
    console.warn('Profile sync:', err);
  }
});

// Helper: Delete Package Card
window.deletePackageCard = function(btn) {
  const card = btn.closest('.admin-package-card');
  if (card) {
    const title = card.querySelector('.pkg-title')?.textContent || 'Package';
    card.remove();
    showToast('Package Removed', `"${title}" was removed from the live catalog.`);
  }
};

// Global Toast System
window.showToast = function(title, desc, iconClass = 'fa-circle-check') {
  const toast = document.getElementById('dashToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastDesc = document.getElementById('toastDesc');
  const toastIcon = document.getElementById('toastIcon');

  if (!toast) return;

  if (toastTitle) toastTitle.textContent = title || 'Notification';
  if (toastDesc) toastDesc.textContent = desc || '';
  if (toastIcon) toastIcon.className = `fa-solid ${iconClass} toast-icon`;

  toast.classList.add('show');

  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
};
