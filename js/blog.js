/**
 * STACKLY ADVENTURE TOURISM — BLOG SCRIPT (js/blog.js)
 * Live category filtering, search, interactive reader modal & dispatch subscription
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');
  const searchInput = document.getElementById('blogSearchInput');
  const newsletterForm = document.getElementById('newsletterForm');

  // 1. Category & Search Filtering
  function filterArticles() {
    const activeBtn = document.querySelector('.blog-filter-btn.active');
    const category = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let visibleCount = 0;

    blogCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || 'all';
      const cardTitle = (card.querySelector('.blog-card-title')?.textContent || '').toLowerCase();
      const cardDesc = (card.querySelector('.blog-card-desc')?.textContent || '').toLowerCase();

      const matchesCat = category === 'all' || cardCategory === category;
      const matchesQuery = !query || cardTitle.includes(query) || cardDesc.includes(query);

      if (matchesCat && matchesQuery) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const noResultsEl = document.getElementById('blogNoResults');
    if (noResultsEl) {
      noResultsEl.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterArticles();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterArticles);
  }

  // 2. Newsletter Subscription Handling
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const email = emailInput ? emailInput.value.trim() : '';
      if (!email || !email.includes('@')) {
        showToast('Invalid Email', 'Please enter a valid email address.', 'accent');
        return;
      }

      try {
        const subs = JSON.parse(localStorage.getItem('stackly_newsletter_subscribers') || '[]');
        if (!subs.includes(email)) {
          subs.push(email);
          localStorage.setItem('stackly_newsletter_subscribers', JSON.stringify(subs));
        }
      } catch (err) {
        console.warn('Storage warning', err);
      }

      showToast('Welcome to the Dispatch!', `We have dispatched our alpine welcome kit to ${email}.`, 'success');
      if (emailInput) emailInput.value = '';
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeArticleModal();
    }
  });

  // Close modal on background overlay click
  const modalOverlay = document.getElementById('blogArticleModal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeArticleModal();
      }
    });
  }
});

// Comprehensive Database of Full Article Dispatches
const ARTICLE_DATA = {
  'featured-bivouac': {
    title: 'Surviving -25°C: The Definitive Alpine Winter Bivouac Guide',
    category: 'Survival & Safety • 9 Min Read',
    image: 'assets/images/mountain-camping.webp',
    author: 'Tenzing Norbu',
    role: 'IMF Certified Alpine Master & Lead Sherpa',
    avatar: 'assets/images/guide-1.webp',
    date: '18 Nov 2026',
    paragraphs: [
      'When temperatures plummet below -20°C on high Himalayan ridges, conventional camping wisdom ceases to apply. Survival transforms from an intellectual preparation into a relentless sequence of microscopic disciplines: moisture barrier management, caloric fuel timing, and kinetic circulation routines.',
      'Moisture is the alpine mountaineer’s deadliest enemy. Sweat trapped inside fleece or down layers instantly freezes the moment movement ceases, collapsing the insulating air pockets of goose down. Our expedition teams strictly adhere to dynamic vapor barriers and wool-blend thermal baselayers that wick humidity away without saturation.',
      'Caloric intake must be treated as thermal fuel. At sub-zero basecamps, human basal metabolic rates surge as the body burns energy simply maintaining internal core temperature. We mandate hot, electrolyte-dense soups, clarified butter fats (ghee), and complex carbohydrates consumed right before crawling into four-season 800-fill sleeping bags.'
    ],
    quote: '"The mountain does not forgive lethargy. In deep cold, five minutes of unattended perspiration can cost you fingers or toes."',
    takeaways: [
      'Layer with non-compressing vapor barriers; never wear cotton or damp garments into down sleeping bags.',
      'Place boiling Nalgene water bottles in thermal socks at the foot of your sleeping bag for 6 hours of radiating warmth.',
      'Dig snow trenches to deflect wind gusts; windchill exponentially accelerates convective heat loss.',
      'Always store boots and electronics inside your tent inner shell to prevent frozen soles and dead battery cells.'
    ]
  },
  'hampta-crossing': {
    title: 'The Ultimate 7-Day Hampta Pass Crossing: Valley of Contrasts',
    category: 'Trekking Guides • 6 Min Read',
    image: 'assets/images/trekking.webp',
    author: 'Samantha Ray',
    role: 'Senior Wilderness Guide',
    avatar: 'assets/images/guide-2.webp',
    date: '12 Nov 2026',
    paragraphs: [
      'Hampta Pass in Himachal Pradesh is widely celebrated as one of the most theatrical crossover treks in the world. Within a span of merely three hours on summit day, trekkers transition from the emerald pine meadows of Kullu into the desolate, dramatic moonscape desert of Lahaul and Spiti.',
      'Starting from Jobra through the birch forests of Chikka, the trail weaves beside the roaring Rani Nullah river. Glacial melt crossings require linked-arm human chains and firm three-point contact across slippery river stones.',
      'Reaching the pass at 4,287 meters rewards you with a panoramic perspective of Mount Indrasan and Deo Tibba before descending toward Shea Goru and the turquoise shores of Chandratal Lake.'
    ],
    quote: '"Nowhere else on Earth can you stand with lush green rainfed forests behind your back and stark purple Himalayan rock in front of your eyes."',
    takeaways: [
      'Best trekking window: Mid-June to mid-October when the pass is cleared of avalanche blocks.',
      'Trek distance: 35 kilometers over 5 to 6 operational days; highest point 4,287 meters.',
      'Footwear recommendation: High-ankle waterproof trekking boots with Vibram outsoles.',
      'Pack trekking poles with mud baskets for safe glacial river moraine balance.'
    ]
  },
  'altitude-sickness': {
    title: 'High Altitude Sickness (AMS): Medical Prevention & Rules',
    category: 'High Altitude • 8 Min Read',
    image: 'assets/images/ladakh.webp',
    author: 'Dr. Vikram Malhotra',
    role: 'Expedition Medical Lead & WFR',
    avatar: 'assets/images/guide-3.webp',
    date: '08 Nov 2026',
    paragraphs: [
      'Acute Mountain Sickness (AMS) is not a sign of physical weakness; it is a physiological response of the human vascular system to decreased atmospheric pressure and reduced oxygen saturation (SpO2). Any traveler ascending past 2,500 meters is susceptible regardless of athletic conditioning.',
      'The golden rule of high altitude is simple: Climb High, Sleep Low. Never ascend more than 300 to 500 meters of sleeping altitude per 24 hours once above 3,000 meters. The body requires approximately 48 hours to stimulate renal bicarbonate secretion and expand red blood cell count.',
      'Warning signs of progression into High Altitude Pulmonary Edema (HAPE) or Cerebral Edema (HACE) include persistent coughing with pink sputum, ataxia (loss of physical balance), and severe cognitive confusion. The only definitive cure is immediate, assisted descent.'
    ],
    quote: '"Never be too proud to descend. The mountain will always be standing tomorrow; your life will not if you ignore ataxia."',
    takeaways: [
      'Hydrate with minimum 4 liters of clean water daily; altitude air rapidly dehydrates your pulmonary system.',
      'Avoid alcohol, sleeping sedatives, and smoking during the first 72 hours of arrival in Leh or high valleys.',
      'Carry portable pulse oximeters; rest SpO2 below 75% requires immediate supplemental oxygen and descent assessment.',
      'Prophylactic Diamox (Acetazolamide) can accelerate breathing rates but requires physician consultation.'
    ]
  },
  'whitewater-rapids': {
    title: 'Navigating Grade IV Rapids: Whitewater Physics in Rishikesh',
    category: 'Water Adventures • 5 Min Read',
    image: 'assets/images/rafting.webp',
    author: 'Rohit Thakur',
    role: 'Senior Whitewater Pilot & Kayak Instructor',
    avatar: 'assets/images/guide-4.webp',
    date: '02 Nov 2026',
    paragraphs: [
      'The Ganges River canyon between Marine Drive and Rishikesh features some of the most exhilarating Class III+ and Class IV hydraulics on the subcontinent. Names like "The Wall", "Roller Coaster", and "Golf Course" command respect from seasoned river runners.',
      'Reading river hydraulics requires understanding laminar flow versus turbulent eddy lines. A hydraulic hole forms where water plunges over a submerged rock and recirculates backwards upstream. Punching through a monster hole requires synchronized high-cadence forward strokes.',
      'If flipped into the torrent, defensive swimming position is paramount: lie on your back with feet pointing downstream, toes breaking the surface to bounce off submerged boulders, and steer toward the calm eddy line.'
    ],
    quote: '"The river is pure kinetic energy. You do not conquer a rapid; you harmonize with its hydraulic flow lines."',
    takeaways: [
      'Wear Type V US Coast Guard approved high-flotation PFDs strapped snug against your ribcage.',
      'Keep your paddle T-grip covered with your top hand at all times to avoid striking raft companions.',
      'Listen intently to the trip leader’s commands: "Forward Hard", "All Back", "Get Down".',
      'Never stand up in fast-flowing water; foot entrapment in riverbed fissures is fatal.'
    ]
  },
  'bir-paragliding': {
    title: 'Riding the Dhauladhar Thermals: A Pilot’s Guide to Bir Billing',
    category: 'Aerial Thrills • 6 Min Read',
    image: 'assets/images/paragliding.webp',
    author: 'Alex Morgan',
    role: 'Tandem Paragliding Instructor',
    avatar: 'assets/images/user-1.webp',
    date: '28 Oct 2026',
    paragraphs: [
      'Bir Billing in Kangra Valley ranks alongside Oludeniz and Interlaken as one of the premier paragliding meccas on planet Earth. Billing, positioned at an altitude of 2,400 meters, acts as an aerodynamic launchpad facing south toward the sunny Kangra plains.',
      'When solar radiation warms the slate valley floors, hot air plumes bubble upward into massive columnar thermal elevators. Experienced glider pilots tap into these 4 to 6 meter/second thermal updrafts to soar higher than the launch takeoff point.',
      'From 3,500 meters, pilots look down upon Tibetan monasteries, terrace farms, and the razor-sharp snow summits of the Dhauladhar range before performing smooth spiraling landings on the green turf of Bir.'
    ],
    quote: '"Stepping off the launch cliff into empty air is terrifying for exactly three seconds. Then the canopy inflates, and you become a bird."',
    takeaways: [
      'Optimal flying season: October to November for crystal visibility and gentle cross-country thermals.',
      'Billing takeoff: 2,400m altitude; Bir landing: 1,350m; total glide altitude drop: 1,050 meters.',
      'Dress in windproof shell jackets and gloves; temperatures drop by 6.5°C per 1,000 meters gained.',
      'Always fly with certified tandem pilots who carry functional reserve emergency parachutes.'
    ]
  },
  'andaman-scuba': {
    title: 'Diving the Andaman Coral Sanctuary: Reefs & Marine Giants',
    category: 'Ocean Exploration • 7 Min Read',
    image: 'assets/images/scuba-diving.webp',
    author: 'Neha Patel',
    role: 'PADI Master Scuba Diver Trainer',
    avatar: 'assets/images/user-2.webp',
    date: '20 Oct 2026',
    paragraphs: [
      'The Andaman archipelago sits isolated in the Bay of Bengal, cradling one of the most biodiverse marine eco-reserves in the Indo-Pacific. At dive sites like Dixon’s Pinnacle and Johnny’s Gorge near Havelock, underwater visibility routinely exceeds 30 meters.',
      'Descending down the mooring line into the deep blue reveals massive pinnacles encrusted with purple sea fans and table corals. Giant trevally, barracuda schools, reef sharks, and majestic manta rays cruise the prevailing oceanic currents.',
      'STACKLY operates under strict marine conservation guidelines. Divers are briefed on buoyant neutral trim to prevent accidental fin strikes on fragile staghorn coral colonies that have grown for centuries.'
    ],
    quote: '"Underneath 20 meters of water, the chaos of modern life vanishes. All you hear is the rhythmic calm of your own regulator regulator breath."',
    takeaways: [
      'Prime scuba season: November through April when monsoon winds cease and sea conditions turn glass-smooth.',
      'Water temperature: 28°C to 30°C year-round; 3mm shorty or full wetsuit is ideal.',
      'Observe without touching; marine life protection laws in the Andaman Islands carry strict penalties.',
      'Allow at least 18 to 24 hours of no-fly surface interval after scuba diving before commercial flights.'
    ]
  },
  'manali-leh-overland': {
    title: 'Conquering the Manali-Leh Highway: 474km of High Altitude',
    category: 'Overland Expeditions • 9 Min Read',
    image: 'assets/images/road-trip.webp',
    author: 'Kabir Singh',
    role: 'Lead 4x4 Overland Expedition Guide',
    avatar: 'assets/images/user-3.webp',
    date: '14 Oct 2026',
    paragraphs: [
      'The Manali-Leh Highway is not merely a mountain road; it is an endurance rite of passage. Spanning 474 kilometers through five high Himalayan mountain passes, this route cuts through barren canyon lands where no human settlements can survive winter.',
      'From the Atal Tunnel exit, the route climbs through Keylong and Jispa before confronting the notorious Baralacha La pass at 4,890 meters. Meltwater glacial torrents like Zingzingbar test high-clearance four-wheel-drive differentials and driving discipline.',
      'Passing the Moore Plains—a surreal 40-kilometer flat plateau at 4,000 meters altitude—drivers ascend the hairpin switchbacks of Tanglang La at 5,328 meters before entering the Indus river valley of Ladakh.'
    ],
    quote: '"On the Manali-Leh road, preparation is the only insurance. Breakdowns at 4,500 meters test your grit to the core."',
    takeaways: [
      'Highway operational window: June through late October before heavy winter snowfall closes the passes.',
      'Vehicle specs: True 4WD or high-clearance AWD with all-terrain tires and dual full-size spare wheels.',
      'Fuel logistics: Fill up at Karu or Tandi; there is a 365-kilometer fuel gap between Tandi and Karu.',
      'Carry tow straps, tire inflator compressor, jumper cables, and portable AMS medical oxygen cylinders.'
    ]
  },
  'tiger-safari': {
    title: 'Tracking the Royal Bengal Tiger: Pugmarks & Canopy Clues',
    category: 'Wildlife & Ecology • 6 Min Read',
    image: 'assets/images/wildlife-safari.webp',
    author: 'Rajesh Rawat',
    role: 'Senior Naturalist & Wildlife Biologist',
    avatar: 'assets/images/guide-3.webp',
    date: '05 Oct 2026',
    paragraphs: [
      'In the dense Sal forests of Jim Corbett National Park, spotting an apex predator is rarely an accident of luck. It is the culmination of forensic tracking, understanding territorial scent markings, and reading the subtle audio alarm calls of the jungle.',
      'The forest speaks in a complex dialect. A sudden high-pitched bark from a spotted chital deer or the frantic guttural alarm of a langur monkey perched high in the treetops signals that a predator is on the prowl along the riverbed.',
      'Our safari expeditions emphasize quiet reverence. We position open 4x4 gypsy vehicles strategically along dry riverbeds (nullahs) with engines turned off, letting the ancient rhythms of the jungle unfold without disruption.'
    ],
    quote: '"When a wild tiger looks directly into your eyes, every cell in your evolutionary DNA remembers what it is to be mortal."',
    takeaways: [
      'Best sighting months: March to June when waterholes shrink and tigers frequent riverbeds.',
      'Dress code: Earthy tones (khaki, olive green, brown); avoid bright fluorescent colors and strong perfumes.',
      'Maintain complete silence when animals are spotted; sudden sounds trigger defensive retreat.',
      'Camera gear tip: Minimum 300mm to 600mm telephoto lens with image stabilization for low-light canopy shots.'
    ]
  },
  'meghalaya-canyons': {
    title: 'The Bio-Engineering of Meghalaya’s Living Root Bridges',
    category: 'Destination Spotlight • 5 Min Read',
    image: 'assets/images/meghalaya.webp',
    author: 'Ananya Roy',
    role: 'Bio-Geography Explorer & Trek Leader',
    avatar: 'assets/images/guide-2.webp',
    date: '29 Sep 2026',
    paragraphs: [
      'Tucked deep inside the subtropical cloud rainforests of Cherrapunji and Nongriat lies one of humankind’s greatest bio-engineering marvels: the Jingkieng Jiken living root bridges, hand-guided by the indigenous Khasi and Jaintia tribes across centuries.',
      'Rather than felling timber that would rot in the world’s wettest monsoon climate, ancient Khasi elders trained the aerial roots of the rubber fig tree (Ficus elastica) through hollowed betel nut trunks across roaring canyon rivers.',
      'Over 50 to 100 years, the living root fibers intertwine, petrify, and grow stronger with time. Some double-decker bridges can safely support 50 trekkers simultaneously while standing intact against torrential floods.'
    ],
    quote: '"While modern concrete bridges decay and weaken with age, a living root bridge only grows stronger as it matures."',
    takeaways: [
      'Trek to Nongriat Double Decker: 3,500 stone steps descent each way into the river canyon.',
      'Fitness requirement: Moderate to high knee endurance; carry dual trekking poles for shock absorption.',
      'Swim in the natural turquoise rainwater pools beneath Rainbow Falls at the valley bottom.',
      'Respect sacred groves; Khasi tradition mandates zero littering and strict forest protection.'
    ]
  },
  'astrophotography-camp': {
    title: 'Bortle Class 1 Skies: Astrophotography in Pangong Tso',
    category: 'Wilderness Camping • 5 Min Read',
    image: 'assets/images/camping.webp',
    author: 'Dhruv Sen',
    role: 'Adventure Astrophotographer',
    avatar: 'assets/images/guide-1.webp',
    date: '21 Sep 2026',
    paragraphs: [
      'Perched at an altitude of 4,350 meters on the Tibetan plateau, Pangong Tso offers some of the purest, driest air and zero light pollution on Earth—rated Bortle Class 1 on the celestial dark sky scale.',
      'When midnight arrives, the galactic core of the Milky Way arches across the obsidian sky with stunning clarity, reflecting its starlight upon the glass-smooth, high-altitude brackish lake waters.',
      'Operating cameras in sub-zero temperatures requires lithium battery warmers, dew heaters for wide-angle lenses, and calculated manual shutter exposures using the 500-rule to avoid star trailing.'
    ],
    quote: '"Looking up into the Ladakh night sky is like looking out through the open hatch of a spaceship."',
    takeaways: [
      'Astrophotography window: New moon nights during July through September for peak galactic center visibility.',
      'Essential gear: Full-frame DSLR/mirrorless, ultra-wide f/2.8 lens, sturdy carbon-fiber tripod, headlamp with red LED mode.',
      'Keep backup camera batteries inside inner jacket pockets next to body heat.',
      'Allow ample thermal acclimatization time before standing outside in sub-zero alpine night air.'
    ]
  }
};

// Open Article Modal with Full Dynamic Content
function openArticleModal(articleId) {
  const data = ARTICLE_DATA[articleId] || ARTICLE_DATA['featured-bivouac'];
  let modal = document.getElementById('blogArticleModal');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'blogArticleModal';
    modal.className = 'article-modal-overlay';
    document.body.appendChild(modal);
  }

  const paragraphsHtml = data.paragraphs.map(p => `<p>${p}</p>`).join('');
  const takeawaysHtml = data.takeaways.map(t => `<li><i class="fa-solid fa-circle-check"></i> <span>${t}</span></li>`).join('');

  modal.innerHTML = `
    <div class="article-modal-box">
      <div class="article-modal-hero">
        <img src="${data.image}" alt="${data.title}">
        <button class="article-modal-close" onclick="closeArticleModal()" aria-label="Close article">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="article-modal-content">
        <span class="article-modal-tag">${data.category}</span>
        <h2 class="article-modal-title">${data.title}</h2>

        <div class="article-meta-row" style="margin-bottom: 1.5rem;">
          <div class="author-info-box">
            <img src="${data.avatar}" alt="${data.author}" class="author-avatar">
            <div>
              <div class="author-name">${data.author}</div>
              <div class="author-role">${data.role}</div>
            </div>
          </div>
          <span style="margin-left: auto; color: var(--text-muted); font-size: 0.85rem;">
            <i class="fa-regular fa-calendar"></i> ${data.date}
          </span>
        </div>

        <div class="article-modal-body">
          ${paragraphsHtml}

          <div class="article-quote-box">
            ${data.quote}
          </div>

          <div class="article-takeaways-box">
            <h4 class="takeaways-title"><i class="fa-solid fa-compass"></i> Key Trail Takeaways & Rules</h4>
            <ul class="takeaways-list">
              ${takeawaysHtml}
            </ul>
          </div>
        </div>

        <div class="article-modal-actions">
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-outline btn-sm" onclick="shareArticle('${data.title}')">
              <i class="fa-solid fa-share-nodes"></i> Share Dispatch
            </button>
          </div>
          <a href="Services.html" class="btn btn-primary btn-sm">
            Explore Related Expeditions <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
  const modal = document.getElementById('blogArticleModal');
  if (modal) {
    modal.classList.remove('active');
  }
  document.body.style.overflow = '';
}

function shareArticle(title) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link Copied!', `Article link for "${title}" copied to clipboard.`, 'success');
  } else {
    showToast('Dispatch Ready', `Share this article link with fellow adventurers!`, 'accent');
  }
}
