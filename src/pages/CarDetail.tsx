import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCarById, fetchSimilarCars } from '@/lib/queries'
import { fmt, fmtKm, fmtFull, waLink } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import CarCard from '@/components/CarCard'
import EMIModal from '@/components/EMIModal'
import PoweredBy from '@/components/PoweredBy'
import { ChevronLeft, ChevronRight, MessageCircle, Calculator } from 'lucide-react'

export default function CarDetail() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const [photo, setPhoto] = useState(0)
  const [showEMI, setShowEMI] = useState(false)
  const [compare, setCompare] = useState<import('@/types').Car[]>([])

  const { data: car, isLoading } = useQuery({
    queryKey: ['car', id],
    queryFn: () => fetchCarById(id!),
    enabled: !!id,
  })

  const { data: similar } = useQuery({
    queryKey: ['similar', id, car?.segment, car?.brand],
    queryFn: () => fetchSimilarCars(car!),
    enabled: !!car,
  })

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (isLoading) return (
    <div style={{ background: '#0a0a18', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  )

  if (!car) return (
    <div style={{ background: '#0a0a18', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🚗</div>
      <div style={{ color: '#888' }}>Car not found</div>
      <button onClick={() => nav('/')} className="btn-red">Go Back</button>
    </div>
  )

  const imgs = car.images?.length ? car.images : []

  const SPECS = [
    ['Brand', car.brand], ['Model Year', car.year], ['KM Driven', fmtKm(car.km_driven)],
    ['Fuel Type', car.fuel], ['Transmission', car.transmission], ['Condition', car.condition],
    ['No. of Owners', `${car.owners}`], ['Segment', car.segment], ['Color', car.color],
    ['Price Category', car.price_category],
  ]

  return (
    <div style={{ background: '#0a0a18', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: 64, maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, color: '#555', fontSize: 13 }}>
          <button onClick={() => nav('/')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={14} /> Home
          </button>
          <span>/</span>
          <span style={{ color: '#fff' }}>{car.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Left: gallery */}
          <div>
            {/* Main photo */}
            <div style={{ borderRadius: 16, overflow: 'hidden', background: 'linear-gradient(135deg,#1a1a3e,#0d0d2e)', height: 300, position: 'relative', border: '1px solid #1e1e3a', marginBottom: 10 }}>
              {imgs.length ? (
                <>
                  <img src={imgs[photo]} alt={car.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {imgs.length > 1 && (
                    <>
                      <button onClick={() => setPhoto(p => (p - 1 + imgs.length) % imgs.length)}
                        style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: 8, padding: '8px 10px', cursor: 'pointer' }}>
                        <ChevronLeft size={16} />
                      </button>
                      <button onClick={() => setPhoto(p => (p + 1) % imgs.length)}
                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: 8, padding: '8px 10px', cursor: 'pointer' }}>
                        <ChevronRight size={16} />
                      </button>
                      <div style={{ position: 'absolute', bottom: 10, right: 14, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 12, padding: '3px 10px', borderRadius: 10 }}>
                        {photo + 1}/{imgs.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 90 }}>🚗</div>
              )}
              {car.is_sold && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ background: '#dc2626', color: '#fff', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, padding: '12px 32px', borderRadius: 12, transform: 'rotate(-8deg)' }}>SOLD</div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {imgs.length > 1 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                {imgs.map((url, i) => (
                  <img key={url} src={url} alt="" onClick={() => setPhoto(i)}
                    style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: i === photo ? '2px solid #dc2626' : '2px solid transparent', flexShrink: 0, transition: 'border-color 0.2s' }} />
                ))}
              </div>
            )}
          </div>

          {/* Right: info */}
          <div>
            <div style={{ color: '#dc2626', fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>
              {car.brand} · {car.segment}
            </div>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(20px,2.5vw,30px)', color: '#fff', marginBottom: 4, lineHeight: 1.2 }}>
              {car.title}
            </h1>
            <div style={{ color: '#555', fontSize: 13, marginBottom: 16 }}>{car.year} · {car.color}</div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(24px,3vw,36px)', color: '#dc2626' }}>
                {fmt(car.price)}
              </div>
              <div style={{ color: '#555', fontSize: 13 }}>{fmtFull(car.price)}</div>
            </div>

            {/* Quick tags */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {[fmtKm(car.km_driven), car.fuel, car.transmission, `${car.owners} Owner`, car.condition].map(t => (
                <span key={t} style={{ background: '#111127', color: '#9999bb', fontSize: 12, padding: '5px 10px', borderRadius: 8, border: '1px solid #1e1e3a' }}>{t}</span>
              ))}
              {car.is_hot_deal && <span style={{ background: '#dc262222', color: '#dc2626', fontSize: 12, padding: '5px 10px', borderRadius: 8, border: '1px solid #dc262255', fontWeight: 700 }}>🔥 Hot Deal</span>}
            </div>

            {/* CTAs */}
            {!car.is_sold ? (
              <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <a href={waLink(`Hi, I'm interested in ${car.title} priced at ${fmt(car.price)}. Please share more details and availability.`)}
                  target="_blank" rel="noreferrer"
                  style={{ flex: 1, minWidth: 140, background: '#16a34a', color: '#fff', borderRadius: 10, padding: '13px 0', textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <MessageCircle size={16} /> Inquire on WhatsApp
                </a>
                <button onClick={() => setShowEMI(true)}
                  className="btn-ghost"
                  style={{ flex: 1, minWidth: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 10, padding: '13px 0' }}>
                  <Calculator size={16} /> EMI Calculator
                </button>
              </div>
            ) : (
              <div style={{ background: '#1f293788', border: '1px solid #374151', borderRadius: 10, padding: 14, marginBottom: 20, textAlign: 'center', color: '#6b7280' }}>
                This car has been sold. <button onClick={() => nav('/')} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', textDecoration: 'underline' }}>Browse available cars →</button>
              </div>
            )}

            {/* Description */}
            {car.description && (
              <div style={{ background: '#111127', borderRadius: 12, padding: 16, border: '1px solid #1e1e3a', marginBottom: 16 }}>
                <div style={{ color: '#444', fontSize: 11, letterSpacing: 1.5, marginBottom: 8 }}>DESCRIPTION</div>
                <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{car.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Specs grid */}
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 16 }}>Specifications</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {SPECS.map(([k, v]) => (
              <div key={String(k)} style={{ background: '#111127', borderRadius: 10, padding: '12px 16px', border: '1px solid #1e1e3a' }}>
                <div style={{ color: '#555', fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>{String(k).toUpperCase()}</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{String(v)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        {car.features?.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 16 }}>Features</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {car.features.map(f => (
                <span key={f} style={{ background: '#111127', color: '#9999bb', fontSize: 13, padding: '6px 14px', borderRadius: 20, border: '1px solid #1e1e3a' }}>
                  ✓ {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Similar cars */}
        {similar && similar.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22, color: '#fff', marginBottom: 20 }}>Similar Cars</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
              {similar.map(c => (
                <CarCard key={c.id} car={c} onView={c2 => nav(`/car/${c2.id}`)} onCompare={c2 => setCompare(l => l.find(x => x.id === c2.id) ? l.filter(x => x.id !== c2.id) : [...l.slice(-1), c2])} isComparing={!!compare.find(x => x.id === c.id)} />
              ))}
            </div>
          </div>
        )}

        <PoweredBy />
      </div>

      {showEMI && <EMIModal car={car} onClose={() => setShowEMI(false)} />}

      <a href={waLink(`Hi, I'm interested in ${car.title}.`)} target="_blank" rel="noreferrer"
        style={{ position: 'fixed', bottom: 24, right: 24, background: '#16a34a', color: '#fff', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, textDecoration: 'none', boxShadow: '0 4px 20px rgba(22,163,74,0.5)', zIndex: 400 }}>
        💬
      </a>
    </div>
  )
}
