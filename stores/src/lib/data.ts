import { Car } from './types'

const STORAGE_KEY = 'wheelsdrive_cars'
const AUTH_KEY = 'wheelsdrive_auth'

const ADMIN_EMAIL = 'clerkneu@gmail.com'
const ADMIN_PASSWORD = 'wheelsdrive@admin2024'

const CAR_IMAGES = {
  swift: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/159963/swift-exterior-right-front-three-quarter-2.jpeg',
  i20: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/40432/i20-exterior-right-front-three-quarter-3.jpeg',
  nexon: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/147087/nexon-exterior-right-front-three-quarter-58.jpeg',
  creta: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter-3.jpeg',
  city: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134427/city-exterior-right-front-three-quarter-2.jpeg',
  baleno: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/159051/baleno-exterior-right-front-three-quarter-4.jpeg',
  ecosport: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/32597/ecosport-exterior-right-front-three-quarter-138.jpeg',
  dzire: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/159940/dzire-exterior-right-front-three-quarter.jpeg',
  brezza: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/159808/brezza-exterior-right-front-three-quarter-2.jpeg',
  venue: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/41523/venue-exterior-right-front-three-quarter-3.jpeg',
  punch: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/159067/punch-exterior-right-front-three-quarter-5.jpeg',
  altroz: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130591/altroz-exterior-right-front-three-quarter-3.jpeg',
}

const SAMPLE_CARS: Car[] = [
  {
    id: '1', title: '2021 Maruti Swift VXI', slug: '2021-maruti-swift-vxi',
    description: 'Well maintained Maruti Swift VXI in excellent condition. Single owner, all service records available. New tyres fitted recently. No accidents, no major repairs.',
    price: 620000, priceNegotiable: true, brand: 'Maruti', model: 'Swift',
    year: 2021, kmDriven: 28000, fuelType: 'Petrol', transmission: 'Manual',
    color: 'Pearl White', engineCC: 1197, segment: 'Hatchback', condition: 'Excellent',
    owners: 1, photos: [CAR_IMAGES.swift], isSold: false, isFeatured: true,
    whatsapp: '9506365650', createdAt: new Date().toISOString(),
  },
  {
    id: '2', title: '2020 Hyundai i20 Sportz', slug: '2020-hyundai-i20-sportz',
    description: 'Sportz variant with sunroof. All original parts. Insurance valid. Excellent city mileage. Bluetooth and reverse camera available.',
    price: 720000, priceNegotiable: true, brand: 'Hyundai', model: 'i20',
    year: 2020, kmDriven: 42000, fuelType: 'Petrol', transmission: 'Manual',
    color: 'Typhoon Silver', engineCC: 1197, segment: 'Hatchback', condition: 'Excellent',
    owners: 1, photos: [CAR_IMAGES.i20], isSold: false, isFeatured: true,
    whatsapp: '9506365650', createdAt: new Date().toISOString(),
  },
  {
    id: '3', title: '2022 Tata Nexon XZ+', slug: '2022-tata-nexon-xz-plus',
    description: 'Top variant Nexon with all features. Sunroof, connected car tech, JBL speakers. Full insurance. 5 star safety rated.',
    price: 1350000, priceNegotiable: false, brand: 'Tata', model: 'Nexon',
    year: 2022, kmDriven: 18000, fuelType: 'Petrol', transmission: 'Manual',
    color: 'Calgary White', engineCC: 1199, segment: 'SUV', condition: 'Excellent',
    owners: 1, photos: [CAR_IMAGES.nexon], isSold: false, isFeatured: true,
    whatsapp: '9506365650', createdAt: new Date().toISOString(),
  },
  {
    id: '4', title: '2019 Hyundai Creta SX', slug: '2019-hyundai-creta-sx',
    description: 'SX variant with leather seats, sunroof, and all premium features. Well maintained. Insurance renewal due. Good highway car.',
    price: 1100000, priceNegotiable: true, brand: 'Hyundai', model: 'Creta',
    year: 2019, kmDriven: 65000, fuelType: 'Diesel', transmission: 'Manual',
    color: 'Phantom Black', engineCC: 1582, segment: 'SUV', condition: 'Good',
    owners: 1, photos: [CAR_IMAGES.creta], isSold: false, isFeatured: false,
    whatsapp: '9506365650', createdAt: new Date().toISOString(),
  },
  {
    id: '5', title: '2020 Honda City ZX CVT', slug: '2020-honda-city-zx-cvt',
    description: 'Automatic transmission with CVT. Top ZX variant. Sunroof, LED lights, Honda Sensing. Excellent city and highway performance.',
    price: 1250000, priceNegotiable: true, brand: 'Honda', model: 'City',
    year: 2020, kmDriven: 35000, fuelType: 'Petrol', transmission: 'Automatic',
    color: 'Radiant Red Metallic', engineCC: 1498, segment: 'Sedan', condition: 'Excellent',
    owners: 1, photos: [CAR_IMAGES.city], isSold: false, isFeatured: true,
    whatsapp: '9506365650', createdAt: new Date().toISOString(),
  },
  {
    id: '6', title: '2021 Maruti Baleno Delta', slug: '2021-maruti-baleno-delta',
    description: 'Well maintained Baleno with SmartPlay infotainment. Automatic climate control. Good mileage. All Maruti service done on time.',
    price: 680000, priceNegotiable: true, brand: 'Maruti', model: 'Baleno',
    year: 2021, kmDriven: 31000, fuelType: 'Petrol', transmission: 'Manual',
    color: 'Brave Khaki', engineCC: 1197, segment: 'Hatchback', condition: 'Good',
    owners: 1, photos: [CAR_IMAGES.baleno], isSold: true, isFeatured: false,
    whatsapp: '9506365650', createdAt: new Date().toISOString(),
  },
  {
    id: '7', title: '2018 Ford EcoSport Titanium', slug: '2018-ford-ecosport-titanium',
    description: 'Titanium top variant with SYNC3 infotainment. Sunroof. Recently serviced. Good condition. Best compact SUV driving experience.',
    price: 750000, priceNegotiable: true, brand: 'Ford', model: 'EcoSport',
    year: 2018, kmDriven: 72000, fuelType: 'Petrol', transmission: 'Manual',
    color: 'White Gold', engineCC: 1498, segment: 'SUV', condition: 'Good',
    owners: 2, photos: [CAR_IMAGES.ecosport], isSold: false, isFeatured: false,
    whatsapp: '9506365650', createdAt: new Date().toISOString(),
  },
  {
    id: '8', title: '2020 Maruti Dzire VDI', slug: '2020-maruti-dzire-vdi',
    description: 'Diesel variant with excellent mileage. Best for long drives. Company maintained. Insurance valid. Smooth gear shifts.',
    price: 820000, priceNegotiable: false, brand: 'Maruti', model: 'Dzire',
    year: 2020, kmDriven: 55000, fuelType: 'Diesel', transmission: 'Manual',
    color: 'Oxford Blue', engineCC: 1248, segment: 'Sedan', condition: 'Good',
    owners: 1, photos: [CAR_IMAGES.dzire], isSold: false, isFeatured: false,
    whatsapp: '9506365650', createdAt: new Date().toISOString(),
  },
  {
    id: '9', title: '2022 Maruti Brezza ZXI+', slug: '2022-maruti-brezza-zxi-plus',
    description: 'Top variant with HUD display, sunroof, 360 camera. Almost new. Full warranty remaining. Best SUV under 15 lakh.',
    price: 1420000, priceNegotiable: false, brand: 'Maruti', model: 'Brezza',
    year: 2022, kmDriven: 12000, fuelType: 'Petrol', transmission: 'Automatic',
    color: 'Splendid Silver', engineCC: 1462, segment: 'SUV', condition: 'Excellent',
    owners: 1, photos: [CAR_IMAGES.brezza], isSold: false, isFeatured: true,
    whatsapp: '9506365650', createdAt: new Date().toISOString(),
  },
  {
    id: '10', title: '2021 Hyundai Venue SX Turbo', slug: '2021-hyundai-venue-sx-turbo',
    description: 'Turbo petrol with sporty performance. BlueLink connected car. Sunroof. 8" touchscreen. Best fun-to-drive compact SUV.',
    price: 1080000, priceNegotiable: true, brand: 'Hyundai', model: 'Venue',
    year: 2021, kmDriven: 22000, fuelType: 'Petrol', transmission: 'Manual',
    color: 'Typhoon Silver', engineCC: 998, segment: 'SUV', condition: 'Excellent',
    owners: 1, photos: [CAR_IMAGES.venue], isSold: false, isFeatured: false,
    whatsapp: '9506365650', createdAt: new Date().toISOString(),
  },
  {
    id: '11', title: '2022 Tata Punch Adventure', slug: '2022-tata-punch-adventure',
    description: 'Adventure variant with terrain modes. High ground clearance. Excellent safety. 5 star GNCAP rated. Best for rough roads.',
    price: 890000, priceNegotiable: true, brand: 'Tata', model: 'Punch',
    year: 2022, kmDriven: 15000, fuelType: 'Petrol', transmission: 'Manual',
    color: 'Meteor Bronze', engineCC: 1199, segment: 'SUV', condition: 'Excellent',
    owners: 1, photos: [CAR_IMAGES.punch], isSold: false, isFeatured: false,
    whatsapp: '9506365650', createdAt: new Date().toISOString(),
  },
  {
    id: '12', title: '2021 Tata Altroz XZ+', slug: '2021-tata-altroz-xz-plus',
    description: 'Top variant premium hatchback. IRA voice assistant. Harman speakers. Best build quality in segment. 5 star safety rating.',
    price: 870000, priceNegotiable: true, brand: 'Tata', model: 'Altroz',
    year: 2021, kmDriven: 28000, fuelType: 'Petrol', transmission: 'Manual',
    color: 'High Street Gold', engineCC: 1199, segment: 'Hatchback', condition: 'Good',
    owners: 1, photos: [CAR_IMAGES.altroz], isSold: false, isFeatured: false,
    whatsapp: '9506365650', createdAt: new Date().toISOString(),
  },
]

function initData() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_CARS))
  }
}

export function getCars(): Car[] {
  initData()
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

export function getCarBySlug(slug: string): Car | undefined {
  return getCars().find(c => c.slug === slug)
}

export function getCarById(id: string): Car | undefined {
  return getCars().find(c => c.id === id)
}

export function saveCar(car: Car): void {
  const cars = getCars()
  const idx = cars.findIndex(c => c.id === car.id)
  if (idx >= 0) cars[idx] = car
  else cars.unshift(car)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cars))
}

export function deleteCar(id: string): void {
  const cars = getCars().filter(c => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cars))
}

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).slice(2)
}

export function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function formatPrice(price: number): string {
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`
  return `₹${(price / 1000).toFixed(0)}K`
}

export function getPriceRange(price: number): string {
  if (price < 200000) return 'under-2l'
  if (price < 400000) return '2l-4l'
  if (price < 600000) return '4l-6l'
  if (price < 1000000) return '6l-10l'
  return 'above-10l'
}

export function adminLogin(email: string, password: string): boolean {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ email, isLoggedIn: true }))
    return true
  }
  return false
}

export function adminLogout(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function isAdminLoggedIn(): boolean {
  const auth = localStorage.getItem(AUTH_KEY)
  if (!auth) return false
  return JSON.parse(auth).isLoggedIn === true
}
