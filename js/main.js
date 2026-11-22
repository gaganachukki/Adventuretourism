/**
 * STACKLY ADVENTURE TOURISM — MAIN GLOBAL SCRIPT (js/main.js)
 * Global utilities, Toast system, Lightbox, Shared Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inject Toast Container if not present
  if (!document.getElementById('toastContainer')) {
    const toastBox = document.createElement('div');
    toastBox.id = 'toastContainer';
    toastBox.className = 'toast-container';
    document.body.appendChild(toastBox);
  }

  // Preloader removal
  const preloader = document.querySelector('.site-preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => preloader.remove(), 400);
    }, 300);
  }

  // Initialize common modal close buttons
  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el) {
        const overlay = el.closest('.modal-overlay');
        if (overlay) overlay.classList.remove('active');
      }
    });
  });

  // Attach Escape key listener for open modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active, .lightbox-modal.active, .search-modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
      });
    }
  });
});

/**
 * Show a toast notification
 * @param {string} title
 * @param {string} message
 * @param {'primary'|'accent'} type
 */
function showToast(title, message, type = 'primary') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'accent' ? 'toast-accent' : ''}`;
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fa-solid ${type === 'accent' ? 'fa-circle-check' : 'fa-compass'}"></i>
    </div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(60px)';
    toast.style.transition = 'all 0.35s ease';
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

/**
 * Format Indian Rupee currency
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Lightbox viewer
 */
let currentLightboxImages = [];
let currentLightboxIndex = 0;

function openLightbox(imgSrc, galleryGroup = []) {
  let modal = document.getElementById('globalLightbox');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'globalLightbox';
    modal.className = 'lightbox-modal';
    modal.innerHTML = `
      <div class="modal-close" onclick="closeLightbox()"><i class="fa-solid fa-xmark"></i></div>
      <div class="lightbox-nav lightbox-prev" onclick="prevLightbox()"><i class="fa-solid fa-chevron-left"></i></div>
      <img id="lightboxImg" class="lightbox-img" src="" alt="Adventure Preview">
      <div class="lightbox-nav lightbox-next" onclick="nextLightbox()"><i class="fa-solid fa-chevron-right"></i></div>
    `;
    document.body.appendChild(modal);
  }

  currentLightboxImages = galleryGroup.length ? galleryGroup : [imgSrc];
  currentLightboxIndex = currentLightboxImages.indexOf(imgSrc);
  if (currentLightboxIndex < 0) currentLightboxIndex = 0;

  document.getElementById('lightboxImg').src = currentLightboxImages[currentLightboxIndex];
  modal.classList.add('active');
}

function closeLightbox() {
  const modal = document.getElementById('globalLightbox');
  if (modal) modal.classList.remove('active');
}

function prevLightbox() {
  if (currentLightboxImages.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
  document.getElementById('lightboxImg').src = currentLightboxImages[currentLightboxIndex];
}

function nextLightbox() {
  if (currentLightboxImages.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
  document.getElementById('lightboxImg').src = currentLightboxImages[currentLightboxIndex];
}
