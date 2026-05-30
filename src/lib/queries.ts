// ============================================================================
// DATABASE QUERIES - WHEELSDRIVE
// ============================================================================
// File: src/lib/queries.ts
// Fixed version with proper field mapping for Supabase schema
// ============================================================================

import { supabase } from '@/services/supabaseService'
import { Car } from '@/types'

// ============================================================================
// CARS
// ============================================================================

/**
 * Fetch a single car by ID
 */
export async function fetchCarById(id: string): Promise<Car> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(`Failed to fetch car: ${error.message}`)
  return data
}

/**
 * Create a new car listing with proper field mapping
 */
export async function createCar(data: Partial<Car>): Promise<Car> {
  // ✅ Map form fields to database schema
  const payload = {
    brand: data.brand,
    model: data.model,
    title: data.title,
    description: data.description || null,
    year: data.year,
    segment: data.segment,
    fuel_type: data.fuel_type || data.fuel || 'Petrol', // Handle both names
    transmission: data.transmission,
    condition: data.condition,
    color: data.color,
    km_driven: data.km_driven,
    owners: data.owners || 1,
    price: data.price,
    
    // ✅ Image handling - map images/images_array properly
    images_array: data.images_array || data.images || [],
    image_main: data.image_main || (data.images_array?.[0] || data.images?.[0] || null),
    
    // Default seller info (can be updated from form)
    seller_name: data.seller_name || 'Admin',
    seller_phone: data.seller_phone || '9999999999',
    seller_email: data.seller_email || 'admin@wheelsdrive.in',
    seller_location: data.seller_location || 'Jhansi',
    
    // Default status flags
    is_sold: data.is_sold || false,
    is_featured: data.is_featured || false,
    is_verified: data.is_verified || false,
    is_hot_deal: data.is_hot_deal || false,
    views_count: 0,
  }

  const { data: result, error } = await supabase
    .from('cars')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    throw new Error(`Failed to create car: ${error.message}`)
  }

  return result
}

/**
 * Update an existing car with proper field mapping
 */
export async function updateCar(id: string, data: Partial<Car>): Promise<Car> {
  // ✅ Build update payload with proper field mapping
  const payload: Record<string, any> = {}

  // Map simple fields
  if (data.brand !== undefined) payload.brand = data.brand
  if (data.model !== undefined) payload.model = data.model
  if (data.title !== undefined) payload.title = data.title
  if (data.description !== undefined) payload.description = data.description
  if (data.year !== undefined) payload.year = data.year
  if (data.segment !== undefined) payload.segment = data.segment
  
  // Map fuel with both possible field names
  if (data.fuel_type !== undefined) payload.fuel_type = data.fuel_type
  if (data.fuel !== undefined) payload.fuel_type = data.fuel
  
  if (data.transmission !== undefined) payload.transmission = data.transmission
  if (data.condition !== undefined) payload.condition = data.condition
  if (data.color !== undefined) payload.color = data.color
  if (data.km_driven !== undefined) payload.km_driven = data.km_driven
  if (data.owners !== undefined) payload.owners = data.owners
  if (data.price !== undefined) payload.price = data.price
  
  // Map images with both possible field names
  if (data.images_array !== undefined) {
    payload.images_array = data.images_array
    // Set first image as main if array is not empty
    if (data.images_array.length > 0) {
      payload.image_main = data.images_array[0]
    }
  } else if (data.images !== undefined) {
    payload.images_array = data.images
    if (data.images.length > 0) {
      payload.image_main = data.images[0]
    }
  }
  
  // Map status flags
  if (data.is_sold !== undefined) payload.is_sold = data.is_sold
  if (data.is_featured !== undefined) payload.is_featured = data.is_featured
  if (data.is_verified !== undefined) payload.is_verified = data.is_verified
  if (data.is_hot_deal !== undefined) payload.is_hot_deal = data.is_hot_deal
  
  // Map seller info
  if (data.seller_name !== undefined) payload.seller_name = data.seller_name
  if (data.seller_phone !== undefined) payload.seller_phone = data.seller_phone
  if (data.seller_email !== undefined) payload.seller_email = data.seller_email
  if (data.seller_location !== undefined) payload.seller_location = data.seller_location

  const { data: result, error } = await supabase
    .from('cars')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    throw new Error(`Failed to update car: ${error.message}`)
  }

  return result
}

/**
 * Delete a car listing
 */
export async function deleteCar(id: string): Promise<void> {
  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Failed to delete car: ${error.message}`)
}

/**
 * Get all cars for admin
 */
export async function fetchAllCars(): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch cars: ${error.message}`)
  return data || []
}

/**
 * Search cars with filters
 */
export async function searchCars(filters?: {
  brand?: string
  segment?: string
  fuel_type?: string
  transmission?: string
  condition?: string
  min_price?: number
  max_price?: number
  search_query?: string
  sort_by?: 'newest' | 'price_low' | 'price_high' | 'most_viewed'
  page?: number
  limit?: number
}) {
  let query = supabase
    .from('cars')
    .select('*', { count: 'exact' })
    .eq('is_sold', false) // Only unsold cars for public

  // Apply filters
  if (filters) {
    if (filters.brand) query = query.eq('brand', filters.brand)
    if (filters.segment) query = query.eq('segment', filters.segment)
    if (filters.fuel_type) query = query.eq('fuel_type', filters.fuel_type)
    if (filters.transmission) query = query.eq('transmission', filters.transmission)
    if (filters.condition) query = query.eq('condition', filters.condition)
    if (filters.min_price) query = query.gte('price', filters.min_price)
    if (filters.max_price) query = query.lte('price', filters.max_price)

    // Search in title, brand, model, color
    if (filters.search_query) {
      const q = filters.search_query
      query = query.or(
        `title.ilike.%${q}%,brand.ilike.%${q}%,model.ilike.%${q}%,color.ilike.%${q}%`
      )
    }

    // Sorting
    switch (filters.sort_by) {
      case 'price_low':
        query = query.order('price', { ascending: true })
        break
      case 'price_high':
        query = query.order('price', { ascending: false })
        break
      case 'most_viewed':
        query = query.order('views_count', { ascending: false })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
    }

    // Pagination
    const page = filters.page || 1
    const limit = filters.limit || 12
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
  }

  const { data, count, error } = await query

  if (error) throw new Error(`Search failed: ${error.message}`)

  return {
    cars: data || [],
    total: count || 0,
    page: filters?.page || 1,
    limit: filters?.limit || 12,
  }
}

/**
 * Increment car view count
 */
export async function incrementViewCount(carId: string): Promise<void> {
  const { data, error: fetchError } = await supabase
    .from('cars')
    .select('views_count')
    .eq('id', carId)
    .single()

  if (fetchError) throw fetchError

  const { error: updateError } = await supabase
    .from('cars')
    .update({ views_count: (data?.views_count || 0) + 1 })
    .eq('id', carId)

  if (updateError) throw updateError
}

// ============================================================================
// ADMIN STATS
// ============================================================================

export async function fetchDashboardStats() {
  const { data, error } = await supabase
    .from('cars')
    .select('id,is_sold,price', { count: 'exact' })

  if (error) throw new Error(`Failed to fetch stats: ${error.message}`)

  const activeListing = data?.filter(c => !c.is_sold).length || 0
  const soldCars = data?.filter(c => c.is_sold).length || 0
  const totalValue = data?.reduce((sum: number, c: any) => sum + (c.price || 0), 0) || 0

  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: unreadInquiries } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)

  return {
    active_listings: activeListing,
    sold_cars: soldCars,
    total_users: totalUsers || 0,
    unread_inquiries: unreadInquiries || 0,
    total_inventory_value: totalValue,
    last_updated: new Date().toISOString(),
  }
}

// ============================================================================
// FEATURED CARS
// ============================================================================

export async function fetchFeaturedCars(limit = 6): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('is_featured', true)
    .eq('is_sold', false)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch featured cars: ${error.message}`)
  return data || []
}

export async function fetchHotDeals(limit = 8): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('is_hot_deal', true)
    .eq('is_sold', false)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch hot deals: ${error.message}`)
  return data || []
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  fetchCarById,
  createCar,
  updateCar,
  deleteCar,
  fetchAllCars,
  searchCars,
  incrementViewCount,
  fetchDashboardStats,
  fetchFeaturedCars,
  fetchHotDeals,
}
