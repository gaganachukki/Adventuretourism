/**
 * STACKLY ADVENTURE TOURISM — EXPERIENCES SCRIPT (js/experiences.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  const pills = document.querySelectorAll('.exp-filter-pill');
  const cards = document.querySelectorAll('.exp-card');
  const searchInput = document.getElementById('expSearchInput');

  function filterExperiences() {
    const activePill = document.querySelector('.exp-filter-pill.active');
    const category = activePill ? activePill.getAttribute('data-category') : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    cards.forEach(card => {
      const cardCat = card.getAttribute('data-category') || 'all';
      const cardTitle = (card.querySelector('.exp-title')?.textContent || '').toLowerCase();

      const matchCategory = category === 'all' || cardCat === category;
      const matchQuery = !query || cardTitle.includes(query);

      if (matchCategory && matchQuery) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterExperiences();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterExperiences);
  }
});

function openExperienceModal(title, category, duration, difficulty, desc, image) {
  let modal = document.getElementById('experienceDetailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'experienceDetailModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 600px; padding: 0; overflow:hidden;">
      <button class="modal-close" onclick="closeExperienceModal()"><i class="fa-solid fa-xmark"></i></button>
      <div style="height: 250px; position:relative;">
        <img src="${image}" alt="${title}" style="width:100%; height:100%; object-fit:cover;">
        <div style="position:absolute; bottom:1rem; left:1.5rem; display:flex; gap:0.5rem;">
          <span class="badge-difficulty ${difficulty.toLowerCase()}">${difficulty}</span>
          <span class="badge-rating"><i class="fa-solid fa-clock"></i> ${duration}</span>
        </div>
      </div>
      <div style="padding: 1.75rem;">
        <span style="color:var(--accent); font-size:0.85rem; font-weight:600; text-transform:uppercase;">${category}</span>
        <h3 style="font-size:1.6rem; font-weight:700; margin:0.3rem 0 0.75rem;">${title}</h3>
        <p style="font-size:0.92rem; line-height:1.7; color:var(--text-muted); margin-bottom:1.5rem;">${desc}</p>
        <div style="display:flex; gap:1rem; justify-content:flex-end; border-top:1px solid rgba(255,255,255,0.08); padding-top:1.25rem;">
          <button class="btn btn-outline btn-sm" onclick="closeExperienceModal()">Close</button>
          <a href="Services.html?activity=${encodeURIComponent(category)}" class="btn btn-primary btn-sm">
            Find Related Packages <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
}

function closeExperienceModal() {
  const modal = document.getElementById('experienceDetailModal');
  if (modal) modal.classList.remove('active');
}
