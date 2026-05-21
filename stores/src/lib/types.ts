export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid'
export type Transmission = 'Manual' | 'Automatic'
export type Segment = 'Hatchback' | 'Sedan' | 'SUV' | 'MUV' | 'Luxury'
export type Condition = 'Excellent' | 'Good' | 'Fair'

export interface Car {
  id: string
  title: string
  slug: string
  description: string
  price: number
  priceNegotiable: boolean
  brand: string
  model: string
  year: number
  kmDriven: number
  fuelType: FuelType
  transmission: Transmission
  color: string
  engineCC: number
  segment: Segment
  condition: Condition
  owners: number
  photos: string[]
  isSold: boolean
  isFeatured: boolean
  whatsapp: string
  createdAt: string
}

export interface AdminUser {
  email: string
  isLoggedIn: boolean
}
