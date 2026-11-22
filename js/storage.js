/**
 * STACKLY ADVENTURE TOURISM — STORAGE ENGINE (js/storage.js)
 * LocalStorage & SessionStorage Management for Frontend Demonstration
 */

const STORAGE_KEYS = {
  DESTINATIONS: 'stackly_destinations_data',
  PACKAGES: 'stackly_packages_data',
  ACTIVITIES: 'stackly_activities_data',
  BOOKINGS: 'stackly_bookings_data',
  GUIDES: 'stackly_guides_data',
  OFFERS: 'stackly_offers_data',
  WISHLIST: 'stackly_user_wishlist',
  CUSTOM_TRIP: 'stackly_custom_trip_plan',
  USER_SESSION: 'stackly_active_session',
  REGISTERED_USERS: 'stackly_users_db'
};

// Default seed data
const DEFAULT_DESTINATIONS = [
  {
    id: "dest-1",
    name: "Himalayas, India",
    region: "North India",
    category: "Mountain Trekking & Snow",
    desc: "Experience dramatic high-altitude peaks, alpine meadows, pristine snow trails, and remote high mountain passes.",
    image: "assets/images/himalayas.webp",
    rating: 4.9,
    reviewsCount: "14k+",
    status: "Available"
  },
  {
    id: "dest-2",
    name: "Manali, India",
    region: "Himachal Pradesh",
    category: "Alpine & River Valley",
    desc: "Towering pine forests, snow-fed rivers, thrilling paragliding slopes in Solang, and legendary Rohtang mountain trails.",
    image: "assets/images/manali.webp",
    rating: 4.8,
    reviewsCount: "12k+",
    status: "Available"
  },
  {
    id: "dest-3",
    name: "Ladakh, India",
    region: "Jammu & Kashmir",
    category: "High Altitude Desert",
    desc: "Epic winding roads through the world's highest passes, crystal turquoise lakes, and Tibetan monasteries perched on cliffs.",
    image: "assets/images/ladakh.webp",
    rating: 4.9,
    reviewsCount: "18k+",
    status: "Available"
  },
  {
    id: "dest-4",
    name: "Rishikesh, India",
    region: "Uttarakhand",
    category: "White Water Rafting & Yoga",
    desc: "Grade IV churning river rapids, cliff jumps, beachside starlit camping, and the spiritual gateway of the Ganges.",
    image: "assets/images/rishikesh.webp",
    rating: 4.7,
    reviewsCount: "9k+",
    status: "Available"
  },
  {
    id: "dest-5",
    name: "Meghalaya, India",
    region: "North East India",
    category: "Caves, Waterfalls & Living Bridges",
    desc: "Walk across ancient living root bridges, swim in emerald canyon pools, and explore deep limestone caves.",
    image: "assets/images/meghalaya.webp",
    rating: 4.8,
    reviewsCount: "8k+",
    status: "Available"
  },
  {
    id: "dest-6",
    name: "Andaman Islands, India",
    region: "Andaman & Nicobar",
    category: "Scuba Diving & Coral Islands",
    desc: "Vibrant coral reefs, manta rays, bioluminescent waters at night, and remote tropical white sand beaches.",
    image: "assets/images/andaman.webp",
    rating: 4.9,
    reviewsCount: "15k+",
    status: "Available"
  }
];

const DEFAULT_PACKAGES = [
  {
    id: "pkg-101",
    title: "Himalayan Trekking Expedition",
    destination: "Himalayas",
    location: "Himachal Pradesh",
    activity: "Trekking",
    duration: "6 Days / 5 Nights",
    durationDays: 6,
    difficulty: "Moderate",
    price: 12999,
    groupSize: "12 Max",
    rating: 4.9,
    reviews: "320+",
    image: "assets/images/trekking.webp",
    desc: "Traverse high altitude ridges, sleep in alpine dome tents under starry skies, and marvel at snow peaks.",
    included: ["Certified Mountain Guide", "All Camping Gear & Tents", "Meals on Trail", "Safety Oxygen Kit"]
  },
  {
    id: "pkg-102",
    title: "Ladakh Adventure Road Trip",
    destination: "Ladakh",
    location: "Ladakh",
    activity: "Road Trip",
    duration: "7 Days / 6 Nights",
    durationDays: 7,
    difficulty: "Challenging",
    price: 24999,
    groupSize: "8 Max",
    rating: 4.9,
    reviews: "410+",
    image: "assets/images/road-trip.webp",
    desc: "Cross Khardung La pass, ride along Pangong Lake, and experience the raw beauty of the Himalayas on wheels.",
    included: ["Expedition 4x4 or Bikes", "Boutique Stays", "Mechanic Backup", "Inner Line Permits"]
  },
  {
    id: "pkg-103",
    title: "Rishikesh River Adventure",
    destination: "Rishikesh",
    location: "Uttarakhand",
    activity: "Rafting",
    duration: "3 Days / 2 Nights",
    durationDays: 3,
    difficulty: "Moderate",
    price: 5999,
    groupSize: "16 Max",
    rating: 4.7,
    reviews: "560+",
    image: "assets/images/rafting.webp",
    desc: "Tackle Marine Drive to Shivpuri rapids, cliff jump into holy emerald waters, and enjoy beach campfire nights.",
    included: ["Rapid Safety Certified Equipment", "Riverside Camp Stay", "BBQ & Meals", "Cliff Jump Gear"]
  },
  {
    id: "pkg-104",
    title: "Meghalaya Nature Expedition",
    destination: "Meghalaya",
    location: "Meghalaya",
    activity: "Trekking",
    duration: "5 Days / 4 Nights",
    durationDays: 5,
    difficulty: "Moderate",
    price: 14999,
    groupSize: "10 Max",
    rating: 4.8,
    reviews: "210+",
    image: "assets/images/meghalaya.webp",
    desc: "Hike down the 3,500 stone steps to the Double Decker Root Bridge, kayak on the Umngot River, and explore deep caves.",
    included: ["Local Khasi Guide", "Homestays & Eco-resorts", "All Permits", "Private Van Transport"]
  },
  {
    id: "pkg-105",
    title: "Andaman Diving Escape",
    destination: "Andaman",
    location: "Andaman Islands",
    activity: "Scuba Diving",
    duration: "5 Days / 4 Nights",
    durationDays: 5,
    difficulty: "Beginner",
    price: 18999,
    groupSize: "6 Max",
    rating: 4.9,
    reviews: "380+",
    image: "assets/images/scuba-diving.webp",
    desc: "Discover vibrant coral gardens at Havelock, dive alongside sea turtles and reef fish with certified PADI dive masters.",
    included: ["2 PADI Certified Ocean Dives", "Complete Scuba Gear", "Beach Villa Stay", "Ferry Transfers"]
  },
  {
    id: "pkg-106",
    title: "Manali Camping Adventure",
    destination: "Manali",
    location: "Himachal Pradesh",
    activity: "Camping",
    duration: "3 Days / 2 Nights",
    durationDays: 3,
    difficulty: "Easy",
    price: 6999,
    groupSize: "14 Max",
    rating: 4.8,
    reviews: "490+",
    image: "assets/images/mountain-camping.webp",
    desc: "Cozy camping in the scenic cedar groves of Solang, riverside bonfires, stargazing, and daytime nature hikes.",
    included: ["Luxury Glamping Tents", "Bonfire Nights & Music", "All Meals", "Guided Forest Trail"]
  }
];

const DEFAULT_BOOKINGS = [
  {
    id: "STK-1001",
    customer: "Rahul Sharma",
    email: "rahul@example.com",
    destination: "Manali",
    packageTitle: "Manali Camping Adventure",
    travelers: 2,
    date: "2026-12-10",
    amount: 13998,
    status: "confirmed"
  },
  {
    id: "STK-1002",
    customer: "Priya Patel",
    email: "priya@example.com",
    destination: "Ladakh",
    packageTitle: "Ladakh Adventure Road Trip",
    travelers: 4,
    date: "2026-12-18",
    amount: 99996,
    status: "pending"
  },
  {
    id: "STK-1003",
    customer: "Arun Verma",
    email: "arun@example.com",
    destination: "Rishikesh",
    packageTitle: "Rishikesh River Adventure",
    travelers: 3,
    date: "2026-11-28",
    amount: 17997,
    status: "completed"
  },
  {
    id: "STK-1004",
    customer: "Meena Nair",
    email: "meena@example.com",
    destination: "Meghalaya",
    packageTitle: "Meghalaya Nature Expedition",
    travelers: 2,
    date: "2026-12-05",
    amount: 29998,
    status: "cancelled"
  }
];

const DEFAULT_OFFERS = [
  {
    id: "off-1",
    code: "STACKLY25",
    discount: "25% OFF",
    title: "Early Winter Expedition Special",
    expiry: "31 Dec 2026",
    status: "Active"
  },
  {
    id: "off-2",
    code: "ADVENTURE10",
    discount: "₹1,500 OFF",
    title: "First Booking Welcome Offer",
    expiry: "15 Jan 2027",
    status: "Active"
  },
  {
    id: "off-3",
    code: "TREKGROUP",
    discount: "15% OFF",
    title: "Group Trekking Discount (4+ Travelers)",
    expiry: "28 Feb 2027",
    status: "Active"
  }
];

const DEFAULT_GUIDES = [
  {
    id: "g-1",
    name: "Alex Rivers",
    role: "Lead High-Altitude Mountaineer",
    exp: "12+ Years",
    languages: "English, Hindi, Nepali",
    trips: 142,
    image: "assets/images/guide-1.webp",
    status: "Available"
  },
  {
    id: "g-2",
    name: "Maya Sen",
    role: "Whitewater Rapids Specialist",
    exp: "8+ Years",
    languages: "English, Hindi, Bengali",
    trips: 98,
    image: "assets/images/guide-2.webp",
    status: "On Expedition"
  },
  {
    id: "g-3",
    name: "David Vance",
    role: "Aerial & Paragliding Instructor",
    exp: "10+ Years",
    languages: "English, German, Hindi",
    trips: 115,
    image: "assets/images/guide-3.webp",
    status: "Available"
  },
  {
    id: "g-4",
    name: "Priya Sharma",
    role: "Wildlife Naturalist & Botanist",
    exp: "7+ Years",
    languages: "English, Hindi, Assamese",
    trips: 84,
    image: "assets/images/guide-4.webp",
    status: "Available"
  }
];

// Initialize storage with defaults if not present
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.DESTINATIONS)) {
    localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(DEFAULT_DESTINATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(DEFAULT_PACKAGES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(DEFAULT_BOOKINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(DEFAULT_OFFERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GUIDES)) {
    localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(DEFAULT_GUIDES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(["pkg-101", "pkg-105"]));
  }
}

// Storage Accessors
const Storage = {
  // Destinations
  getDestinations() {
    initStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DESTINATIONS) || '[]');
  },
  saveDestination(dest) {
    const list = this.getDestinations();
    const existingIndex = list.findIndex(d => d.id === dest.id);
    if (existingIndex >= 0) {
      list[existingIndex] = dest;
    } else {
      dest.id = 'dest-' + Date.now();
      list.unshift(dest);
    }
    localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(list));
    return dest;
  },
  deleteDestination(id) {
    const list = this.getDestinations().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(list));
  },

  // Packages
  getPackages() {
    initStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PACKAGES) || '[]');
  },
  getPackageById(id) {
    return this.getPackages().find(p => p.id === id);
  },
  savePackage(pkg) {
    const list = this.getPackages();
    const existingIndex = list.findIndex(p => p.id === pkg.id);
    if (existingIndex >= 0) {
      list[existingIndex] = pkg;
    } else {
      pkg.id = 'pkg-' + Date.now();
      list.unshift(pkg);
    }
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(list));
    return pkg;
  },
  deletePackage(id) {
    const list = this.getPackages().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(list));
  },

  // Bookings
  getBookings() {
    initStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  },
  addBooking(booking) {
    const list = this.getBookings();
    booking.id = 'STK-' + (1000 + list.length + 1);
    booking.status = booking.status || 'confirmed';
    list.unshift(booking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
    return booking;
  },
  updateBookingStatus(id, newStatus) {
    const list = this.getBookings();
    const booking = list.find(b => b.id === id);
    if (booking) {
      booking.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
    }
    return booking;
  },
  deleteBooking(id) {
    const list = this.getBookings().filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
  },

  // Wishlist
  getWishlist() {
    initStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '[]');
  },
  toggleWishlist(pkgId) {
    let list = this.getWishlist();
    const idx = list.indexOf(pkgId);
    let added = false;
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(pkgId);
      added = true;
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    return added;
  },
  isInWishlist(pkgId) {
    return this.getWishlist().includes(pkgId);
  },

  // Offers
  getOffers() {
    initStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFERS) || '[]');
  },
  saveOffer(offer) {
    const list = this.getOffers();
    offer.id = offer.id || 'off-' + Date.now();
    list.unshift(offer);
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(list));
    return offer;
  },
  deleteOffer(id) {
    const list = this.getOffers().filter(o => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(list));
  },

  // Guides
  getGuides() {
    initStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GUIDES) || '[]');
  },

  // Session
  getSession() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.USER_SESSION) || 'null');
  },
  setSession(user) {
    sessionStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
  },
  clearSession() {
    sessionStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  }
};

// Initialize immediately on load
initStorage();
