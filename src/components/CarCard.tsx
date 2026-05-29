import { useState } from 'react'
import { Car } from '@/types'
import { fmt, fmtKm } from '@/lib/utils'
import { openWhatsApp, carInquiryMessage } from '@/lib/whatsapp'
import { Scale, MessageCircle, Eye, Fuel, Gauge, Users, Zap, Star } from 'lucide-react'

const COND: Record<string, { bg: string; color: string; border: string }> = {
  Excellent: { bg: '#ECFDF5', color: '#10B981', border: '#6EE7B7' },
  Good:      { bg: '#FFFBEB', color: '#F59E0B', border: '#FCD34D' },
  Fair:      { bg: '#FEF2F2', color: '#EF4444', border: '#FECACA' },
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
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
        borderRadius: 20,
        overflow: 'hidden',
        border: isComparing ? '2.5px solid #0052CC' : '1.5px solid #E3F2FD',
        cursor: 'pointer',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1), border-color 0.25s',
        boxShadow: isComparing
          ? '0 0 0 4px rgba(0,82,204,0.15), 0 8px 24px rgba(0,82,204,0.2)'
          : '0 4px 16px rgba(0,82,204,0.08)',
        position: 'relative',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-6px)'
        el.style.boxShadow = isComparing
          ? '0 0 0 4px rgba(0,82,204,0.2), 0 20px 40px rgba(0,82,204,0.25)'
          : '0 20px 48px rgba(0,82,204,0.18)'
        if (!isComparing) el.style.borderColor = '#B3D1FF'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = isComparing
          ? '0 0 0 4px rgba(0,82,204,0.15), 0 8px 24px rgba(0,82,204,0.2)'
          : '0 4px 16px rgba(0,82,204,0.08)'
        if (!isComparing) el.style.borderColor = '#E3F2FD'
      }}
    >
      {/* Image */}
      <div style={{
        height: 200,
        background: 'linear-gradient(135deg, #EBF2FF, #DBEAFE)',
        position: 'relative', overflow: 'hidden',
      }}>
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
              transform: imgHover ? 'scale(1.08)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
            <span style={{ fontSize: 56 }}>🚗</span>
            <span style={{ color: '#94A3B8', fontSize: 11, fontWeight: 600 }}>No photo</span>
          </div>
        )}

        {/* Bottom gradient */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, background: 'linear-gradient(to top, rgba(0,82,204,0.25), transparent)', pointerEvents: 'none' }} />

        {/* Badges top-left */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 5 }}>
          {car.is_hot_deal && (
            <span style={{
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: '#fff', fontSize: 10, fontWeight: 800,
              padding: '4px 9px', borderRadius: 20,
              display: 'flex', alignItems: 'center', gap: 3,
              boxShadow: '0 3px 8px rgba(245,158,11,0.5)', letterSpacing: 0.3,
            }}>
              <Zap size={9} /> HOT
            </span>
          )}
          {car.is_featured && (
            <span style={{
              background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
              color: '#fff', fontSize: 10, fontWeight: 800,
              padding: '4px 9px', borderRadius: 20,
              display: 'flex', alignItems: 'center', gap: 3,
              boxShadow: '0 3px 8px rgba(124,58,237,0.45)',
            }}>
              <Star size={9} /> TOP
            </span>
          )}
          {car.is_sold && (
            <span style={{
              background: 'linear-gradient(135deg, #1A202C, #374151)',
              backdropFilter: 'blur(4px)', color: '#fff',
              fontSize: 10, fontWeight: 800, padding: '4px 9px', borderRadius: 20,
            }}>
              ✓ SOLD
            </span>
          )}
        </div>

        {/* Condition top-right */}
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <span style={{
            background: cond.bg, color: cond.color,
            border: `1px solid ${cond.border}`,
            fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 20,
          }}>
            {car.condition}
          </span>
        </div>

        {/* Photo count */}
        {(car.images?.length ?? 0) > 1 && (
          <div style={{
            position: 'absolute', bottom: 9, right: 10,
            background: 'rgba(0,82,204,0.7)', backdropFilter: 'blur(4px)',
            color: '#fff', fontSize: 11, padding: '3px 8px',
            borderRadius: 10, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600,
          }}>
            <Eye size={10} /> {car.images.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px 18px' }}>
        {/* Title + Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              color: '#1A202C', fontWeight: 800, fontSize: 15,
              fontFamily: 'Nunito,sans-serif',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              letterSpacing: -0.2,
            }}>
              {car.title}
            </div>
            <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 2, fontWeight: 500 }}>
              {car.year} · {car.color}
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #0052CC, #0066FF)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            fontWeight: 900, fontSize: 17, fontFamily: 'Nunito,sans-serif',
            flexShrink: 0, marginLeft: 12, letterSpacing: -0.5,
          }}>
            {fmt(car.price)}
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 12, marginBottom: 12,
          paddingBottom: 12, borderBottom: '1.5px solid #EBF2FF', flexWrap: 'wrap',
        }}>
          {([
            [<Gauge size={11} />, fmtKm(car.km_driven)],
            [<Fuel size={11} />, car.fuel],
            [<Users size={11} />, `${car.owners} Own.`],
          ] as [React.ReactNode, string][]).map(([icon, label], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748B', fontSize: 12, fontWeight: 600 }}>
              <span style={{ color: '#0052CC', opacity: 0.7 }}>{icon}</span>{label}
            </div>
          ))}
        </div>

        {/* Tags */}
        <div style={{ marginBottom: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ background: '#EBF2FF', color: '#0052CC', fontSize: 11, padding: '4px 10px', borderRadius: 8, border: '1px solid #B3D1FF', fontWeight: 700 }}>
            {car.transmission}
          </span>
          <span style={{ background: '#EBF2FF', color: '#0052CC', fontSize: 11, padding: '4px 10px', borderRadius: 8, border: '1px solid #B3D1FF', fontWeight: 700 }}>
            {car.segment}
          </span>
          {car.price_category && (
            <span style={{ background: '#F5F3FF', color: '#7C3AED', fontSize: 11, padding: '4px 10px', borderRadius: 8, border: '1px solid #DDD6FE', fontWeight: 700 }}>
              {car.price_category}
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={e => { e.stopPropagation(); onView(car) }}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #0052CC, #0066FF)',
              color: '#fff', border: 'none', borderRadius: 10,
              padding: '10px 0', fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, cursor: 'pointer', fontFamily: 'Nunito,sans-serif',
              transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,82,204,0.3)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(0,82,204,0.4)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0,82,204,0.3)'
            }}>
            <Eye size={13} /> View Details
          </button>

          <button
            onClick={handleWhatsApp}
            style={{
              background: '#ECFDF5', color: '#10B981', border: '1.5px solid #6EE7B7',
              borderRadius: 10, padding: '10px 13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              const b = e.currentTarget as HTMLButtonElement
              b.style.background = '#10B981'; b.style.color = '#fff'; b.style.borderColor = '#10B981'
            }}
            onMouseLeave={e => {
              const b = e.currentTarget as HTMLButtonElement
              b.style.background = '#ECFDF5'; b.style.color = '#10B981'; b.style.borderColor = '#6EE7B7'
            }}>
            <MessageCircle size={15} />
          </button>

          <button
            onClick={e => { e.stopPropagation(); onCompare(car) }}
            style={{
              background: isComparing ? 'linear-gradient(135deg, #0052CC, #0066FF)' : '#F0F7FF',
              color: isComparing ? '#fff' : '#94A3B8',
              border: `1.5px solid ${isComparing ? '#0052CC' : '#E3F2FD'}`,
              borderRadius: 10, padding: '10px 13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              if (!isComparing) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#0052CC'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#0052CC'
                ;(e.currentTarget as HTMLButtonElement).style.background = '#EBF2FF'
              }
            }}
            onMouseLeave={e => {
              if (!isComparing) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#E3F2FD'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#94A3B8'
                ;(e.currentTarget as HTMLButtonElement).style.background = '#F0F7FF'
              }
            }}>
            <Scale size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
