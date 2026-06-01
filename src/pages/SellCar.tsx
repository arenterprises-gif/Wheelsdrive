// src/pages/SellCar.tsx
// FIX: Label component moved OUTSIDE SellCar component → fixes keyboard disappear bug
// NEW: Live price preview, better step UI, inspection request highlight

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import Navbar from '@/components/Navbar'
import PoweredBy from '@/components/PoweredBy'
import { calculateValuation } from '@/lib/valuation'
import { createValuation, uploadValuationImage } from '@/lib/valuationQueries'
import { BRANDS, fmt } from '@/lib/utils'
import { ChevronRight, ChevronLeft, Upload, Check, Loader, X, TrendingUp } from 'lucide-react'
import type { ValuationForm, ValuationImages } from '@/types/valuation'

const STEPS = ['Car Details', 'Condition', 'Photos', 'Your Info']

const BLANK: ValuationForm = {
  brand: 'Maruti', model: '', variant: '', year: 2020, fuel: 'Petrol', transmission: 'Manual',
  km_driven: 30000, owners: 1, registration_city: 'Jhansi', insurance_valid: true,
  accident_history: false, service_history: 'full', exterior_condition: 'good',
  interior_condition: 'good', tire_condition: 'good', engine_condition: 'good',
  customer_name: '', customer_phone: '', customer_email: '', want_inspection: false,
}

const YEARS = Array.from({ length: 25 }, (_, i) => 2025 - i)

// ─── Label component OUTSIDE parent → prevents keyboard dismiss ────────────
interface LabelProps {
  children: React.ReactNode
  err?: string
  required?: boolean
}

const Label = ({ children, err, required }: LabelProps) => (
  <div style={{ marginBottom: 14 }}>
    {required && <span style={{ color: '#DC2626', fontSize: 10, marginLeft: 2 }}></span>}
    {children}
    {err && (
      <div style={{ color: '#DC2626', fontSize: 12, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
        ⚠ {err}
      </div>
    )}
  </div>
)
// ────────────────────────────────────────────────────────────────────────────

function ImageDropZone({ label, url, onUpload, onRemove }: {
  label: string; url?: string; onUpload: (f: File) => Promise<void>; onRemove: () => void
}) {
  const [loading, setLoading] = useState(false)
  const onDrop = useCallback(async (files: File[]) => {
    if (!files[0]) return
    setLoading(true)
    await onUpload(files[0]).catch(() => {})
    setLoading(false)
  }, [onUpload])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1, maxSize: 5 * 1024 * 1024,
  })
  return (
    <div>
      <div style={{ color: '#64748B', fontSize: 12, fontWeight: 600, letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
      {url ? (
        <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '2px solid #0052CC' }}>
          <img src={url} alt={label} style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
          <button onClick={onRemove} style={{
            position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)',
            border: 'none', borderRadius: 6, color: '#fff', width: 24, height: 24,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={12} />
          </button>
          <div style={{ position: 'absolute', bottom: 6, left: 6, background: 'rgba(0,82,204,0.9)', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
            ✓ UPLOADED
          </div>
        </div>
      ) : (
        <div {...getRootProps()} style={{
          border: `2px dashed ${isDragActive ? '#0052CC' : '#E3F2FD'}`,
          borderRadius: 10, height: 110,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', background: isDragActive ? '#EBF2FF' : '#F8F9FC',
          transition: 'all 0.2s', gap: 6,
        }}>
          <input {...getInputProps()} />
          {loading
            ? <Loader size={20} style={{ color: '#0052CC', animation: 'spin 0.7s linear infinite' }} />
            : <Upload size={20} style={{ color: '#CBD5E1' }} />}
          <span style={{ color: '#94A3B8', fontSize: 11 }}>
            {loading ? 'Uploading...' : isDragActive ? 'Drop here' : 'Tap to upload'}
          </span>
        </div>
      )}
    </div>
  )
}

export default function SellCar() {
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<ValuationForm>(BLANK)
  const [images, setImages] = useState<ValuationImages>({})
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = useCallback((k: keyof ValuationForm, v: unknown) => {
    setForm(f => ({ ...f, [k]: v }))
  }, [])

  // Live price estimate based on form data
  const liveEstimate = useCallback(() => {
    if (!form.brand || !form.model || !form.year || !form.km_driven) return null
    try {
      const report = calculateValuation(form)
      return report.recommended_price
    } catch {
      return null
    }
  }, [form])

  const estimate = liveEstimate()

  const validate = () => {
    const e: Record<string, string> = {}
    if (step === 0) {
      if (!form.brand) e.brand = 'Required'
      if (!form.model.trim()) e.model = 'Required'
      if (!form.year) e.year = 'Required'
      if (!form.km_driven && form.km_driven !== 0) e.km = 'Required'
    }
    if (step === 3) {
      if (!form.customer_name.trim()) e.name = 'Required'
      if (!form.customer_phone.trim() || form.customer_phone.length < 10) e.phone = 'Valid 10-digit number required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate()) setStep(s => Math.min(3, s + 1)) }
  const back = () => setStep(s => Math.max(0, s - 1))

  const handleImageUpload = async (key: keyof ValuationImages, file: File) => {
    const url = await uploadValuationImage(file)
    setImages(i => ({ ...i, [key]: url }))
  }

  const submit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      const report = calculateValuation(form)
      const val = await createValuation({
        ...form, images, report, status: 'pending', admin_note: '', admin_override_price: null,
      })
      nav(`/sell/result/${val.id}`)
    } catch (e) {
      console.error(e)
      setSubmitting(false)
    }
  }

  const inp = useCallback((k: keyof ValuationForm) => ({
    value: form[k] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => set(k, e.target.value),
    style: { borderColor: errors[String(k)] ? '#DC2626' : undefined },
  }), [form, errors, set])

  return (
    <div style={{ background: '#F8F9FC', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,#0052CC,#003D99)', color: '#fff', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', display: 'inline-block', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>
              SELL YOUR CAR
            </div>
            <h1 style={{ fontFamily: 'Nunito,sans-serif', fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, marginBottom: 10 }}>
              Get Instant AI Valuation
            </h1>
            <p style={{ opacity: 0.88, fontSize: 15, lineHeight: 1.6, marginBottom: estimate ? 16 : 0 }}>
              Fill in your car details and get an estimated market price in seconds.
            </p>
            {/* Live estimate pill */}
            {estimate && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                borderRadius: 30, padding: '8px 20px', marginTop: 8,
                border: '1.5px solid rgba(255,255,255,0.3)',
              }}>
                <TrendingUp size={16} style={{ color: '#4ADE80' }} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>Live estimate: </span>
                <span style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 18 }}>{fmt(estimate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: '#fff', borderBottom: '1px solid #E8ECF0', padding: '16px 24px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {i > 0 && (
                  <div style={{ position: 'absolute', top: 14, left: '-50%', right: '50%', height: 2, background: i <= step ? '#0052CC' : '#E3F2FD', transition: 'background 0.3s' }} />
                )}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: i < step ? '#0052CC' : i === step ? '#0052CC' : '#F8F9FC',
                  border: `2px solid ${i <= step ? '#0052CC' : '#E3F2FD'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 6, transition: 'all 0.3s', zIndex: 1,
                }}>
                  {i < step
                    ? <Check size={14} style={{ color: '#fff' }} />
                    : <span style={{ color: i === step ? '#fff' : '#94A3B8', fontSize: 11, fontWeight: 700 }}>{i + 1}</span>}
                </div>
                <span style={{ color: i <= step ? '#0052CC' : '#94A3B8', fontSize: 11, fontWeight: i === step ? 700 : 400, textAlign: 'center' }}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ maxWidth: 700, margin: '32px auto', padding: '0 16px' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #E8ECF0' }} className="slide-in">

            {/* Step 0 */}
            {step === 0 && (
              <div>
                <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 22, color: '#1A1A2E', marginBottom: 24 }}>Car Details</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Label err={errors.brand} required>
                    <label style={{ color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>BRAND *</label>
                    <select {...inp('brand')}>
                      {BRANDS.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </Label>
                  <Label err={errors.model} required>
                    <label style={{ color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>MODEL *</label>
                    <input {...inp('model')} placeholder="e.g. Swift, City, Nexon" />
                  </Label>
                  <Label>
                    <label style={{ color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>VARIANT</label>
                    <input {...inp('variant')} placeholder="e.g. VXI, ZX, XZ+" />
                  </Label>
                  <Label err={errors.year} required>
                    <label style={{ color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>YEAR *</label>
                    <select value={form.year} onChange={e => set('year', Number(e.target.value))}>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </Label>
                  <Label>
                    <label style={{ color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>FUEL TYPE</label>
                    <select {...inp('fuel')}>
                      <option>Petrol</option><option>Diesel</option><option>CNG</option><option>Electric</option>
                    </select>
                  </Label>
                  <Label>
                    <label style={{ color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>TRANSMISSION</label>
                    <select {...inp('transmission')}>
                      <option>Manual</option><option>Automatic</option>
                    </select>
                  </Label>
                  <Label err={errors.km} required>
                    <label style={{ color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>KM DRIVEN *</label>
                    <input type="number" value={form.km_driven} onChange={e => set('km_driven', Number(e.target.value))} placeholder="e.g. 45000" />
                  </Label>
                  <Label>
                    <label style={{ color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>NO. OF OWNERS</label>
                    <select value={form.owners} onChange={e => set('owners', Number(e.target.value))}>
                      {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Owner{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </Label>
                  <Label>
                    <label style={{ color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>REGISTRATION CITY</label>
                    <input {...inp('registration_city')} placeholder="e.g. Jhansi" />
                  </Label>
                </div>
              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 22, color: '#1A1A2E', marginBottom: 24 }}>Car Condition</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    ['EXTERIOR CONDITION', 'exterior_condition', ['excellent', 'good', 'fair', 'poor']],
                    ['INTERIOR CONDITION', 'interior_condition', ['excellent', 'good', 'fair', 'poor']],
                    ['ENGINE CONDITION', 'engine_condition', ['excellent', 'good', 'fair']],
                    ['TIRE CONDITION', 'tire_condition', ['new', 'good', 'worn']],
                    ['SERVICE HISTORY', 'service_history', ['full', 'partial', 'none']],
                  ].map(([label, key, opts]) => (
                    <div key={String(key)}>
                      <label style={{ color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>{label}</label>
                      <select value={form[key as keyof ValuationForm] as string} onChange={e => set(key as keyof ValuationForm, e.target.value)}>
                        {(opts as string[]).map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
                  {[
                    ['insurance_valid', '✅ Valid Insurance', 'Insurance is active and transferable'],
                    ['accident_history', '⚠️ Accident History', 'Car has been in an accident before'],
                  ].map(([key, label, desc]) => (
                    <label key={String(key)} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer',
                      padding: '14px 16px', background: '#F8F9FC', borderRadius: 12,
                      border: `1.5px solid ${form[key as keyof ValuationForm] ? '#0052CC' : '#E3F2FD'}`,
                      transition: 'all 0.2s',
                    }}>
                      <input
                        type="checkbox"
                        checked={form[key as keyof ValuationForm] as boolean}
                        onChange={e => set(key as keyof ValuationForm, e.target.checked)}
                        style={{ width: 18, height: 18, accentColor: '#0052CC', marginTop: 1, cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ color: '#1A1A2E', fontWeight: 600, fontSize: 14 }}>{label}</div>
                        <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 22, color: '#1A1A2E', marginBottom: 8 }}>Upload Car Photos</h2>
                <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24 }}>
                  Better photos = more accurate valuation + higher buyer confidence.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { key: 'front' as const, label: '📸 Front View' },
                    { key: 'back' as const, label: '📸 Rear View' },
                    { key: 'side' as const, label: '📸 Side View' },
                    { key: 'interior' as const, label: '📸 Interior' },
                    { key: 'dashboard' as const, label: '📸 Dashboard' },
                  ].map(({ key, label }) => (
                    <ImageDropZone
                      key={key} label={label} url={images[key]}
                      onUpload={f => handleImageUpload(key, f)}
                      onRemove={() => setImages(i => ({ ...i, [key]: undefined }))}
                    />
                  ))}
                  <div style={{
                    padding: 12, background: '#EBF2FF', borderRadius: 10,
                    border: '1px dashed #B3D1FF', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'column', gap: 4,
                  }}>
                    <span style={{ fontSize: 24 }}>💡</span>
                    <span style={{ color: '#003D99', fontSize: 11, textAlign: 'center', fontWeight: 500 }}>Good lighting increases valuation accuracy by 15%</span>
                  </div>
                </div>
                <div style={{ marginTop: 16, background: '#F0FDF4', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#059669', fontWeight: 600, border: '1px solid #BBF7D0' }}>
                  ✓ {Object.values(images).filter(Boolean).length}/5 photos uploaded
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 22, color: '#1A1A2E', marginBottom: 8 }}>Your Details</h2>
                <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24 }}>
                  We'll send your valuation report and our team will contact you within 2 hours.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Label err={errors.name} required>
                    <label style={{ color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>FULL NAME *</label>
                    <input {...inp('customer_name')} placeholder="Your name" />
                  </Label>
                  <Label err={errors.phone} required>
                    <label style={{ color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>PHONE NUMBER *</label>
                    <input {...inp('customer_phone')} placeholder="10-digit mobile number" maxLength={10} />
                  </Label>
                  <Label>
                    <label style={{ color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>EMAIL (optional)</label>
                    <input {...inp('customer_email')} placeholder="your@email.com" type="email" />
                  </Label>
                  <label style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer',
                    padding: '16px', background: '#F0FDF4', borderRadius: 12, border: '1.5px solid #BBF7D0',
                  }}>
                    <input
                      type="checkbox"
                      checked={form.want_inspection}
                      onChange={e => set('want_inspection', e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: '#16A34A', marginTop: 1, cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ color: '#16A34A', fontWeight: 700, fontSize: 14 }}>🔍 Request Free Home Inspection</div>
                      <div style={{ color: '#4ADE80', fontSize: 12, marginTop: 2 }}>
                        Our expert visits your location — completely free of charge. Gets you 10–15% better price.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'space-between' }}>
              {step > 0 ? (
                <button onClick={back} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ChevronLeft size={16} /> Back
                </button>
              ) : <div />}
              {step < 3 ? (
                <button onClick={next} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={submit} disabled={submitting} className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', opacity: submitting ? 0.7 : 1, minWidth: 180, justifyContent: 'center' }}>
                  {submitting
                    ? <><Loader size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Calculating...</>
                    : <>Get My Valuation 🚀</>}
                </button>
              )}
            </div>
          </div>
        </div>
        <PoweredBy />
      </div>
    </div>
  )
}
