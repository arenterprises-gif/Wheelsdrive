import { Car } from '@/types'
import { fmt, fmtKm } from '@/lib/utils'
import { X } from 'lucide-react'

export default function CompareView({ cars, onRemove, onClose }: {
  cars: Car[]
  onRemove: (id: string) => void
  onClose: () => void
}) {
  const specs: { key: keyof Car; label: string; render: (c: Car) => string; better?: 'lower' | 'higher' }[] = [
    { key: 'price', label: 'Price', render: c => fmt(c.price), better: 'lower' },
    { key: 'year', label: 'Year', render: c => String(c.year), better: 'higher' },
    { key: 'km_driven', label: 'KM Driven', render: c => fmtKm(c.km_driven), better: 'lower' },
    { key: 'fuel', label: 'Fuel', render: c => c.fuel },
    { key: 'transmission', label: 'Transmission', render: c => c.transmission },
    { key: 'condition', label: 'Condition', render: c => c.condition },
    { key: 'owners', label: 'Owners', render: c => `${c.owners}`, better: 'lower' },
    { key: 'segment', label: 'Segment', render: c => c.segment },
    { key: 'price_category', label: 'Price Category', render: c => c.price_category },
    { key: 'color', label: 'Color', render: c => c.color },
  ]

  const isBetter = (spec: typeof specs[0], car: Car, other: Car): boolean => {
    if (!spec.better) return false
    const a = car[spec.key] as number
    const b = other[spec.key] as number
    if (typeof a !== 'number' || typeof b !== 'number') return false
    return spec.better === 'lower' ? a < b : a > b
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 900, overflowY: 'auto', padding: 16 }} onClick={onClose}>
      <div className="fade-up" style={{ maxWidth: 680, margin: '40px auto', background: '#111127', borderRadius: 20, padding: 24, border: '1px solid #1e1e3a' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22, color: '#fff' }}>⚖️ Compare Cars</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={22} /></button>
        </div>

        {cars.length < 2 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#555' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚖️</div>
            <div style={{ color: '#888' }}>Select 2 cars using the compare button to see side-by-side comparison</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <td style={{ width: '30%', padding: 8 }}></td>
                  {cars.slice(0, 2).map(c => (
                    <td key={c.id} style={{ padding: 8, textAlign: 'center', verticalAlign: 'top' }}>
                      <div style={{ background: '#0d0d20', borderRadius: 12, padding: 12, position: 'relative' }}>
                        <button onClick={() => onRemove(c.id)} style={{ position: 'absolute', top: 6, right: 6, background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>✕</button>
                        <div style={{ fontSize: 36, marginBottom: 6 }}>{c.images?.[0] ? <img src={c.images[0]} style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 8 }} /> : '🚗'}</div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: 'Syne,sans-serif', lineHeight: 1.3 }}>{c.title}</div>
                        <div style={{ color: '#dc2626', fontWeight: 800, fontSize: 16, fontFamily: 'Syne,sans-serif', marginTop: 4 }}>{fmt(c.price)}</div>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specs.map(spec => (
                  <tr key={String(spec.key)} style={{ borderTop: '1px solid #1e1e3a' }}>
                    <td style={{ padding: '10px 8px', color: '#666', fontSize: 13 }}>{spec.label}</td>
                    {cars.slice(0, 2).map((c, i) => {
                      const other = cars[1 - i]
                      const better = other ? isBetter(spec, c, other) : false
                      return (
                        <td key={c.id} style={{ padding: '10px 8px', textAlign: 'center', color: better ? '#16a34a' : '#ccc', fontWeight: better ? 700 : 400, fontSize: 14 }}>
                          {better && <span style={{ marginRight: 4 }}>✓</span>}
                          {spec.render(c)}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
