import { Car } from '@/types'
import { fmt, fmtKm, CARD_GRADIENTS, waLink } from '@/lib/utils'
import { Scale, MessageCircle, Eye } from 'lucide-react'

interface Props {
  car: Car
  onView: (car: Car) => void
  onCompare: (car: Car) => void
  isComparing?: boolean
}

const COND_COLOR: Record<string, string> = {
  Excellent: '#16a34a',
  Good: '#d97706',
  Fair: '#6b7280',
}

export default function CarCard({ car, onView, onCompare, isComparing }: Props) {
  const grad = CARD_GRADIENTS[car.title.charCodeAt(0) % CARD_GRADIENTS.length]
  const img = car.images?.[0]

  return (
    <div
      className="fade-up"
      style={{
        background: '#111127',
        borderRadius: 16,
        overflow: 'hidden',
        border: isComparing ? '2px solid #dc2626' : '1px solid #1e1e3a',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(220,38,38,0.12)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLDivElement).style.transform = ''
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = ''
      }}
      onClick={() => onView(car)}
    >
      {/* Image / placeholder */}
      <div style={{ height: 168, background: grad, position: 'relative', overflow: 'hidden' }}>
        {img ? (
          <img
            src={img}
            alt={car.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 72 }}>
            🚗
          </div>
        )}

        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {car.is_hot_deal && (
            <span style={{ background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, letterSpacing: 1 }}>
              🔥 HOT
            </span>
          )}
          {car.is_featured && (
            <span style={{ background: '#7c3aed', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, letterSpacing: 1 }}>
              ⭐ FEATURED
            </span>
          )}
          {car.is_sold && (
            <span style={{ background: '#1f2937', color: '#6b7280', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, letterSpacing: 1 }}>
              SOLD
            </span>
          )}
        </div>

        {/* Condition */}
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <span style={{ background: `${COND_COLOR[car.condition]}22`, color: COND_COLOR[car.condition], border: `1px solid ${COND_COLOR[car.condition]}66`, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, letterSpacing: 0.5 }}>
            {car.condition}
          </span>
        </div>

        {/* Photo count */}
        {car.images?.length > 1 && (
          <div style={{ position: 'absolute', bottom: 8, right: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Eye size={11} /> {car.images.length} photos
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: 'Syne,sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {car.title}
            </div>
            <div style={{ color: '#666', fontSize: 12, marginTop: 2 }}>{car.year} · {car.color}</div>
          </div>
          <div style={{ color: '#dc2626', fontWeight: 800, fontSize: 18, fontFamily: 'Syne,sans-serif', flexShrink: 0, marginLeft: 8 }}>
            {fmt(car.price)}
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {[fmtKm(car.km_driven), car.fuel, car.transmission, `${car.owners} Owner`].map(t => (
            <span key={t} style={{ background: '#1a1a3e', color: '#9999bb', fontSize: 11, padding: '3px 8px', borderRadius: 6, border: '1px solid #2a2a4e' }}>
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={e => { e.stopPropagation(); onView(car) }}
            className="btn-red"
            style={{ flex: 1, padding: '8px 0', fontSize: 13, borderRadius: 8 }}
          >
            View Details
          </button>
          <a
            href={waLink(`Hi, I'm interested in ${car.title} (${fmt(car.price)}). Please share more details.`)}
            target="_blank" rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ background: '#16a34a22', color: '#16a34a', border: '1px solid #16a34a44', borderRadius: 8, padding: '8px 12px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <MessageCircle size={15} />
          </a>
          <button
            onClick={e => { e.stopPropagation(); onCompare(car) }}
            style={{ background: isComparing ? '#dc2626' : '#1a1a3e', color: isComparing ? '#fff' : '#666', border: `1px solid ${isComparing ? '#dc2626' : '#2a2a4e'}`, borderRadius: 8, padding: '8px 12px', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}
          >
            <Scale size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
