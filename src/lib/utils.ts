export const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`

export const fmtFull = (n: number) =>
  `₹${n.toLocaleString('en-IN')}`

export const fmtKm = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(0)}k km` : `${n} km`

export const calcEMI = (principal: number, ratePA: number, months: number) => {
  const r = ratePA / 12 / 100
  if (r === 0) return Math.round(principal / months)
  return Math.round(
    (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  )
}

export const getPriceCategory = (price: number): string => {
  if (price < 300000) return 'Budget'
  if (price < 600000) return 'Economy'
  if (price < 1000000) return 'Mid-Range'
  if (price < 1500000) return 'Premium'
  return 'Luxury'
}

export const WA_NUMBER = '919506365650'

export const waLink = (msg: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`

export const BRANDS = [
  'Maruti', 'Hyundai', 'Honda', 'Tata', 'Mahindra',
  'Kia', 'Toyota', 'Renault', 'Ford', 'Volkswagen',
  'MG', 'Skoda', 'Nissan', 'Datsun', 'Jeep', 'BMW',
  'Mercedes-Benz', 'Audi', 'Other',
]

export const SEGMENTS = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Luxury']
export const FUELS = ['Petrol', 'Diesel', 'CNG', 'Electric']
export const TRANSMISSIONS = ['Manual', 'Automatic']
export const CONDITIONS = ['Excellent', 'Good', 'Fair']

export const FEATURES_LIST = [
  'Power Steering', 'Power Windows', 'Central Locking',
  'Air Conditioning', 'Airbags', 'ABS', 'Reverse Camera',
  'Touchscreen', 'Sunroof', 'Alloy Wheels', 'Fog Lamps',
  'Cruise Control', 'Apple CarPlay / Android Auto',
  'Keyless Entry', 'Push Button Start',
  'Leather Seats', 'Ventilated Seats', 'Wireless Charging',
  '360° Camera', 'Parking Sensors', 'ISOFIX',
]

export const CARD_GRADIENTS = [
  'linear-gradient(135deg,#1a1a3e,#0d0d2e)',
  'linear-gradient(135deg,#1e0808,#2e0d0d)',
  'linear-gradient(135deg,#0a1520,#0d2030)',
  'linear-gradient(135deg,#12100a,#201a0d)',
  'linear-gradient(135deg,#0a180a,#0d2e10)',
  'linear-gradient(135deg,#180a18,#2e0d28)',
]
