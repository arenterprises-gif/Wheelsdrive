import { supabase } from './supabase'
import type { Car, CarFilters, Inquiry, DealerSettings } from '@/types'

const PAGE_SIZE = 20

/* ─── CARS ─────────────────────────────────────────────── */

export async function fetchCars(
  filters: Partial<CarFilters>,
  page = 1
): Promise<{ data: Car[]; total: number }> {
  let q = supabase.from('cars').select('*', { count: 'exact' })

  // Full-text search — most relevant first
  if (filters.search?.trim()) {
    q = q.textSearch('search_vector', filters.search.trim(), {
      type: 'websearch',
      config: 'english',
    })
  }

  if (filters.brand)         q = q.eq('brand', filters.brand)
  if (filters.fuel)          q = q.eq('fuel', filters.fuel)
  if (filters.transmission)  q = q.eq('transmission', filters.transmission)
  if (filters.segment)       q = q.eq('segment', filters.segment)
  if (filters.condition)     q = q.eq('condition', filters.condition)
  if (filters.price_category) q = q.eq('price_category', filters.price_category)
  if (filters.is_hot_deal)   q = q.eq('is_hot_deal', true)
  if (!filters.show_sold)    q = q.eq('is_sold', false)
  if (filters.min_price)     q = q.gte('price', filters.min_price)
  if (filters.max_price)     q = q.lte('price', filters.max_price)
  if (filters.min_year)      q = q.gte('year', filters.min_year)
  if (filters.max_year)      q = q.lte('year', filters.max_year)

  q = q
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  const { data, error, count } = await q
  if (error) throw error
  return { data: (data as Car[]) || [], total: count || 0 }
}

export async function fetchCarById(id: string): Promise<Car | null> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  // Increment views (fire and forget)
  supabase.rpc('increment_views', { car_id: id }).then(() => {})
  return data as Car
}

export async function fetchSimilarCars(car: Car, limit = 4): Promise<Car[]> {
  const { data } = await supabase
    .from('cars')
    .select('*')
    .neq('id', car.id)
    .eq('is_sold', false)
    .or(`segment.eq.${car.segment},brand.eq.${car.brand}`)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data as Car[]) || []
}

export async function fetchFeaturedCars(limit = 6): Promise<Car[]> {
  const { data } = await supabase
    .from('cars')
    .select('*')
    .eq('is_sold', false)
    .eq('is_hot_deal', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data as Car[]) || []
}

export async function fetchCarStats() {
  const [total, sold, hot] = await Promise.all([
    supabase.from('cars').select('id', { count: 'exact', head: true }),
    supabase.from('cars').select('id', { count: 'exact', head: true }).eq('is_sold', true),
    supabase.from('cars').select('id', { count: 'exact', head: true }).eq('is_hot_deal', true).eq('is_sold', false),
  ])
  return {
    total: total.count || 0,
    available: (total.count || 0) - (sold.count || 0),
    sold: sold.count || 0,
    hot: hot.count || 0,
  }
}

export async function createCar(car: Partial<Car>): Promise<Car> {
  const { data, error } = await supabase
    .from('cars')
    .insert([car])
    .select()
    .single()
  if (error) throw error
  return data as Car
}

export async function updateCar(id: string, updates: Partial<Car>): Promise<Car> {
  const { data, error } = await supabase
    .from('cars')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Car
}

export async function deleteCar(id: string): Promise<void> {
  const { error } = await supabase.from('cars').delete().eq('id', id)
  if (error) throw error
}

export async function uploadCarImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage
    .from('car-images')
    .upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('car-images').getPublicUrl(path)
  return data.publicUrl
}

export async function deleteCarImage(url: string): Promise<void> {
  const path = url.split('/car-images/').pop()
  if (!path) return
  await supabase.storage.from('car-images').remove([path])
}

/* ─── INQUIRIES ─────────────────────────────────────────── */

export async function fetchInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as Inquiry[]) || []
}

export async function markInquiryRead(id: string): Promise<void> {
  await supabase.from('inquiries').update({ is_read: true }).eq('id', id)
}

export async function deleteInquiry(id: string): Promise<void> {
  await supabase.from('inquiries').delete().eq('id', id)
}

export async function createInquiry(
  inquiry: Omit<Inquiry, 'id' | 'created_at' | 'is_read'>
): Promise<void> {
  await supabase.from('inquiries').insert([inquiry])
}

/* ─── SETTINGS ───────────────────────────────────────────── */

export async function fetchSettings(): Promise<DealerSettings | null> {
  const { data } = await supabase.from('settings').select('*').eq('id', 1).single()
  return data as DealerSettings | null
}

export async function updateSettings(
  updates: Partial<DealerSettings>
): Promise<void> {
  await supabase.from('settings').update(updates).eq('id', 1)
}

/* ─── DISTINCT BRAND LIST ────────────────────────────────── */
export async function fetchBrands(): Promise<string[]> {
  const { data } = await supabase
    .from('cars')
    .select('brand')
    .eq('is_sold', false)
  const brands = [...new Set((data || []).map((r: { brand: string }) => r.brand))].sort()
  return brands
}

/* ─── QUERY CONFIG (use in useQuery staleTime/gcTime) ───── */
export const QUERY_CONFIG = {
  cars:      { staleTime: 3 * 60 * 1000, gcTime: 10 * 60 * 1000 },
  car:       { staleTime: 5 * 60 * 1000, gcTime: 15 * 60 * 1000 },
  stats:     { staleTime: 60 * 1000,     refetchInterval: 5 * 60 * 1000 },
  brands:    { staleTime: 10 * 60 * 1000 },
  inquiries: { staleTime: 30 * 1000 },
} as const
