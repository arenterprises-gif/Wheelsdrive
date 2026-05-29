import { CarFilters } from '@/types'
import { BRANDS, SEGMENTS, FUELS, TRANSMISSIONS, CONDITIONS, fmt } from '@/lib/utils'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

const PRICE_CATS = ['Budget', 'Economy', 'Mid-Range', 'Premium', 'Luxury']
const YEARS = Array.from({ length: 12 }, (_, i) => 2025 - i)

const sel: React.CSSProperties = {
  width: '100%',
  background: '#FFFFFF',
  border: '1.5px solid #E5E7EB',
  color: '#374151',
  borderRadius: 9,
  padding: '9px 12px',
  fontSize: 13,
  outline: 'none',
  cursor: 'pointer',
  fontFamily: 'Nunito,sans-serif',
  fontWeight: 600,
  appearance: 'none',
  WebkitAppearance: 'none',
  transition: 'border-color 0.18s',
}

export default function FilterPanel({
  filters, onChange, brands, total,
}: {
  filters: Partial<CarFilters>
  onChange: (f: Partial<CarFilters>) => void
  brands?: string[]
  total: number
}) {
  const [open, setOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.search || '')
  const debouncedSearch = useDebounce(searchInput, 380)

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onChange({ ...filters, search: debouncedSearch || undefined })
    }
  }, [debouncedSearch])

  const set = (k: keyof CarFilters, v: unknown) => onChange({ ...filters, [k]: v || undefined })
  const clear = () => { onChange({ show_sold: false }); setSearchInput('') }
  const activeCount = Object.entries(filters).filter(
    ([k, v]) => k !== 'show_sold' && v !== undefined && v !== '' && v !== false
  ).length

  return (
    <div style={{ marginBottom: 22 }}>
      {/* Top filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: open || activeCount > 0 ? 'linear-gradient(135deg, #0052CC, #0066FF)' : '#FFFFFF',
            color: open || activeCount > 0 ? '#fff' : '#6B7280',
            border: `1.5px solid ${open || activeCount > 0 ? '#0052CC' : '#E5E7EB'}`,
            borderRadius: 10, padding: '9px 16px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            fontWeight: 700, fontSize: 13, fontFamily: 'Nunito,sans-serif',
            transition: 'all 0.2s',
            boxShadow: open || activeCount > 0 ? '0 3px 10px rgba(0,82,204,0.25)' : 'none',
          }}
          onMouseEnter={e => {
            if (!open && activeCount === 0) {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#0052CC'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#0052CC'
            }
          }}
          onMouseLeave={e => {
            if (!open && activeCount === 0) {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#6B7280'
            }
          }}>
          <SlidersHorizontal size={15} />
          Filters
          {activeCount > 0 && (
            <span style={{ background: '#fff', color: '#0052CC', borderRadius: '50%', width: 20, height: 20, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
              {activeCount}
            </span>
          )}
          <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
        </button>

        {activeCount > 0 && (
          <button
            onClick={clear}
            style={{
              background: '#FEF2F2', border: '1.5px solid #FECACA',
              color: '#DC2626', borderRadius: 8, padding: '8px 12px',
              cursor: 'pointer', fontSize: 12, display: 'flex',
              alignItems: 'center', gap: 4, fontWeight: 700,
              fontFamily: 'Nunito,sans-serif', transition: 'all 0.18s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#DC2626'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'; (e.currentTarget as HTMLButtonElement).style.color = '#DC2626'; }}>
            <X size={12} /> Clear all
          </button>
        )}

        <span style={{ color: '#9CA3AF', fontSize: 13, marginLeft: 'auto', fontWeight: 600 }}>
          <span style={{ color: '#0052CC', fontWeight: 800 }}>{total}</span> {total === 1 ? 'car' : 'cars'} found
        </span>
      </div>

      {/* Expanded filters */}
      {open && (
        <div
          className="fade-up"
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E5E7EB',
            borderRadius: 16,
            padding: '20px 20px 16px',
            marginBottom: 20,
            boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(155px,1fr))',
            gap: 14,
          }}
        >
          {([
            ['BRAND',        'brand',        ['', ...(brands?.length ? brands : BRANDS)]],
            ['SEGMENT',      'segment',      ['', ...SEGMENTS]],
            ['FUEL',         'fuel',         ['', ...FUELS]],
            ['TRANSMISSION', 'transmission', ['', 'Manual', 'Automatic']],
            ['CONDITION',    'condition',    ['', ...CONDITIONS]],
            ['PRICE RANGE',  'price_category', ['', ...PRICE_CATS]],
          ] as [string, keyof CarFilters, string[]][]).map(([label, key, opts]) => (
            <div key={key} style={{ position: 'relative' }}>
              <label style={{ color: '#9CA3AF', fontSize: 10, letterSpacing: 1, display: 'block', marginBottom: 5, fontWeight: 700, textTransform: 'uppercase' }}>
                {label}
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  style={{
                    ...sel,
                    borderColor: (filters as Record<string, unknown>)[key] ? '#0052CC' : '#E5E7EB',
                    color: (filters as Record<string, unknown>)[key] ? '#0052CC' : '#374151',
                    background: (filters as Record<string, unknown>)[key] ? '#EBF2FF' : '#FFFFFF',
                    paddingRight: 28,
                  }}
                  value={((filters as Record<string, unknown>)[key] as string) || ''}
                  onChange={e => set(key, e.target.value)}
                  onFocus={e => (e.currentTarget as HTMLSelectElement).style.borderColor = '#0052CC'}
                  onBlur={e => (e.currentTarget as HTMLSelectElement).style.borderColor = (filters as Record<string, unknown>)[key] ? '#0052CC' : '#E5E7EB'}
                >
                  {opts.map(o => <option key={o} value={o}>{o || `All ${label.toLowerCase()}`}</option>)}
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
              </div>
            </div>
          ))}

          {/* Max Price */}
          <div style={{ position: 'relative' }}>
            <label style={{ color: '#9CA3AF', fontSize: 10, letterSpacing: 1, display: 'block', marginBottom: 5, fontWeight: 700, textTransform: 'uppercase' }}>MAX PRICE</label>
            <div style={{ position: 'relative' }}>
              <select
                style={{ ...sel, paddingRight: 28, borderColor: filters.max_price ? '#0052CC' : '#E5E7EB', background: filters.max_price ? '#EBF2FF' : '#FFFFFF', color: filters.max_price ? '#0052CC' : '#374151' }}
                value={filters.max_price || ''}
                onChange={e => set('max_price', Number(e.target.value))}>
                <option value="">No Limit</option>
                {[300000, 500000, 700000, 1000000, 1500000, 2000000].map(p => (
                  <option key={p} value={p}>{fmt(p)}</option>
                ))}
              </select>
              <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Min Year */}
          <div style={{ position: 'relative' }}>
            <label style={{ color: '#9CA3AF', fontSize: 10, letterSpacing: 1, display: 'block', marginBottom: 5, fontWeight: 700, textTransform: 'uppercase' }}>MIN YEAR</label>
            <div style={{ position: 'relative' }}>
              <select
                style={{ ...sel, paddingRight: 28, borderColor: filters.min_year ? '#0052CC' : '#E5E7EB', background: filters.min_year ? '#EBF2FF' : '#FFFFFF', color: filters.min_year ? '#0052CC' : '#374151' }}
                value={filters.min_year || ''}
                onChange={e => set('min_year', Number(e.target.value))}>
                <option value="">Any Year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Hot Deals */}
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: 18 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#374151', fontSize: 13, fontFamily: 'Nunito,sans-serif', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={!!filters.is_hot_deal}
                onChange={e => set('is_hot_deal', e.target.checked || undefined)}
                style={{ width: 16, height: 16, accentColor: '#0052CC', cursor: 'pointer' }}
              />
              🔥 Hot Deals
            </label>
          </div>

          {/* Show Sold */}
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: 18 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#374151', fontSize: 13, fontFamily: 'Nunito,sans-serif', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={!!filters.show_sold}
                onChange={e => onChange({ ...filters, show_sold: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: '#0052CC', cursor: 'pointer' }}
              />
              Show Sold
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
