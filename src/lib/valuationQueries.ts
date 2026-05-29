import { supabase } from './supabase'
import type { CarValuation, ValuationImages, ValuationReport } from '@/types/valuation'

export async function createValuation(data: Omit<CarValuation,'id'|'created_at'>): Promise<CarValuation> {
  const { data: result, error } = await supabase
    .from('car_valuations')
    .insert([{ ...data, images: JSON.stringify(data.images), report: JSON.stringify(data.report) }])
    .select().single()
  if(error) throw error
  return { ...result, images: typeof result.images==='string'?JSON.parse(result.images):result.images, report: typeof result.report==='string'?JSON.parse(result.report):result.report }
}

export async function fetchValuations(): Promise<CarValuation[]> {
  const { data, error } = await supabase
    .from('car_valuations').select('*').order('created_at',{ ascending:false })
  if(error) throw error
  return (data||[]).map(r=>({ ...r, images: typeof r.images==='string'?JSON.parse(r.images):r.images, report: typeof r.report==='string'?JSON.parse(r.report):r.report }))
}

export async function fetchValuationById(id:string): Promise<CarValuation|null> {
  const { data, error } = await supabase.from('car_valuations').select('*').eq('id',id).single()
  if(error) return null
  return { ...data, images: typeof data.images==='string'?JSON.parse(data.images):data.images, report: typeof data.report==='string'?JSON.parse(data.report):data.report }
}

export async function updateValuationStatus(id:string, updates: { status?:string; admin_note?:string; admin_override_price?:number|null }): Promise<void> {
  const { error } = await supabase.from('car_valuations').update(updates).eq('id',id)
  if(error) throw error
}

export async function uploadValuationImage(file:File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `valuations/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('car-images').upload(path, file, { cacheControl:'3600' })
  if(error) throw error
  const { data } = supabase.storage.from('car-images').getPublicUrl(path)
  return data.publicUrl
}
