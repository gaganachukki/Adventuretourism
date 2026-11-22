/**
 * STACKLY ADVENTURE TOURISM — BOOKING SCRIPT (js/booking.js)
 * Demonstration booking modal and localStorage integration
 */

let activeBookingPackage = null;

function openBookingModal(pkgId) {
  if (typeof Storage === 'undefined') return;
  const pkg = Storage.getPackageById(pkgId);
  if (!pkg) {
    showToast('Notice', 'Package details not found.');
    return;
  }

  activeBookingPackage = pkg;
  let modal = document.getElementById('universalBookingModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'universalBookingModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 14);
  const dateStr = defaultDate.toISOString().split('T')[0];

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 540px; padding: 2rem;">
      <button class="modal-close" onclick="closeBookingModal()"><i class="fa-solid fa-xmark"></i></button>
      
      <div style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
        <span class="badge-difficulty moderate" style="margin-bottom: 0.5rem;">Demonstration Booking</span>
        <h3 style="font-size: 1.4rem; font-weight: 700; margin-top: 0.3rem;">${pkg.title}</h3>
        <p style="font-size: 0.85rem; color: var(--accent);"><i class="fa-solid fa-location-dot"></i> ${pkg.location} • ${pkg.duration}</p>
      </div>

      <div class="demo-banner" style="margin-bottom: 1.25rem;">
        <i class="fa-solid fa-circle-info"></i>
        <span>Demonstration mode: Your booking will be saved locally to your Client & Admin dashboards.</span>
      </div>

      <form id="bookingSubmissionForm">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" class="form-control" id="bkFullName" value="Arjun Malhotra" required>
        </div>

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-control" id="bkEmail" value="arjun@explorer.com" required>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">Travel Date</label>
            <input type="date" class="form-control" id="bkDate" value="${dateStr}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Travelers</label>
            <select class="form-control" id="bkTravelers" onchange="updateBookingTotal()">
              <option value="1">1 Person</option>
              <option value="2" selected>2 Persons</option>
              <option value="3">3 Persons</option>
              <option value="4">4 Persons</option>
              <option value="6">6 Persons (Group)</option>
            </select>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-glass); border-radius: var(--radius-sm); padding: 1rem; margin: 1.25rem 0;">
          <div style="display:flex; justify-content:space-between; font-size:0.88rem; margin-bottom: 0.5rem;">
            <span style="color:var(--text-muted);">Package Base Price:</span>
            <span>${formatCurrency(pkg.price)} / traveler</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.88rem; margin-bottom: 0.5rem;">
            <span style="color:var(--text-muted);">Travelers:</span>
            <span id="bkSummaryCount">2 Travelers</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:1.15rem; font-weight:700; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.6rem;">
            <span>Estimated Total:</span>
            <span id="bkSummaryTotal" style="color:var(--primary); font-size: 1.35rem;">${formatCurrency(pkg.price * 2)}</span>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%;">
          <i class="fa-solid fa-check"></i> Confirm Demo Booking
        </button>
      </form>
    </div>
  `;

  modal.classList.add('active');

  const form = document.getElementById('bookingSubmissionForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const count = parseInt(document.getElementById('bkTravelers').value, 10);
    const newBooking = {
      customer: document.getElementById('bkFullName').value.trim() || 'Explorer',
      email: document.getElementById('bkEmail').value.trim() || 'explorer@demo.com',
      destination: pkg.destination,
      packageTitle: pkg.title,
      travelers: count,
      date: document.getElementById('bkDate').value,
      amount: pkg.price * count,
      status: 'confirmed'
    };

    const saved = Storage.addBooking(newBooking);
    closeBookingModal();
    showToast('Booking Confirmed!', `Booking ${saved.id} for ${pkg.title} saved to your dashboard.`, 'accent');

    // If on Client or Admin dashboard, refresh records
    if (typeof refreshBookingsUI === 'function') {
      refreshBookingsUI();
    }
  });
}

function updateBookingTotal() {
  if (!activeBookingPackage) return;
  const count = parseInt(document.getElementById('bkTravelers').value, 10);
  const total = activeBookingPackage.price * count;
  document.getElementById('bkSummaryCount').innerText = `${count} Traveler${count > 1 ? 's' : ''}`;
  document.getElementById('bkSummaryTotal').innerText = formatCurrency(total);
}

function closeBookingModal() {
  const modal = document.getElementById('universalBookingModal');
  if (modal) modal.classList.remove('active');
}
