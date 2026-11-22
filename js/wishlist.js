/**
 * STACKLY ADVENTURE TOURISM — WISHLIST SCRIPT (js/wishlist.js)
 * Wishlist manager and persistence with LocalStorage
 */

function handleWishlistClick(e, pkgId) {
  e.stopPropagation();
  e.preventDefault();

  if (typeof Storage === 'undefined') return;

  const added = Storage.toggleWishlist(pkgId);
  const pkg = Storage.getPackageById(pkgId);
  const title = pkg ? pkg.title : 'Adventure Package';

  // Update all instances of this heart button on page
  document.querySelectorAll(`[data-wishlist-id="${pkgId}"]`).forEach(btn => {
    btn.classList.toggle('active', added);
  });

  if (added) {
    showToast('Saved to Wishlist', `${title} added to your saved adventures.`, 'accent');
  } else {
    showToast('Removed from Wishlist', `${title} removed from wishlist.`);
  }

  // If on client dashboard wishlist tab, trigger refresh
  if (typeof refreshWishlistUI === 'function') {
    refreshWishlistUI();
  }
}

function syncWishlistButtons() {
  if (typeof Storage === 'undefined') return;
  const list = Storage.getWishlist();
  document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
    const id = btn.getAttribute('data-wishlist-id');
    if (list.includes(id)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', syncWishlistButtons);
