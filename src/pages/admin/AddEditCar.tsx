import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCarById, createCar, updateCar } from '@/lib/queries'
import { getPriceCategory, BRANDS, SEGMENTS, FUELS, TRANSMISSIONS, CONDITIONS, FEATURES_LIST } from '@/lib/utils'
import { Car } from '@/types'
import ImageUpload from '@/components/ImageUpload'
import { ChevronLeft, Save, Loader, Wand2 } from 'lucide-react'

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

  // Auto title generation
  useEffect(() => {
    if (form.brand && form.model && form.year && !isEdit) {
      setForm(f => ({ ...f, title: `${f.brand} ${f.model} ${f.year}`.trim() }))
    }
  }, [form.brand, form.model, form.year])

  // Auto price category
  useEffect(() => {
    if (form.price) {
      setForm(f => ({ ...f, price_category: getPriceCategory(f.price!) as Car['price_category'] }))
    }
  }, [form.price])

  const set = (k: keyof Car, v: unknown) => setForm(f => ({ ...f, [k]: v }))

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
      setTimeout(() => setSaveSuccess(false), 2000)
      if (!isEdit) {
        nav('/admin/cars')
      }
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

  const inp = { style: { width: '100%' } }

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label style={{ color: '#666', fontSize: 11, letterSpacing: 1, display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
      {error && <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{error}</div>}
    </div>
  )

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button onClick={() => nav('/admin/cars')} style={{ background: 'none', border: '1px solid #1e1e3a', color: '#888', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <ChevronLeft size={14} /> Back
        </button>
        <div>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22, color: '#fff' }}>{isEdit ? 'Edit Car' : 'Add New Car'}</h1>
          {form.price_category && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 12, marginTop: 3 }}>
              <Wand2 size={12} style={{ color: '#7c3aed' }} />
              Auto-categorized: <span style={{ color: '#7c3aed', fontWeight: 600 }}>{form.price_category}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ color: '#fff', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Basic Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="BRAND" error={errors.brand}>
                <select value={form.brand || ''} onChange={e => set('brand', e.target.value)}>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="MODEL (e.g. Swift VXI, City ZX)">
                <input value={form.model || ''} onChange={e => set('model', e.target.value)} placeholder="e.g. Swift VXI" />
              </Field>
              <Field label="TITLE (auto-generated)" error={errors.title}>
                <input value={form.title || ''} onChange={e => set('title', e.target.value)} placeholder="e.g. Maruti Swift VXI 2021" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="YEAR">
                  <input type="number" value={form.year || ''} onChange={e => set('year', Number(e.target.value))} min={2000} max={2025} />
                </Field>
                <Field label="COLOR" error={errors.color}>
                  <input value={form.color || ''} onChange={e => set('color', e.target.value)} placeholder="e.g. Pearl White" />
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="NO. OF OWNERS">
                  <select value={form.owners || 1} onChange={e => set('owners', Number(e.target.value))}>
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Owner{n > 1 ? 's' : ''}</option>)}
                  </select>
                </Field>
                <Field label="SEGMENT">
                  <select value={form.segment || ''} onChange={e => set('segment', e.target.value)}>
                    {SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ color: '#fff', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Pricing & Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="PRICE (₹)" error={errors.price}>
                <input type="number" value={form.price || ''} onChange={e => set('price', Number(e.target.value))} placeholder="500000" />
              </Field>
              {form.price_category && (
                <div style={{ background: '#7c3aed18', border: '1px solid #7c3aed33', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, color: '#7c3aed', fontSize: 13 }}>
                  <Wand2 size={13} /> Auto-set: <strong>{form.price_category}</strong>
                </div>
              )}
              <Field label="KM DRIVEN" error={errors.km}>
                <input type="number" value={form.km_driven ?? ''} onChange={e => set('km_driven', Number(e.target.value))} placeholder="30000" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="FUEL">
                  <select value={form.fuel || ''} onChange={e => set('fuel', e.target.value)}>
                    {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </Field>
                <Field label="TRANSMISSION">
                  <select value={form.transmission || ''} onChange={e => set('transmission', e.target.value)}>
                    {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="CONDITION">
                <select value={form.condition || ''} onChange={e => set('condition', e.target.value)}>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ color: '#fff', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Flags</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'is_hot_deal', label: '🔥 Mark as Hot Deal', desc: 'Shows in Hot Deals section on homepage' },
                { key: 'is_featured', label: '⭐ Mark as Featured', desc: 'Gets priority placement' },
                { key: 'is_sold', label: '✅ Mark as Sold', desc: 'Shows SOLD badge, hides from listings' },
              ].map(({ key, label, desc }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', padding: '10px 12px', background: '#0d0d20', borderRadius: 8, border: `1px solid ${form[key as keyof Car] ? '#dc262244' : '#1e1e3a'}` }}>
                  <input type="checkbox" checked={!!form[key as keyof Car]} onChange={e => set(key as keyof Car, e.target.checked)} style={{ accentColor: '#dc2626', marginTop: 2, width: 15, height: 15, cursor: 'pointer' }} />
                  <div>
                    <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{label}</div>
                    <div style={{ color: '#555', fontSize: 11, marginTop: 2 }}>{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ color: '#fff', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Photos</h3>
            <ImageUpload images={form.images || []} onChange={imgs => set('images', imgs)} />
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ color: '#fff', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Description</h3>
            <textarea value={form.description || ''} onChange={e => set('description', e.target.value)}
              placeholder="Describe the car's condition, service history, standout features..." style={{ minHeight: 120, resize: 'vertical' }} />
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ color: '#fff', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
              Features <span style={{ color: '#444', fontSize: 12, fontWeight: 400 }}>({(form.features || []).length} selected)</span>
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {FEATURES_LIST.map(f => {
                const on = (form.features || []).includes(f)
                return (
                  <button key={f} onClick={() => toggleFeature(f)}
                    style={{ background: on ? '#dc262222' : '#0d0d20', border: `1px solid ${on ? '#dc2626' : '#1e1e3a'}`, color: on ? '#dc2626' : '#666', borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontSize: 12, transition: 'all 0.15s' }}>
                    {on ? '✓ ' : ''}{f}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Save bar */}
      <div style={{ position: 'sticky', bottom: 0, background: 'rgba(10,10,24,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid #1e1e3a', padding: '16px 0', marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        {saveSuccess && (
          <div style={{ background: '#16a34a22', border: '1px solid #16a34a44', color: '#16a34a', borderRadius: 8, padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            ✓ Saved successfully
          </div>
        )}
        {saveMutation.isError && (
          <div style={{ background: '#7f1d1d22', border: '1px solid #7f1d1d', color: '#dc2626', borderRadius: 8, padding: '10px 16px', fontSize: 13 }}>
            {(saveMutation.error as Error).message}
          </div>
        )}
        <button onClick={() => nav('/admin/cars')} className="btn-ghost">Cancel</button>
        <button onClick={handleSave} disabled={saveMutation.isPending} className="btn-red"
          style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: saveMutation.isPending ? 0.7 : 1 }}>
          {saveMutation.isPending ? <><Loader size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Saving...</> : <><Save size={16} /> {isEdit ? 'Save Changes' : 'Add Car'}</>}
        </button>
      </div>
    </div>
  )
}
