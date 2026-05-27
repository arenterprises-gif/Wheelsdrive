import { useState } from 'react'
import { Car } from '@/types'
import { fmt, fmtKm } from '@/lib/utils'
import { openWhatsApp, carInquiryMessage } from '@/lib/whatsapp'
import { Scale, MessageCircle, Eye, Fuel, Gauge, Users, Zap, Star } from 'lucide-react'

const COND: Record<string, { bg: string; color: string; border: string }> = {
  Excellent: { bg: '#ECFDF5', color: '#059669', border: '#BBF7D0' },
  Good:      { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' },
  Fair:      { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
}

interface Props { car: Car; onView: (c: Car) => void; onCompare: (c: Car) => void; isComparing?: boolean }

export default function CarCard({ car, onView, onCompare, isComparing }: Props) {
  const [imgError, setImgError] = useState(false)
  const [imgHover, setImgHover] = useState(false)
  const img = car.images?.[0]
  const cond = COND[car.condition] ?? COND.Good

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation()
    openWhatsApp(carInquiryMessage({ brand: car.brand, model: car.model, year: car.year, price: car.price }))
  }

  return (
    <div
      className="fade-up"
      onClick={() => onView(car)}
      style={{
        background: '#FFFFFF',
        borderRadius: 18,
        overflow: 'hidden',
        border: isComparing ? '2px solid #E8520A' : '1px solid #E5E7EB',
        cursor: 'pointer',
        transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1), box-shadow 0.22s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: isComparing
          ? '0 0 0 3px rgba(232,82,10,0.15), 0 4px 16px rgba(232,82,10,0.12)'
          : '0 2px 8px rgba(0,0,0,0.06)',
        position: 'relative',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-5px)'
        el.style.boxShadow = isComparing
          ? '0 0 0 3px rgba(232,82,10,0.15), 0 12px 32px rgba(232,82,10,0.18)'
          : '0 12px 32px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = isComparing
          ? '0 0 0 3px rgba(232,82,10,0.15), 0 4px 16px rgba(232,82,10,0.12)'
          : '0 2px 8px rgba(0,0,0,0.06)'
      }}
    >
      {/* Image */}
      <div style={{ height: 190, background: 'linear-gradient(135deg,#F3F4F6,#E5E7EB)', position: 'relative', overflow: 'hidden' }}>
        {img && !imgError ? (
          <img
            src={img}
            alt={car.title}
            loading="lazy"
            onError={() => setImgError(true)}
            onMouseEnter={() => setImgHover(true)}
            onMouseLeave={() => setImgHover(false)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
              transform: imgHover ? 'scale(1.07)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 6 }}>
            <span style={{ fontSize: 52 }}>🚗</span>
            <span style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 500 }}>No photo</span>
          </div>
        )}

        {/* Gradient overlay at bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 56, background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)', pointerEvents: 'none' }} />

        {/* Top-left badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 5 }}>
          {car.is_hot_deal && (
            <span style={{ background: '#E8520A', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 9px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 3, boxShadow: '0 2px 6px rgba(232,82,10,0.45)', letterSpacing: 0.3 }}>
              <Zap size={9} /> HOT
            </span>
          )}
          {car.is_featured && (
            <span style={{ background: '#7C3AED', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 9px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 3, boxShadow: '0 2px 6px rgba(124,58,237,0.4)' }}>
              <Star size={9} /> TOP
            </span>
          )}
          {car.is_sold && (
            <span style={{ background: 'rgba(17,24,39,0.85)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 9px', borderRadius: 20 }}>
              SOLD
            </span>
          )}
        </div>

        {/* Top-right condition */}
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <span style={{ background: cond.bg, color: cond.color, border: `1px solid ${cond.border}`, fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 20 }}>
            {car.condition}
          </span>
        </div>

        {/* Photo count */}
        {(car.images?.length ?? 0) > 1 && (
          <div style={{ position: 'absolute', bottom: 9, right: 10, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: 11, padding: '3px 8px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
            <Eye size={10} /> {car.images.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '15px 16px 16px' }}>
        {/* Title + Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#111827', fontWeight: 800, fontSize: 15, fontFamily: 'Nunito,sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: -0.2 }}>
              {car.title}
            </div>
            <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2, fontWeight: 500 }}>{car.year} · {car.color}</div>
          </div>
          <div style={{ color: '#E8520A', fontWeight: 900, fontSize: 17, fontFamily: 'Nunito,sans-serif', flexShrink: 0, marginLeft: 10, letterSpacing: -0.5 }}>
            {fmt(car.price)}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #F3F4F6', flexWrap: 'wrap' }}>
          {([
            [<Gauge size={11} />, fmtKm(car.km_driven)],
            [<Fuel size={11} />, car.fuel],
            [<Users size={11} />, `${car.owners} Own.`],
          ] as [React.ReactNode, string][]).map(([icon, label], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6B7280', fontSize: 12, fontWeight: 500 }}>
              <span style={{ color: '#9CA3AF' }}>{icon}</span>{label}
            </div>
          ))}
        </div>

        {/* Tags */}
        <div style={{ marginBottom: 13, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ background: '#F9FAFB', color: '#6B7280', fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid #E5E7EB', fontWeight: 600 }}>
            {car.transmission}
          </span>
          <span style={{ background: '#F9FAFB', color: '#6B7280', fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid #E5E7EB', fontWeight: 600 }}>
            {car.segment}
          </span>
          {car.price_category && (
            <span style={{ background: '#F5F3FF', color: '#7C3AED', fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid #DDD6FE', fontWeight: 600 }}>
              {car.price_category}
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 7 }}>
          <button
            onClick={e => { e.stopPropagation(); onView(car) }}
            style={{
              flex: 1, background: 'linear-gradient(135deg,#E8520A,#FF6B2B)',
              color: '#fff', border: 'none', borderRadius: 9,
              padding: '9px 0', fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, cursor: 'pointer', fontFamily: 'Nunito,sans-serif',
              transition: 'all 0.2s', boxShadow: '0 3px 10px rgba(232,82,10,0.28)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(232,82,10,0.38)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 3px 10px rgba(232,82,10,0.28)'; }}>
            <Eye size={13} /> View Details
          </button>

          <button
            onClick={handleWhatsApp}
            style={{ background: '#F0FDF4', color: '#16A34A', border: '1.5px solid #BBF7D0', borderRadius: 9, padding: '9px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = '#16A34A'; b.style.color = '#fff'; b.style.borderColor = '#16A34A'; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = '#F0FDF4'; b.style.color = '#16A34A'; b.style.borderColor = '#BBF7D0'; }}>
            <MessageCircle size={15} />
          </button>

          <button
            onClick={e => { e.stopPropagation(); onCompare(car) }}
            style={{
              background: isComparing ? '#E8520A' : '#F9FAFB',
              color: isComparing ? '#fff' : '#9CA3AF',
              border: `1.5px solid ${isComparing ? '#E8520A' : '#E5E7EB'}`,
              borderRadius: 9, padding: '9px 12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (!isComparing) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E8520A'; (e.currentTarget as HTMLButtonElement).style.color = '#E8520A'; } }}
            onMouseLeave={e => { if (!isComparing) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLButtonElement).style.color = '#9CA3AF'; } }}>
            <Scale size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
