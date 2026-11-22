/**
 * STACKLY ADVENTURE TOURISM — TRIP CUSTOMIZATION (js/trip-customization.js)
 * Interactive Section 05: Dynamic Price Calculator & Plan Customizer
 */

document.addEventListener('DOMContentLoaded', () => {
  const customizerForm = document.getElementById('tripCustomizerForm');
  if (!customizerForm) return;

  // Selected State
  const state = {
    destination: 'Himalayas',
    activities: ['Trekking'],
    duration: '4-5 Days',
    durationMultiplier: 1.5,
    travelers: 'Couple',
    travelersCount: 2,
    basePrice: 8500
  };

  const activityPrices = {
    'Trekking': 3500,
    'Camping': 2500,
    'Rafting': 2800,
    'Paragliding': 3200,
    'Scuba Diving': 5500,
    'Wildlife Safari': 4000
  };

  const destinationBase = {
    'Himalayas': 6000,
    'Manali': 4500,
    'Ladakh': 12000,
    'Rishikesh': 3800,
    'Meghalaya': 7500,
    'Andaman': 11000
  };

  // UI elements
  const destOptions = document.querySelectorAll('.custom-dest-opt');
  const activityChips = document.querySelectorAll('.custom-act-chip');
  const durationBtns = document.querySelectorAll('.custom-dur-btn');
  const travelerBtns = document.querySelectorAll('.custom-trav-btn');
  const priceDisplay = document.getElementById('customEstimatedPrice');
  const summaryDest = document.getElementById('summaryDestination');
  const summaryActs = document.getElementById('summaryActivities');
  const summaryDuration = document.getElementById('summaryDuration');
  const summaryTravelers = document.getElementById('summaryTravelers');
  const planBtn = document.getElementById('btnPlanAdventure');
  const resetBtn = document.getElementById('btnResetCustomizer');

  // Destination selection
  destOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      destOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      state.destination = opt.getAttribute('data-value');
      calculatePrice();
    });
  });

  // Activity chips (multi-select)
  activityChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const act = chip.getAttribute('data-value');
      if (state.activities.includes(act)) {
        if (state.activities.length > 1) {
          state.activities = state.activities.filter(a => a !== act);
          chip.classList.remove('active');
        } else {
          showToast('Notice', 'Please keep at least one adventure activity selected.');
        }
      } else {
        state.activities.push(act);
        chip.classList.add('active');
      }
      calculatePrice();
    });
  });

  // Duration
  durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      durationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.duration = btn.getAttribute('data-value');
      state.durationMultiplier = parseFloat(btn.getAttribute('data-mult') || '1.0');
      calculatePrice();
    });
  });

  // Travelers
  travelerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      travelerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.travelers = btn.getAttribute('data-value');
      state.travelersCount = parseInt(btn.getAttribute('data-count') || '1', 10);
      calculatePrice();
    });
  });

  // Calculate & render
  function calculatePrice() {
    const destCost = destinationBase[state.destination] || 5000;
    const activitiesCost = state.activities.reduce((sum, act) => sum + (activityPrices[act] || 3000), 0);
    const subtotal = (destCost + activitiesCost) * state.durationMultiplier;
    const finalEstimated = Math.round(subtotal * state.travelersCount);

    if (priceDisplay) {
      if (typeof gsap !== 'undefined') {
        const currentVal = parseInt(priceDisplay.innerText.replace(/[^\d]/g, '') || '0', 10);
        gsap.to({ val: currentVal }, {
          val: finalEstimated,
          duration: 0.6,
          ease: 'power2.out',
          onUpdate: function() {
            priceDisplay.innerText = formatCurrency(Math.floor(this.targets()[0].val));
          }
        });
      } else {
        priceDisplay.innerText = formatCurrency(finalEstimated);
      }
    }

    if (summaryDest) summaryDest.innerText = state.destination;
    if (summaryActs) summaryActs.innerText = state.activities.join(', ');
    if (summaryDuration) summaryDuration.innerText = state.duration;
    if (summaryTravelers) summaryTravelers.innerText = `${state.travelers} (${state.travelersCount} Travelers)`;
  }

  // Plan Adventure Button
  if (planBtn) {
    planBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem(STORAGE_KEYS.CUSTOM_TRIP, JSON.stringify(state));
      showToast('Custom Trip Saved!', `Your custom ${state.destination} adventure plan is ready. Exploring matching packages...`, 'accent');
      setTimeout(() => {
        window.location.href = `Services.html?destination=${encodeURIComponent(state.destination)}`;
      }, 1000);
    });
  }

  // Reset Button
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      state.destination = 'Himalayas';
      state.activities = ['Trekking'];
      state.duration = '4-5 Days';
      state.durationMultiplier = 1.5;
      state.travelers = 'Couple';
      state.travelersCount = 2;

      destOptions.forEach((o, i) => o.classList.toggle('active', i === 0));
      activityChips.forEach(c => c.classList.toggle('active', c.getAttribute('data-value') === 'Trekking'));
      durationBtns.forEach((b, i) => b.classList.toggle('active', i === 1));
      travelerBtns.forEach((b, i) => b.classList.toggle('active', i === 1));

      calculatePrice();
      showToast('Customizer Reset', 'Selections restored to defaults.');
    });
  }

  calculatePrice();
});
