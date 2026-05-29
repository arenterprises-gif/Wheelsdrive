import type { ValuationForm, ValuationReport, ValuationScores, ValuationBreakdown } from '@/types/valuation'

// Base prices by segment (₹)
const SEGMENT_BASE: Record<string,number> = {
  Hatchback:420000, Sedan:680000, SUV:1050000, MUV:880000, Luxury:2400000
}

// Brand resale strength multiplier
const BRAND_MULT: Record<string,number> = {
  Toyota:1.18, Honda:1.15, Hyundai:1.12, Kia:1.10, Maruti:1.08,
  Tata:1.05, Mahindra:1.04, Volkswagen:1.03, Skoda:1.02, MG:1.02,
  Renault:0.96, Ford:0.94, Datsun:0.90, Nissan:0.92
}

// Fuel demand score
const FUEL_DEMAND: Record<string,number> = {
  Petrol:85, Diesel:80, CNG:75, Electric:90
}

// Segment base by brand+model guessing
const guessSegment = (brand:string, model:string): string => {
  const m = model.toLowerCase()
  if(m.includes('swift')||m.includes('alto')||m.includes('kwid')||m.includes('wagonr')||m.includes('i10')||m.includes('baleno')||m.includes('altroz')) return 'Hatchback'
  if(m.includes('city')||m.includes('verna')||m.includes('dzire')||m.includes('amaze')||m.includes('ciaz')) return 'Sedan'
  if(m.includes('creta')||m.includes('seltos')||m.includes('nexon')||m.includes('brezza')||m.includes('ecosport')||m.includes('venue')||m.includes('sonet')) return 'SUV'
  if(m.includes('innova')||m.includes('ertiga')||m.includes('scorpio')) return 'MUV'
  if(brand==='BMW'||brand==='Mercedes-Benz'||brand==='Audi') return 'Luxury'
  return 'Hatchback'
}

export function calculateValuation(form: ValuationForm): ValuationReport {
  const currentYear = new Date().getFullYear()
  const age = currentYear - form.year
  const segment = guessSegment(form.brand, form.model)
  const basePrice = SEGMENT_BASE[segment] || SEGMENT_BASE.Hatchback

  // ─── 1. Depreciation by age ───────────────────────────────
  let depreciationFactor = 1
  if(age === 0) depreciationFactor = 0.85
  else if(age === 1) depreciationFactor = 0.78
  else if(age === 2) depreciationFactor = 0.72
  else if(age === 3) depreciationFactor = 0.66
  else if(age === 4) depreciationFactor = 0.60
  else if(age === 5) depreciationFactor = 0.55
  else if(age <= 7) depreciationFactor = 0.48
  else if(age <= 10) depreciationFactor = 0.38
  else depreciationFactor = 0.28

  // ─── 2. Brand score (0-100) ───────────────────────────────
  const brandMult = BRAND_MULT[form.brand] || 1.0
  const brandScore = Math.min(100, Math.round((brandMult - 0.88) / 0.32 * 100))

  // ─── 3. KM score (0-100) ─────────────────────────────────
  let kmMultiplier = 1
  let kmScore = 100
  if(form.km_driven < 20000) { kmMultiplier = 1.08; kmScore = 95 }
  else if(form.km_driven < 40000) { kmMultiplier = 1.04; kmScore = 88 }
  else if(form.km_driven < 60000) { kmMultiplier = 1.00; kmScore = 78 }
  else if(form.km_driven < 80000) { kmMultiplier = 0.95; kmScore = 68 }
  else if(form.km_driven < 100000) { kmMultiplier = 0.90; kmScore = 55 }
  else if(form.km_driven < 150000) { kmMultiplier = 0.82; kmScore = 40 }
  else { kmMultiplier = 0.72; kmScore = 25 }

  // ─── 4. Condition score (0-100) ───────────────────────────
  const condMap: Record<string,number> = { excellent:100, good:78, fair:55, poor:35, new:100, worn:40 }
  const extScore = condMap[form.exterior_condition] || 70
  const intScore = condMap[form.interior_condition] || 70
  const tireScore = condMap[form.tire_condition] || 70
  const engScore = condMap[form.engine_condition] || 70
  const conditionScore = Math.round((extScore*0.3)+(intScore*0.2)+(tireScore*0.15)+(engScore*0.35))
  const conditionMultiplier = 0.7 + (conditionScore/100)*0.35

  // ─── 5. Owner penalty ─────────────────────────────────────
  const ownerMultiplier = form.owners === 1 ? 1.05 : form.owners === 2 ? 0.95 : form.owners === 3 ? 0.87 : 0.78

  // ─── 6. Accident penalty ──────────────────────────────────
  const accidentMultiplier = form.accident_history ? 0.82 : 1.0

  // ─── 7. Service history ───────────────────────────────────
  const serviceMultiplier = form.service_history === 'full' ? 1.06 : form.service_history === 'partial' ? 1.0 : 0.93

  // ─── 8. Insurance bonus ───────────────────────────────────
  const insuranceMultiplier = form.insurance_valid ? 1.03 : 0.98

  // ─── 9. Fuel demand ───────────────────────────────────────
  const demandScore = FUEL_DEMAND[form.fuel] || 80
  const fuelMultiplier = demandScore / 85

  // ─── 10. Final price calculation ─────────────────────────
  const estimatedPrice = Math.round(
    basePrice * depreciationFactor * brandMult * kmMultiplier *
    conditionMultiplier * ownerMultiplier * accidentMultiplier *
    serviceMultiplier * insuranceMultiplier * fuelMultiplier
  )

  const variance = Math.round(estimatedPrice * 0.07)
  const estimated_min = estimatedPrice - variance
  const estimated_max = estimatedPrice + variance
  const recommended_price = estimatedPrice
  const fast_sale_price = Math.round(estimatedPrice * 0.92)
  const premium_price = Math.round(estimatedPrice * 1.08)

  // ─── Scores ────────────────────────────────────────────────
  const overallScore = Math.round(
    (conditionScore*0.35) + (kmScore*0.25) + (brandScore*0.2) +
    ((form.accident_history?30:85)*0.1) + ((form.service_history==='full'?90:form.service_history==='partial'?65:40)*0.1)
  )

  const scores: ValuationScores = {
    condition_score: conditionScore,
    demand_score: demandScore,
    depreciation_factor: Math.round(depreciationFactor*100),
    brand_score: brandScore,
    km_score: kmScore,
    overall_score: overallScore,
  }

  // ─── Breakdown ─────────────────────────────────────────────
  const breakdown: ValuationBreakdown[] = [
    { label:'Car Age', impact: age<=3?'positive':age<=6?'neutral':'negative', detail:`${age} year${age!==1?'s':''} old — ${age<=3?'good resale value':age<=6?'moderate depreciation':'high depreciation'}`, value_impact: Math.round((depreciationFactor-0.5)*basePrice) },
    { label:'Brand Value', impact: brandMult>=1.05?'positive':brandMult>=1.0?'neutral':'negative', detail:`${form.brand} has ${brandMult>=1.05?'strong':'moderate'} resale demand`, value_impact: Math.round((brandMult-1)*basePrice*0.4) },
    { label:'KM Driven', impact: form.km_driven<50000?'positive':form.km_driven<100000?'neutral':'negative', detail:`${(form.km_driven/1000).toFixed(0)}k km — ${form.km_driven<50000?'low mileage':form.km_driven<100000?'moderate':'high mileage'}`, value_impact: Math.round((kmMultiplier-1)*estimatedPrice*0.3) },
    { label:'Overall Condition', impact: conditionScore>=75?'positive':conditionScore>=55?'neutral':'negative', detail:`Score ${conditionScore}/100 — engine, exterior, interior evaluated`, value_impact: Math.round((conditionMultiplier-0.85)*estimatedPrice*0.5) },
    { label:'Ownership', impact: form.owners===1?'positive':form.owners===2?'neutral':'negative', detail:`${form.owners} owner${form.owners>1?'s':''} — ${form.owners===1?'single owner premium':'multi-owner car'}`, value_impact: Math.round((ownerMultiplier-1)*estimatedPrice) },
    { label:'Accident History', impact: form.accident_history?'negative':'positive', detail: form.accident_history?'Accident reported — significant value reduction':'No accident history — value preserved', value_impact: form.accident_history?Math.round(-0.18*estimatedPrice):0 },
    { label:'Service History', impact: form.service_history==='full'?'positive':form.service_history==='partial'?'neutral':'negative', detail:`${form.service_history==='full'?'Full service records — buyer confidence':'Partial/no service records'}`, value_impact: Math.round((serviceMultiplier-1)*estimatedPrice) },
    { label:'Insurance', impact: form.insurance_valid?'positive':'neutral', detail: form.insurance_valid?'Valid insurance — ready to transfer':'Expired insurance — buyer bears cost', value_impact: form.insurance_valid?Math.round(0.03*estimatedPrice):-Math.round(0.02*estimatedPrice) },
  ]

  return { estimated_min, estimated_max, recommended_price, fast_sale_price, premium_price, scores, breakdown }
}
