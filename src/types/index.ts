export interface Car {
  id: string
  title: string
  brand: string
  model: string
  year: number
  price: number
  km_driven: number
  fuel: 'Petrol' | 'Diesel' | 'CNG' | 'Electric'
  transmission: 'Manual' | 'Automatic'
  condition: 'Excellent' | 'Good' | 'Fair'
  color: string
  owners: number
  segment: 'Hatchback' | 'Sedan' | 'SUV' | 'MUV' | 'Luxury'
  price_category: 'Budget' | 'Economy' | 'Mid-Range' | 'Premium' | 'Luxury'
  is_hot_deal: boolean
  is_sold: boolean
  is_featured: boolean
  description: string
  features: string[]
  images: string[]
  views: number
  created_at: string
  updated_at: string
}

export interface Inquiry {
  id: string
  car_id: string | null
  car_title: string
  customer_name: string
  phone: string
  message: string
  is_read: boolean
  created_at: string
}

export interface DealerSettings {
  id: number
  dealer_name: string
  address: string
  whatsapp: string
  about: string
  logo_url: string
}

export interface CarFilters {
  search: string
  brand: string
  fuel: string
  transmission: string
  segment: string
  condition: string
  price_category: string
  min_price: number
  max_price: number
  min_year: number
  max_year: number
  is_hot_deal: boolean
  show_sold: boolean
}

export interface PaginatedCars {
  data: Car[]
  total: number
  page: number
  pageSize: number
}
export * from './database';
