/**
 * STACKLY ADVENTURE TOURISM — DESTINATIONS SCRIPT (js/destinations.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('destSearchInput');
  const regionSelect = document.getElementById('destRegionSelect');
  const catSelect = document.getElementById('destCategorySelect');
  const cards = document.querySelectorAll('.dest-card-standard');

  function filterDestinations() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const region = regionSelect ? regionSelect.value : 'all';
    const category = catSelect ? catSelect.value : 'all';

    cards.forEach(card => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const cardRegion = card.getAttribute('data-region') || 'all';
      const cardCat = card.getAttribute('data-category') || 'all';

      const matchesQuery = !query || name.includes(query);
      const matchesRegion = region === 'all' || cardRegion === region;
      const matchesCat = category === 'all' || cardCat.includes(category);

      if (matchesQuery && matchesRegion && matchesCat) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterDestinations);
  if (regionSelect) regionSelect.addEventListener('change', filterDestinations);
  if (catSelect) catSelect.addEventListener('change', filterDestinations);
});

function openDestinationModal(destName, region, category, desc, image) {
  let modal = document.getElementById('destDetailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'destDetailModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 600px; padding: 0; overflow:hidden;">
      <button class="modal-close" onclick="closeDestModal()"><i class="fa-solid fa-xmark"></i></button>
      <div style="height: 250px; position:relative;">
        <img src="${image}" alt="${destName}" style="width:100%; height:100%; object-fit:cover;">
        <div style="position:absolute; bottom:1rem; left:1.5rem; background:rgba(0,0,0,0.6); backdrop-filter:blur(6px); padding:0.35rem 0.8rem; border-radius:999px; font-size:0.8rem; color:var(--primary); font-weight:600;">
          <i class="fa-solid fa-location-dot"></i> ${region}
        </div>
      </div>
      <div style="padding: 1.75rem;">
        <span class="badge-difficulty moderate" style="margin-bottom:0.6rem;">${category}</span>
        <h3 style="font-size:1.6rem; font-weight:700; margin-bottom:0.75rem;">${destName}</h3>
        <p style="font-size:0.92rem; line-height:1.7; color:var(--text-muted); margin-bottom:1.5rem;">${desc}</p>
        <div style="display:flex; gap:1rem; justify-content:flex-end; border-top:1px solid rgba(255,255,255,0.08); padding-top:1.25rem;">
          <button class="btn btn-outline btn-sm" onclick="closeDestModal()">Close</button>
          <a href="Services.html?destination=${encodeURIComponent(destName.split(',')[0])}" class="btn btn-primary btn-sm">
            View Packages <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
}

function closeDestModal() {
  const modal = document.getElementById('destDetailModal');
  if (modal) modal.classList.remove('active');
}
