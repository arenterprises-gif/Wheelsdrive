export interface ValuationForm {
  brand: string; model: string; variant: string; year: number
  fuel: string; transmission: string; km_driven: number; owners: number
  registration_city: string; insurance_valid: boolean; accident_history: boolean
  service_history: 'full'|'partial'|'none'
  exterior_condition: 'excellent'|'good'|'fair'|'poor'
  interior_condition: 'excellent'|'good'|'fair'|'poor'
  tire_condition: 'new'|'good'|'worn'
  engine_condition: 'excellent'|'good'|'fair'
  customer_name: string; customer_phone: string; customer_email: string
  want_inspection: boolean
}

export interface ValuationImages {
  front?:string; back?:string; side?:string; interior?:string; dashboard?:string; damage?:string[]
}

export interface ValuationScores {
  condition_score: number; demand_score: number; depreciation_factor: number
  brand_score: number; km_score: number; overall_score: number
}

export interface ValuationBreakdown {
  label: string; impact: 'positive'|'negative'|'neutral'; detail: string; value_impact: number
}

export interface ValuationReport {
  estimated_min: number; estimated_max: number; recommended_price: number
  fast_sale_price: number; premium_price: number
  scores: ValuationScores; breakdown: ValuationBreakdown[]
}

export interface CarValuation {
  id: string; customer_name: string; customer_phone: string; customer_email: string
  brand: string; model: string; variant: string; year: number; fuel: string
  transmission: string; km_driven: number; owners: number; registration_city: string
  insurance_valid: boolean; accident_history: boolean; service_history: string
  exterior_condition: string; interior_condition: string; tire_condition: string
  engine_condition: string; want_inspection: boolean
  images: ValuationImages; report: ValuationReport
  status: 'pending'|'reviewed'|'inspected'|'approved'|'rejected'
  admin_note: string; admin_override_price: number|null; created_at: string
}
