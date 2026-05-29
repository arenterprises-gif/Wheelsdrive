import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCarById, createCar, updateCar } from '@/lib/queries'
import { getPriceCategory, BRANDS, SEGMENTS, FUELS, TRANSMISSIONS, CONDITIONS, FEATURES_LIST } from '@/lib/utils'
import { Car } from '@/types'
import ImageUpload from '@/components/ImageUpload'
import { ChevronLeft, Save, Loader, Wand2, Check } from 'lucide-react'

const BLANK: Partial<Car> = {
  title: '', brand: 'Maruti', model: '', year: new Date().getFullYear(), price: 500000,
  km_driven: 30000, fuel: 'Petrol', transmission: 'Manual', condition: 'Good',
  color: '', owners: 1, segment: 'Hatchback', price_category: 'Economy',
  is_hot_deal: false, is_sold: false, is_featured: false,
  description: '', features: [], images: [],
}

export default function AddEditCar() {
  const { id } = useParams<{ id?: string }>()
  const nav = useNavigate()
  const qc = useQueryClient()
  const isEdit = !!id

  const [form, setForm] = useState<Partial<Car>>(BLANK)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  const { data: existing } = useQuery({
    queryKey: ['car', id],
    queryFn: () => fetchCarById(id!),
    enabled: isEdit,
  })

  useEffect(() => {
    if (existing) setForm(existing)
  }, [existing])

  useEffect(() => {
    if (form.brand && form.model && form.year && !isEdit) {
      setForm(f => ({ ...f, title: `${f.brand} ${f.model} ${f.year}`.trim() }))
    }
  }, [form.brand, form.model, form.year])

  useEffect(() => {
    if (form.price) {
      setForm(f => ({ ...f, price_category: getPriceCategory(f.price!) as Car['price_category'] }))
    }
  }, [form.price])

  const set = (k: keyof Car, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    key: keyof Car
  ) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    set(key, value)
  }, [])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.title) e.title = 'Title is required'
    if (!form.brand) e.brand = 'Brand is required'
    if (!form.price || form.price < 1000) e.price = 'Valid price required'
    if (!form.km_driven && form.km_driven !== 0) e.km = 'KM driven required'
    if (!form.color) e.color = 'Color is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Car>) => isEdit ? updateCar(id!, data) : createCar(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-cars'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
      qc.invalidateQueries({ queryKey: ['featured'] })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      if (!isEdit) nav('/admin/cars')
    },
  })

  const handleSave = () => {
    if (!validate()) return
    saveMutation.mutate(form)
  }

  const toggleFeature = (f: string) => {
    const cur = form.features || []
    set('features', cur.includes(f) ? cur.filter(x => x !== f) : [...cur, f])
  }

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label style={{ color: '#6B7280', fontSize: 11, letterSpacing: 0.8, display: 'block', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase' }}>{label}</label>
      {children}
      {error && <div style={{ color: '#DC2626', fontSize: 12, marginTop: 4, fontWeight: 500 }}>{error}</div>}
    </div>
  )

  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 16,
    padding: 22,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  }

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button onClick={() => nav('/admin/cars')}
          style={{
            background: '#FFFFFF', border: '1.5px solid #E5E7EB',
            color: '#6B7280', borderRadius: 10, padding: '9px 16px',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: 6, fontSize: 13, fontWeight: 600, fontFamily: 'Nunito,sans-serif',
            transition: 'all 0.18s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#0052CC';
            (e.currentTarget as HTMLButtonElement).style.color = '#0052CC';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB';
            (e.currentTarget as HTMLButtonElement).style.color = '#6B7280';
          }}>
          <ChevronLeft size={14} /> Back
        </button>
        <div>
          <h1 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 24, color: '#111827' }}>
            {isEdit ? 'Edit Car' : 'Add New Car'}
          </h1>
          {form.price_category && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#7C3AED', fontSize: 12, marginTop: 3, fontWeight: 600 }}>
              <Wand2 size={12} /> Auto-categorized: <span style={{ background: '#F5F3FF', padding: '1px 8px', borderRadius: 6, border: '1px solid #DDD6FE' }}>{form.price_category}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={cardStyle}>
            <h3 style={{ color: '#111827', fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 15, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #F3F4F6' }}>
              Basic Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Brand" error={errors.brand}>
                <select value={form.brand || ''} onChange={e => set('brand', e.target.value)}>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Model (e.g. Swift VXI, City ZX)">
                <input value={form.model || ''} onChange={e => handleChange(e, 'model')} placeholder="e.g. Swift VXI" />
              </Field>
              <Field label="Title (auto-generated)" error={errors.title}>
                <input value={form.title || ''} onChange={e => handleChange(e, 'title')} placeholder="e.g. Maruti Swift VXI 2021" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Year">
                  <input type="number" value={form.year || ''} onChange={e => set('year', Number(e.target.value))} min={2000} max={2026} />
                </Field>
                <Field label="Color" error={errors.color}>
                  <input value={form.color || ''} onChange={e => handleChange(e, 'color')} placeholder="e.g. Pearl White" />
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="No. of Owners">
                  <select value={form.owners || 1} onChange={e => set('owners', Number(e.target.value))}>
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Owner{n > 1 ? 's' : ''}</option>)}
                  </select>
                </Field>
                <Field label="Segment">
                  <select value={form.segment || ''} onChange={e => set('segment', e.target.value)}>
                    {SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: '#111827', fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 15, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #F3F4F6' }}>
              Pricing & Stats
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Price (₹)" error={errors.price}>
                <input type="number" value={form.price || ''} onChange={e => set('price', Number(e.target.value))} placeholder="500000" />
              </Field>
              {form.price_category && (
                <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, color: '#7C3AED', fontSize: 13, fontWeight: 600 }}>
                  <Wand2 size={13} /> Auto-set: <strong>{form.price_category}</strong>
                </div>
              )}
              <Field label="KM Driven" error={errors.km}>
                <input type="number" value={form.km_driven ?? ''} onChange={e => set('km_driven', Number(e.target.value))} placeholder="30000" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Fuel">
                  <select value={form.fuel || ''} onChange={e => set('fuel', e.target.value)}>
                    {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </Field>
                <Field label="Transmission">
                  <select value={form.transmission || ''} onChange={e => set('transmission', e.target.value)}>
                    {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Condition">
                <select value={form.condition || ''} onChange={e => set('condition', e.target.value)}>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: '#111827', fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 15, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #F3F4F6' }}>
              Flags & Visibility
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { key: 'is_hot_deal', label: '🔥 Mark as Hot Deal', desc: 'Shows in Hot Deals section on homepage', color: '#0052CC' },
                { key: 'is_featured', label: '⭐ Mark as Featured', desc: 'Gets priority placement in listings', color: '#7C3AED' },
                { key: 'is_sold', label: '✅ Mark as Sold', desc: 'Shows SOLD badge and hides from listings', color: '#059669' },
              ].map(({ key, label, desc, color }) => (
                <label key={key}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    cursor: 'pointer', padding: '12px 14px',
                    background: form[key as keyof Car] ? `${color}08` : '#F9FAFB',
                    borderRadius: 10,
                    border: `1.5px solid ${form[key as keyof Car] ? `${color}40` : '#E5E7EB'}`,
                    transition: 'all 0.18s',
                  }}>
                  <input type="checkbox"
                    checked={!!form[key as keyof Car]}
                    onChange={e => set(key as keyof Car, e.target.checked)}
                    style={{ accentColor: color, marginTop: 2, width: 16, height: 16, cursor: 'pointer' }} />
                  <div>
                    <div style={{ color: '#111827', fontSize: 13, fontWeight: 700 }}>{label}</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={cardStyle}>
            <h3 style={{ color: '#111827', fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 15, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #F3F4F6' }}>
              Photos
            </h3>
            <ImageUpload images={form.images || []} onChange={imgs => set('images', imgs)} />
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: '#111827', fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 15, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #F3F4F6' }}>
              Description
            </h3>
            <textarea
              value={form.description || ''}
              onChange={e => handleChange(e, 'description')}
              placeholder="Describe the car's condition, service history, standout features..."
              style={{ minHeight: 130, resize: 'vertical' }}
            />
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: '#111827', fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 15, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Features
              <span style={{ color: '#9CA3AF', fontSize: 12, fontWeight: 500 }}>
                {(form.features || []).length} selected
              </span>
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {FEATURES_LIST.map(f => {
                const on = (form.features || []).includes(f)
                return (
                  <button key={f} onClick={() => toggleFeature(f)}
                    style={{
                      background: on ? '#EBF2FF' : '#F9FAFB',
                      border: `1.5px solid ${on ? '#0052CC' : '#E5E7EB'}`,
                      color: on ? '#0052CC' : '#6B7280',
                      borderRadius: 20, padding: '5px 12px',
                      cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                    {on && <Check size={11} />}{f}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Save bar */}
      <div style={{
        position: 'sticky', bottom: 0,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #E5E7EB',
        padding: '14px 0', marginTop: 20,
        display: 'flex', gap: 12, justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
        {saveSuccess && (
          <div style={{ background: '#ECFDF5', border: '1px solid #BBF7D0', color: '#059669', borderRadius: 8, padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <Check size={14} /> Saved successfully!
          </div>
        )}
        {saveMutation.isError && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 600 }}>
            {(saveMutation.error as Error).message}
          </div>
        )}
        <button onClick={() => nav('/admin/cars')}
          style={{ background: '#FFFFFF', color: '#6B7280', border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '11px 22px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Nunito,sans-serif', fontSize: 14, transition: 'all 0.18s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#0052CC'; (e.currentTarget as HTMLButtonElement).style.color = '#0052CC'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLButtonElement).style.color = '#6B7280'; }}>
          Cancel
        </button>
        <button onClick={handleSave} disabled={saveMutation.isPending}
          style={{
            background: saveMutation.isPending ? '#9CA3AF' : 'linear-gradient(135deg,#0052CC,#0066FF)',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '11px 24px', cursor: saveMutation.isPending ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14,
            fontFamily: 'Nunito,sans-serif',
            boxShadow: saveMutation.isPending ? 'none' : '0 4px 14px rgba(0,82,204,0.3)',
            transition: 'all 0.18s',
          }}>
          {saveMutation.isPending
            ? <><Loader size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Saving...</>
            : <><Save size={16} /> {isEdit ? 'Save Changes' : 'Add Car'}</>}
        </button>
      </div>
    </div>
  )
}
