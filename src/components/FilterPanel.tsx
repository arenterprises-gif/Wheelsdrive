import { useState } from 'react'
import { CarFilters } from '@/types'
import { BRANDS, SEGMENTS, FUELS, TRANSMISSIONS, CONDITIONS, fmt } from '@/lib/utils'
import { SlidersHorizontal, X } from 'lucide-react'

const PRICE_CATS = ['Budget', 'Economy', 'Mid-Range', 'Premium', 'Luxury']
const YEARS = Array.from({ length: 12 }, (_, i) => 2025 - i)

interface Props {
  filters: Partial<CarFilters>
  onChange: (f: Partial<CarFilters>) => void
  brands?: string[]
  total: number
}

export default function FilterPanel({ filters, onChange, brands, total }: Props) {
  const [open, setOpen] = useState(false)

  const set = (key: keyof CarFilters, val: unknown) =>
    onChange({ ...filters, [key]: val || undefined })

  const clear = () => onChange({ show_sold: false })

  const activeCount = Object.entries(filters).filter(
    ([k, v]) => k !== 'show_sold' && v !== undefined && v !== '' && v !== false
  ).length

  const sel = {
    width: '100%',
    background: '#0d0d20',
    border: '1px solid #1e1e3a',
    color: filters ? '#fff' : '#666',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 13,
    outline: 'none',
    cursor: 'pointer',
  }

  return (
    <div>
      {/* Toggle bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <button
          onClick={() => setOpen(!open)}
          style={{ background: open || activeCount > 0 ? '#dc2626' : '#1a1a3e', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 13 }}
        >
          <SlidersHorizontal size={15} />
          Filters {activeCount > 0 && `(${activeCount})`}
        </button>

        {activeCount > 0 && (
          <button onClick={clear} style={{ background: 'none', border: '1px solid #dc262655', color: '#dc2626', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <X size={12} /> Clear all
          </button>
        )}

        <span style={{ color: '#555', fontSize: 13, marginLeft: 'auto' }}>
          {total} {total === 1 ? 'car' : 'cars'} found
        </span>
      </div>

      {/* Panel */}
      {open && (
        <div style={{ background: '#111127', border: '1px solid #1e1e3a', borderRadius: 16, padding: 20, marginBottom: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}
          className="fade-up">

          {/* Brand */}
          <div>
            <label style={{ color: '#666', fontSize: 11, letterSpacing: 1, display: 'block', marginBottom: 6 }}>BRAND</label>
            <select style={sel} value={filters.brand || ''} onChange={e => set('brand', e.target.value)}>
              <option value="">All Brands</option>
              {(brands?.length ? brands : BRANDS).map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Segment */}
          <div>
            <label style={{ color: '#666', fontSize: 11, letterSpacing: 1, display: 'block', marginBottom: 6 }}>SEGMENT</label>
            <select style={sel} value={filters.segment || ''} onChange={e => set('segment', e.target.value)}>
              <option value="">All Segments</option>
              {SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Fuel */}
          <div>
            <label style={{ color: '#666', fontSize: 11, letterSpacing: 1, display: 'block', marginBottom: 6 }}>FUEL</label>
            <select style={sel} value={filters.fuel || ''} onChange={e => set('fuel', e.target.value)}>
              <option value="">All Fuels</option>
              {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label style={{ color: '#666', fontSize: 11, letterSpacing: 1, display: 'block', marginBottom: 6 }}>TRANSMISSION</label>
            <select style={sel} value={filters.transmission || ''} onChange={e => set('transmission', e.target.value)}>
              <option value="">All</option>
              {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label style={{ color: '#666', fontSize: 11, letterSpacing: 1, display: 'block', marginBottom: 6 }}>CONDITION</label>
            <select style={sel} value={filters.condition || ''} onChange={e => set('condition', e.target.value)}>
              <option value="">Any Condition</option>
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Price category */}
          <div>
            <label style={{ color: '#666', fontSize: 11, letterSpacing: 1, display: 'block', marginBottom: 6 }}>PRICE RANGE</label>
            <select style={sel} value={filters.price_category || ''} onChange={e => set('price_category', e.target.value)}>
              <option value="">Any Budget</option>
              {PRICE_CATS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Min Year */}
          <div>
            <label style={{ color: '#666', fontSize: 11, letterSpacing: 1, display: 'block', marginBottom: 6 }}>MIN YEAR</label>
            <select style={sel} value={filters.min_year || ''} onChange={e => set('min_year', Number(e.target.value))}>
              <option value="">Any Year</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Max Price */}
          <div>
            <label style={{ color: '#666', fontSize: 11, letterSpacing: 1, display: 'block', marginBottom: 6 }}>
              MAX PRICE {filters.max_price ? `(${fmt(filters.max_price)})` : ''}
            </label>
            <select style={sel} value={filters.max_price || ''} onChange={e => set('max_price', Number(e.target.value))}>
              <option value="">No Limit</option>
              {[300000, 500000, 700000, 1000000, 1500000, 2000000, 3000000].map(p => (
                <option key={p} value={p}>{fmt(p)}</option>
              ))}
            </select>
          </div>

          {/* Hot deals only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#ccc', fontSize: 13 }}>
              <input type="checkbox" checked={!!filters.is_hot_deal}
                onChange={e => set('is_hot_deal', e.target.checked || undefined)}
                style={{ width: 16, height: 16, accentColor: '#dc2626', cursor: 'pointer' }} />
              🔥 Hot Deals only
            </label>
          </div>

          {/* Show sold */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#ccc', fontSize: 13 }}>
              <input type="checkbox" checked={!!filters.show_sold}
                onChange={e => onChange({ ...filters, show_sold: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: '#dc2626', cursor: 'pointer' }} />
              Show Sold Cars
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
