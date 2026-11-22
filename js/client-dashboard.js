/**
 * STACKLY Adventure Tourism — Explorer Client Dashboard (client-dashboard.js)
 * Implements sidebar tab switching, mobile navigation, journey milestone tracking,
 * interactive gear packing checklist, profile persistence, and toast feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Scroll Reset
  window.scrollTo(0, 0);

  // 2. Tab Navigation
  const sidebarItems = document.querySelectorAll('.dash-sidebar .sidebar-item[data-tab]');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function switchTab(tabId) {
    if (!tabId) return;

    sidebarItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    tabPanels.forEach(panel => {
      if (panel.id === tabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    closeMobileSidebar();

    if (history.pushState) {
      history.pushState(null, null, '#' + tabId);
    } else {
      location.hash = '#' + tabId;
    }
  }

  sidebarItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Handle URL hash on load
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    switchTab(hash);
  }

  // 3. Mobile Sidebar Controls
  const dashSidebar = document.getElementById('dashSidebar');
  const dashSidebarBackdrop = document.getElementById('dashSidebarBackdrop');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  function openMobileSidebar() {
    if (dashSidebar && dashSidebarBackdrop) {
      dashSidebar.classList.add('active');
      dashSidebarBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileSidebar() {
    if (dashSidebar && dashSidebarBackdrop) {
      dashSidebar.classList.remove('active');
      dashSidebarBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openMobileSidebar);
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  }

  if (dashSidebarBackdrop) {
    dashSidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  // 4. Dropdowns: Notification Bell & User Profile
  const notifBellBtn = document.getElementById('notifBellBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const userProfileBtn = document.getElementById('userProfileBtn');
  const userProfileDropdown = document.getElementById('userProfileDropdown');

  if (notifBellBtn && notifDropdown) {
    notifBellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('active');
      if (userProfileDropdown) userProfileDropdown.classList.remove('active');
    });
  }

  if (userProfileBtn && userProfileDropdown) {
    userProfileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userProfileDropdown.classList.toggle('active');
      if (notifDropdown) notifDropdown.classList.remove('active');
    });
  }

  document.addEventListener('click', (e) => {
    if (notifDropdown && !notifDropdown.contains(e.target) && notifBellBtn && !notifBellBtn.contains(e.target)) {
      notifDropdown.classList.remove('active');
    }
    if (userProfileDropdown && !userProfileDropdown.contains(e.target) && userProfileBtn && !userProfileBtn.contains(e.target)) {
      userProfileDropdown.classList.remove('active');
    }
  });

  // 5. Interactive 5-Step Journey Progress Tracker
  const trackerSteps = document.querySelectorAll('.tracker-step');
  const trackerFill = document.getElementById('trackerFill');

  trackerSteps.forEach((step, index) => {
    step.addEventListener('click', () => {
      trackerSteps.forEach((s, idx) => {
        if (idx < index) {
          s.className = 'tracker-step completed';
          s.querySelector('.step-node').innerHTML = '<i class="fa-solid fa-check"></i>';
        } else if (idx === index) {
          s.className = 'tracker-step active';
          s.querySelector('.step-node').innerHTML = '<i class="fa-solid fa-person-hiking"></i>';
        } else {
          s.className = 'tracker-step';
          const icon = idx === 4 ? 'fa-flag' : 'fa-circle-dot';
          s.querySelector('.step-node').innerHTML = `<i class="fa-solid ${icon}"></i>`;
        }
      });

      if (trackerFill) {
        const percent = Math.min(100, Math.round((index / (trackerSteps.length - 1)) * 100));
        trackerFill.style.width = percent + '%';
      }
    });
  });

  // 6. Interactive Gear Packing Checklist
  const gearCheckboxes = document.querySelectorAll('#gearChecklist .gear-checkbox');
  const gearPackCount = document.getElementById('gearPackCount');
  const gearProgressFill = document.getElementById('gearProgressFill');

  function updateGearProgress() {
    if (!gearCheckboxes.length) return;
    let checkedCount = 0;
    const states = [];

    gearCheckboxes.forEach((cb, idx) => {
      if (cb.checked) checkedCount++;
      states.push(cb.checked);
    });

    const percent = Math.round((checkedCount / gearCheckboxes.length) * 100);

    if (gearPackCount) {
      gearPackCount.textContent = `${checkedCount} of ${gearCheckboxes.length} Packed (${percent}%)`;
    }
    if (gearProgressFill) {
      gearProgressFill.style.width = percent + '%';
    }

    try {
      localStorage.setItem('stackly_gear_state', JSON.stringify(states));
    } catch (e) {
      console.warn('Gear checklist storage:', e);
    }
  }

  // Restore Gear Checklist from localStorage
  try {
    const savedGear = JSON.parse(localStorage.getItem('stackly_gear_state') || '[]');
    if (Array.isArray(savedGear) && savedGear.length === gearCheckboxes.length) {
      gearCheckboxes.forEach((cb, idx) => {
        cb.checked = savedGear[idx];
      });
    }
  } catch (e) {
    console.warn('Gear load:', e);
  }

  gearCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      updateGearProgress();
      if (cb.checked) {
        showToast('Gear Packed', `${cb.nextElementSibling.textContent.substring(0, 36)}... checked off.`);
      }
    });
  });
  updateGearProgress();

  // 7. Profile Form & LocalStorage Synchronization
  const travelerProfileForm = document.getElementById('travelerProfileForm');

  function syncProfileUI(userData) {
    if (!userData) return;
    const name = userData.name || 'Alex Morgan';
    const email = userData.email || 'alex.morgan@stackly.com';
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    document.querySelectorAll('.sync-user-name').forEach(el => el.textContent = name);
    document.querySelectorAll('.sync-user-email').forEach(el => el.textContent = email);
    document.querySelectorAll('.sync-user-avatar').forEach(el => el.textContent = initials);

    const inputName = document.getElementById('profileFullName');
    const inputEmail = document.getElementById('profileEmail');
    const inputPhone = document.getElementById('profilePhone');
    const inputEmergency = document.getElementById('profileEmergency');

    if (inputName && userData.name) inputName.value = userData.name;
    if (inputEmail && userData.email) inputEmail.value = userData.email;
    if (inputPhone && userData.phone) inputPhone.value = userData.phone;
    if (inputEmergency && userData.emergency) inputEmergency.value = userData.emergency;
  }

  // Load existing profile from localStorage
  try {
    const savedUser = JSON.parse(localStorage.getItem('stackly_user') || '{}');
    if (savedUser && savedUser.name) {
      syncProfileUI(savedUser);
    }
  } catch (err) {
    console.warn('Profile read:', err);
  }

  if (travelerProfileForm) {
    travelerProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('profileFullName').value.trim();
      const email = document.getElementById('profileEmail').value.trim();
      const phone = document.getElementById('profilePhone').value.trim();
      const emergency = document.getElementById('profileEmergency').value.trim();

      const userObj = {
        name: name || 'Alex Morgan',
        email: email || 'alex.morgan@stackly.com',
        phone: phone,
        emergency: emergency
      };

      try {
        localStorage.setItem('stackly_user', JSON.stringify(userObj));
      } catch (err) {
        console.warn('Profile write:', err);
      }

      syncProfileUI(userObj);
      showToast('Profile Saved', 'Your traveler profile and emergency details have been updated.');
    });
  }
});

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
