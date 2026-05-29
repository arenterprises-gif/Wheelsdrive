import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCars, fetchFeaturedCars, fetchCarStats, fetchBrands } from '@/lib/queries'
import { Car, CarFilters } from '@/types'
import { fmt, waLink } from '@/lib/utils'
import { SkeletonGrid } from '@/components/SkeletonCard'
import { EmptyState } from '@/components/EmptyState'
import Navbar from '@/components/Navbar'
import CarCard from '@/components/CarCard'
import FilterPanel from '@/components/FilterPanel'
import CompareView from '@/components/CompareView'
import PoweredBy from '@/components/PoweredBy'
import { ChevronLeft, ChevronRight, Shield, Star, TrendingUp, Phone, Tag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const SORT_OPTIONS = [
  { value: 'created_at.desc', label: 'Newest First' },
  { value: 'price.asc',       label: 'Price: Low to High' },
  { value: 'price.desc',      label: 'Price: High to Low' },
  { value: 'year.desc',       label: 'Year: Newest' },
  { value: 'km_driven.asc',   label: 'Lowest KM' },
]

const TESTIMONIALS = [
  { name: 'Ramesh Gupta',   city: 'Jhansi',   text: 'Bilkul sahi gaadi mili. No hidden charges. Highly recommended!', rating: 5, car: 'Maruti Swift' },
  { name: 'Priya Sharma',   city: 'Lalitpur', text: 'Very transparent dealing. Got exactly what was shown online.',    rating: 5, car: 'Honda City' },
  { name: 'Ajay Verma',     city: 'Jhansi',   text: 'Best used car dealer in Bundelkhand. Honest and helpful.',        rating: 5, car: 'Hyundai Creta' },
  { name: 'Sunita Yadav',   city: 'Sagar',    text: 'Came from Sagar after seeing the site. Worth every km!',          rating: 4, car: 'Tata Nexon' },
]

export default function Home() {
  const [searchParams] = useSearchParams()
  const nav = useNavigate()
  const [filters, setFilters] = useState<Partial<CarFilters>>({ show_sold: false })
  const [sort, setSort] = useState('created_at.desc')
  const [page, setPage] = useState(1)
  const [compareList, setCompareList] = useState<Car[]>([])
  const [showCompare, setShowCompare] = useState(false)

  useEffect(() => {
    const s = searchParams.get('search')
    if (s) setFilters(f => ({ ...f, search: s }))
  }, [])

  const { data: carsData, isLoading } = useQuery({
    queryKey: ['cars', filters, sort, page],
    queryFn: () => fetchCars(filters, page),
    placeholderData: prev => prev,
  })
  const { data: featured } = useQuery({ queryKey: ['featured'], queryFn: () => fetchFeaturedCars(4) })
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: fetchCarStats })
  const { data: brands } = useQuery({ queryKey: ['brands'], queryFn: fetchBrands })

  const totalPages = Math.ceil((carsData?.total || 0) / 20)
  const handleFilters = useCallback((f: Partial<CarFilters>) => { setFilters(f); setPage(1) }, [])
  const toggleCompare = (car: Car) =>
    setCompareList(l => l.find(x => x.id === car.id) ? l.filter(x => x.id !== car.id) : l.length >= 2 ? [l[1], car] : [...l, car])

  return (
    <div style={{ background: '#EEF4FB', minHeight: '100vh' }}>
      <Navbar compareCount={compareList.length} onCompareClick={() => setShowCompare(true)} />

      {/* ── Hero ─────────────────────────────────────── */}
      <div style={{ paddingTop: 64, background: 'linear-gradient(160deg,#FFFFFF 0%,#F8FAFF 60%,#F0F7FF 100%)', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: 1260, margin: '0 auto', padding: 'clamp(40px,6vw,80px) 24px clamp(36px,5vw,72px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'center' }}>
          <div className="fade-up">
            <div style={{ background: 'linear-gradient(135deg,#EBF2FF,#FFE8DC)', border: '1.5px solid #B3D1FF', display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 24, padding: '7px 16px', fontSize: 11, color: '#0052CC', fontWeight: 800, letterSpacing: 1.2, marginBottom: 24, fontFamily: 'Nunito,sans-serif' }}>
              ✨ JHANSI'S #1 TRUSTED PLATFORM
            </div>
            <h1 style={{ fontFamily: 'Nunito,sans-serif', fontSize: 'clamp(30px,4.5vw,58px)', fontWeight: 900, lineHeight: 1.12, marginBottom: 20, color: '#111827', letterSpacing: -1 }}>
              Buy & Sell<br />
              <span style={{ background: 'linear-gradient(135deg,#0052CC,#0066FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Used Cars
              </span>
              <br />with Confidence
            </h1>
            <p style={{ color: '#6B7280', fontSize: 17, lineHeight: 1.75, marginBottom: 36, maxWidth: 460, fontWeight: 500 }}>
              100% verified cars. Transparent pricing. AI-powered valuations. Trusted across Bundelkhand.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button
                onClick={() => document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: 'linear-gradient(135deg,#0052CC,#0066FF)',
                  color: '#fff', border: 'none', borderRadius: 12,
                  padding: '14px 32px', fontSize: 15, fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0,82,204,0.32)',
                  transition: 'all 0.25s', fontFamily: 'Nunito,sans-serif',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(0,82,204,0.42)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(0,82,204,0.32)';
                }}>
                Browse Cars <ArrowRight size={16} />
              </button>
              <Link to="/sell"
                style={{
                  background: '#fff', border: '2px solid #0052CC', color: '#0052CC',
                  borderRadius: 12, padding: '14px 28px', textDecoration: 'none',
                  fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center',
                  gap: 8, transition: 'all 0.25s', fontFamily: 'Nunito,sans-serif',
                  boxShadow: '0 4px 12px rgba(0,82,204,0.12)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#EBF2FF';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#fff';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                }}>
                <Tag size={16} /> Sell Your Car
              </Link>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="slide-in">
            {[
              { icon: '🚗', label: 'Cars Available', value: stats?.available ?? '…', color: '#0052CC', bg: '#EBF2FF', border: '#B3D1FF' },
              { icon: '⭐', label: 'Avg Rating',     value: '4.9★',                 color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
              { icon: '✅', label: 'Verified Cars',  value: '100%',                  color: '#059669', bg: '#ECFDF5', border: '#BBF7D0' },
              { icon: '💰', label: 'Hidden Charges', value: 'Zero',                  color: '#0369A1', bg: '#EFF6FF', border: '#BFDBFE' },
            ].map(s => (
              <div key={s.label}
                style={{
                  background: s.bg, border: `1.5px solid ${s.border}`,
                  borderRadius: 20, padding: '22px 16px', textAlign: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 20px ${s.color}20`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 26, color: s.color }}>{s.value}</div>
                <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search bar ────────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #F3F4F6', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', background: '#F9FAFB', borderRadius: 12, border: '1.5px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <input
            placeholder="Search by brand, model, color..."
            value={filters.search || ''}
            onChange={e => handleFilters({ ...filters, search: e.target.value })}
            style={{ flex: 1, background: 'none', border: 'none', padding: '13px 18px', fontSize: 15, color: '#111827', outline: 'none', fontFamily: 'Nunito,sans-serif' }}
          />
          <button
            onClick={() => document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'linear-gradient(135deg,#0052CC,#0066FF)',
              border: 'none', padding: '0 28px', cursor: 'pointer',
              color: '#fff', fontWeight: 700, fontSize: 14,
              fontFamily: 'Nunito,sans-serif', transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#003D99'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg,#0052CC,#0066FF)'}>
            Search
          </button>
        </div>
      </div>

      {/* ── Trust strip ───────────────────────────────── */}
      <div style={{ background: '#1A1A2E', padding: '14px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 'clamp(16px,4vw,56px)', flexWrap: 'wrap' }}>
          {[
            [<Shield size={14} />, 'Verified Cars'],
            [<Star size={14} />, 'No Hidden Charges'],
            [<TrendingUp size={14} />, 'Best Market Price'],
            [<Phone size={14} />, 'WhatsApp Support'],
          ].map(([icon, label]) => (
            <div key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              <span style={{ color: '#0052CC' }}>{icon as React.ReactNode}</span>{String(label)}
            </div>
          ))}
        </div>
      </div>

      {/* ── Sell CTA Banner ───────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '40px auto 0', padding: '0 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg,#0052CC,#0066FF)',
          borderRadius: 20, padding: 'clamp(20px,3vw,32px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20,
          boxShadow: '0 8px 32px rgba(0,82,204,0.25)',
        }}>
          <div>
            <div style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 'clamp(16px,2.5vw,22px)', color: '#fff', marginBottom: 6 }}>
              Sell Your Car & Get Instant AI Valuation
            </div>
            <div style={{ color: 'rgba(255,255,255,0.88)', fontSize: 14, fontWeight: 500 }}>
              Know your car's true market value in seconds. Free inspection available.
            </div>
          </div>
          <Link to="/sell"
            style={{
              background: '#fff', color: '#0052CC',
              borderRadius: 12, padding: '13px 26px',
              fontWeight: 800, textDecoration: 'none',
              fontSize: 15, display: 'flex', alignItems: 'center',
              gap: 8, flexShrink: 0, fontFamily: 'Nunito,sans-serif',
              transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; }}>
            Get Free Valuation <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* ── Hot Deals ─────────────────────────────────── */}
      {featured && featured.length > 0 && (
        <div style={{ maxWidth: 1200, margin: '48px auto 0', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 'clamp(18px,2.5vw,26px)', color: '#111827', margin: 0 }}>
              🔥 Hot Deals
            </h2>
            <button
              onClick={() => { handleFilters({ is_hot_deal: true }); document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{ background: '#EBF2FF', border: '1.5px solid #B3D1FF', color: '#0052CC', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 13, fontFamily: 'Nunito,sans-serif', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, transition: 'all 0.18s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0052CC'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EBF2FF'; (e.currentTarget as HTMLButtonElement).style.color = '#0052CC'; }}>
              View All <ArrowRight size={13} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 18 }}>
            {featured.map(car => (
              <CarCard key={car.id} car={car} onView={c => nav(`/car/${c.id}`)} onCompare={toggleCompare} isComparing={!!compareList.find(x => x.id === car.id)} />
            ))}
          </div>
        </div>
      )}

      {/* ── Browse All Cars ───────────────────────────── */}
      <div id="cars" style={{ maxWidth: 1200, margin: '48px auto 0', padding: '0 24px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 'clamp(18px,2.5vw,26px)', color: '#111827', margin: 0 }}>
            Browse All Cars
          </h2>
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1) }}
            style={{ background: '#fff', border: '1.5px solid #E5E7EB', color: '#374151', borderRadius: 8, padding: '8px 14px', outline: 'none', fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito,sans-serif', fontWeight: 600 }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <FilterPanel filters={filters} onChange={handleFilters} brands={brands} total={carsData?.total || 0} />

        {isLoading ? (
          <SkeletonGrid count={8} />
        ) : carsData?.data.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="Koi car nahi mila"
            description="Filter change karo ya search clear karo"
            action={{ label: 'Filters Reset Karo', onClick: () => handleFilters({ show_sold: false }) }}
          />
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 18 }}>
              {carsData?.data.map(car => (
                <CarCard key={car.id} car={car} onView={c => nav(`/car/${c.id}`)} onCompare={toggleCompare} isComparing={!!compareList.find(x => x.id === car.id)} />
              ))}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40 }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ background: '#fff', border: '1.5px solid #E5E7EB', color: page === 1 ? '#D1D5DB' : '#374151', borderRadius: 8, padding: '8px 14px', cursor: page === 1 ? 'default' : 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ background: p === page ? '#0052CC' : '#fff', border: `1.5px solid ${p === page ? '#0052CC' : '#E5E7EB'}`, color: p === page ? '#fff' : '#374151', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontWeight: p === page ? 800 : 500, minWidth: 40, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', fontFamily: 'Nunito,sans-serif', transition: 'all 0.15s' }}>
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{ background: '#fff', border: '1.5px solid #E5E7EB', color: page === totalPages ? '#D1D5DB' : '#374151', borderRadius: 8, padding: '8px 14px', cursor: page === totalPages ? 'default' : 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Testimonials ──────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderTop: '1px solid #F3F4F6', padding: 'clamp(40px,6vw,70px) 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 'clamp(18px,2.5vw,26px)', textAlign: 'center', color: '#111827', marginBottom: 8 }}>What Customers Say</h2>
          <p style={{ color: '#9CA3AF', textAlign: 'center', marginBottom: 36, fontSize: 14, fontWeight: 500 }}>Trusted by thousands across Bundelkhand</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name}
                style={{
                  background: '#F9FAFB', border: '1px solid #F3F4F6',
                  borderRadius: 16, padding: 22,
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}>
                <div style={{ color: '#F59E0B', marginBottom: 12, fontSize: 16, letterSpacing: 1 }}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                <p style={{ color: '#4B5563', fontSize: 14, lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 12 }}>
                  <div style={{ color: '#111827', fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2, fontWeight: 500 }}>{t.city} · Bought {t.car}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <footer style={{ background: '#111827', color: '#fff', padding: 'clamp(36px,5vw,52px) 24px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Nunito,sans-serif', fontSize: 26, fontWeight: 900, marginBottom: 10, letterSpacing: -0.5 }}>
            Wheels<span style={{ color: '#0052CC' }}>Drive</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 22, lineHeight: 1.7 }}>
            Near ITI Chowk, Jhansi, UP · Open Mon–Sun 9AM–7PM
          </p>
          <a
            href={waLink('Hi, I want to inquire about a car.')}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#16A34A', color: '#fff', borderRadius: 12, padding: '13px 28px', fontWeight: 700, textDecoration: 'none', fontSize: 15, marginBottom: 28, transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(22,163,74,0.3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 20px rgba(22,163,74,0.4)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 14px rgba(22,163,74,0.3)'; }}>
            📱 WhatsApp: +91 95063 65650
          </a>
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, paddingBottom: 20 }}>© 2025 WheelsDrive. All rights reserved.</div>
        </div>
        <PoweredBy />
      </footer>

      {/* WhatsApp FAB */}
      <a
        href={waLink('Hi!')}
        target="_blank"
        rel="noreferrer"
        style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#16A34A', color: '#fff',
          borderRadius: '50%', width: 58, height: 58,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(22,163,74,0.45)', zIndex: 400,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'; }}>
        💬
      </a>

      {showCompare && (
        <CompareView
          cars={compareList}
          onRemove={id => setCompareList(l => l.filter(x => x.id !== id))}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  )
}
