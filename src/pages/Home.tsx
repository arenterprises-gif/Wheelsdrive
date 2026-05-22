import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCars, fetchFeaturedCars, fetchCarStats, fetchBrands } from '@/lib/queries'
import { Car, CarFilters } from '@/types'
import { fmt, fmtKm, waLink } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import CarCard from '@/components/CarCard'
import FilterPanel from '@/components/FilterPanel'
import CompareView from '@/components/CompareView'
import PoweredBy from '@/components/PoweredBy'
import { ChevronLeft, ChevronRight, Phone, Shield, Star, TrendingUp } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'created_at.desc', label: 'Newest First' },
  { value: 'price.asc', label: 'Price: Low to High' },
  { value: 'price.desc', label: 'Price: High to Low' },
  { value: 'year.desc', label: 'Year: Newest' },
  { value: 'km_driven.asc', label: 'Lowest KM' },
]

const TESTIMONIALS = [
  { name: 'Ramesh Gupta', city: 'Jhansi', text: 'Bilkul sahi gaadi mili. No hidden charges. Highly recommended!', rating: 5, car: 'Maruti Swift' },
  { name: 'Priya Sharma', city: 'Lalitpur', text: 'Very transparent dealing. Got exactly what was shown online.', rating: 5, car: 'Honda City' },
  { name: 'Ajay Verma', city: 'Jhansi', text: 'Best used car dealer in Bundelkhand region. Honest and helpful staff.', rating: 5, car: 'Hyundai Creta' },
  { name: 'Sunita Yadav', city: 'Sagar', text: 'Came from Sagar after seeing the site. Absolutely worth the trip!', rating: 4, car: 'Tata Nexon' },
]

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const nav = useNavigate()
  const [filters, setFilters] = useState<Partial<CarFilters>>({ show_sold: false })
  const [sort, setSort] = useState('created_at.desc')
  const [page, setPage] = useState(1)
  const [compareList, setCompareList] = useState<Car[]>([])
  const [showCompare, setShowCompare] = useState(false)

  // Pick up search param from URL
  useEffect(() => {
    const s = searchParams.get('search')
    if (s) setFilters(f => ({ ...f, search: s }))
  }, [])

  const { data: carsData, isLoading } = useQuery({
    queryKey: ['cars', filters, sort, page],
    queryFn: () => fetchCars(filters, page),
    placeholderData: prev => prev,
  })

  const { data: featured } = useQuery({
    queryKey: ['featured'],
    queryFn: () => fetchFeaturedCars(6),
  })

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchCarStats,
  })

  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  })

  const totalPages = Math.ceil((carsData?.total || 0) / 20)

  const handleFiltersChange = useCallback((f: Partial<CarFilters>) => {
    setFilters(f)
    setPage(1)
  }, [])

  const toggleCompare = (car: Car) => {
    setCompareList(l =>
      l.find(x => x.id === car.id)
        ? l.filter(x => x.id !== car.id)
        : l.length >= 2 ? [l[1], car] : [...l, car]
    )
  }

  return (
    <div style={{ background: '#0a0a18', minHeight: '100vh' }}>
      <Navbar compareCount={compareList.length} onCompareClick={() => setShowCompare(true)} />

      {/* Hero */}
      <div style={{ paddingTop: 64, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, background: 'radial-gradient(circle,#dc262614,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 56px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#dc262218', border: '1px solid #dc262244', borderRadius: 20, padding: '5px 16px', fontSize: 12, color: '#dc2626', fontWeight: 700, letterSpacing: 2, marginBottom: 24 }}>
            JHANSI'S #1 TRUSTED USED CAR PLATFORM
          </div>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(30px,5.5vw,60px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 16, color: '#fff' }}>
            Find Your Perfect<br />
            <span style={{ color: '#dc2626' }}>Pre-Owned Car</span>
          </h1>
          <p style={{ color: '#9999bb', fontSize: 17, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.6 }}>
            100% verified cars. Transparent pricing.<br />No hidden charges. Trusted across Bundelkhand.
          </p>

          {/* Hero search */}
          <div style={{ display: 'flex', maxWidth: 560, margin: '0 auto 48px', background: '#111127', borderRadius: 14, border: '1px solid #1e1e3a', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <input
              placeholder="Search by brand, model, color..."
              value={filters.search || ''}
              onChange={e => handleFiltersChange({ ...filters, search: e.target.value })}
              style={{ flex: 1, background: 'none', border: 'none', color: '#fff', outline: 'none', padding: '14px 18px', fontSize: 15 }}
            />
            <button
              onClick={() => document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: '#dc2626', border: 'none', padding: '0 24px', cursor: 'pointer', color: '#fff', fontWeight: 600, fontSize: 14 }}
            >
              Search
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px,4vw,60px)', flexWrap: 'wrap' }}>
            {[
              [stats?.available ?? '…', 'Cars Available'],
              ['4.9★', 'Avg Rating'],
              ['5+ Yrs', 'In Business'],
              ['Zero', 'Hidden Charges'],
            ].map(([n, l]) => (
              <div key={String(l)} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, color: '#dc2626' }}>{n}</div>
                <div style={{ color: '#555', fontSize: 13 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div style={{ background: '#111127', borderTop: '1px solid #1e1e3a', borderBottom: '1px solid #1e1e3a', padding: '18px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 'clamp(16px,4vw,56px)', flexWrap: 'wrap' }}>
          {[
            [<Shield size={16} />, 'Verified Cars'],
            [<Star size={16} />, 'No Hidden Charges'],
            [<TrendingUp size={16} />, 'Best Market Price'],
            [<Phone size={16} />, 'WhatsApp Support'],
          ].map(([icon, label]) => (
            <div key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9999bb', fontSize: 13 }}>
              <span style={{ color: '#dc2626' }}>{icon as React.ReactNode}</span> {String(label)}
            </div>
          ))}
        </div>
      </div>

      {/* Hot Deals */}
      {featured && featured.length > 0 && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 24px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(18px,2.5vw,26px)', color: '#fff', margin: 0 }}>
              🔥 Hot Deals
            </h2>
            <button onClick={() => { handleFiltersChange({ is_hot_deal: true }); document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{ background: 'none', border: '1px solid #1e1e3a', color: '#666', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 13 }}>
              View All →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {featured.map(car => (
              <CarCard key={car.id} car={car} onView={c => nav(`/car/${c.id}`)} onCompare={toggleCompare} isComparing={!!compareList.find(x => x.id === car.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Browse all */}
      <div id="cars" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 24px 60px' }}>
        <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(18px,2.5vw,26px)', color: '#fff', marginBottom: 20 }}>
          Browse All Cars
        </h2>

        <FilterPanel
          filters={filters}
          onChange={handleFiltersChange}
          brands={brands}
          total={carsData?.total || 0}
        />

        {/* Sort bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}
            style={{ background: '#111127', border: '1px solid #1e1e3a', color: '#fff', borderRadius: 8, padding: '8px 14px', outline: 'none', fontSize: 13, cursor: 'pointer' }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {isLoading ? (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <div className="spinner" />
            <div style={{ color: '#555', marginTop: 16, fontSize: 14 }}>Loading cars...</div>
          </div>
        ) : carsData?.data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#555' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, color: '#888', marginBottom: 12 }}>No cars found</div>
            <button onClick={() => handleFiltersChange({ show_sold: false })} className="btn-red" style={{ display: 'inline-block' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 18 }}>
              {carsData?.data.map(car => (
                <CarCard key={car.id} car={car} onView={c => nav(`/car/${c.id}`)} onCompare={toggleCompare} isComparing={!!compareList.find(x => x.id === car.id)} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ background: '#111127', border: '1px solid #1e1e3a', color: page === 1 ? '#333' : '#fff', borderRadius: 8, padding: '8px 14px', cursor: page === 1 ? 'default' : 'pointer' }}>
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = i + 1
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ background: p === page ? '#dc2626' : '#111127', border: `1px solid ${p === page ? '#dc2626' : '#1e1e3a'}`, color: '#fff', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontWeight: p === page ? 700 : 400, minWidth: 40 }}>
                      {p}
                    </button>
                  )
                })}

                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ background: '#111127', border: '1px solid #1e1e3a', color: page === totalPages ? '#333' : '#fff', borderRadius: 8, padding: '8px 14px', cursor: page === totalPages ? 'default' : 'pointer' }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Testimonials */}
      <div style={{ background: '#111127', borderTop: '1px solid #1e1e3a', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(18px,2.5vw,26px)', textAlign: 'center', marginBottom: 8, color: '#fff' }}>
            What Our Customers Say
          </h2>
          <p style={{ color: '#555', textAlign: 'center', marginBottom: 36, fontSize: 14 }}>
            Trusted by thousands across Bundelkhand
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: '#0a0a18', border: '1px solid #1e1e3a', borderRadius: 16, padding: 20 }}>
                <div style={{ color: '#fbbf24', marginBottom: 10, fontSize: 16 }}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.65, marginBottom: 14 }}>"{t.text}"</p>
                <div style={{ borderTop: '1px solid #1e1e3a', paddingTop: 12 }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                  <div style={{ color: '#555', fontSize: 12 }}>{t.city} · Bought {t.car}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#0a0a18', borderTop: '1px solid #111127', padding: '44px 24px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
            Wheels<span style={{ color: '#dc2626' }}>Drive</span>
          </div>
          <p style={{ color: '#444', fontSize: 13, marginBottom: 20 }}>
            Near ITI Chowk, Jhansi, Uttar Pradesh<br />Open Mon–Sun · 9 AM to 7 PM
          </p>
          <a href={waLink('Hi, I want to inquire about a car.')} target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', background: '#16a34a', color: '#fff', borderRadius: 12, padding: '12px 28px', fontWeight: 700, textDecoration: 'none', fontSize: 15, marginBottom: 24 }}>
            📱 WhatsApp: +91 95063 65650
          </a>
          <div style={{ color: '#222', fontSize: 12, marginBottom: 0 }}>© 2025 WheelsDrive. All rights reserved.</div>
        </div>
        <PoweredBy />
      </footer>

      {/* Sticky WhatsApp */}
      <a href={waLink('Hi, I want to know about a car.')} target="_blank" rel="noreferrer"
        style={{ position: 'fixed', bottom: 24, right: 24, background: '#16a34a', color: '#fff', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, textDecoration: 'none', boxShadow: '0 4px 20px rgba(22,163,74,0.5)', zIndex: 400 }}>
        💬
      </a>

      {/* Compare overlay */}
      {showCompare && (
        <CompareView cars={compareList} onRemove={id => setCompareList(l => l.filter(x => x.id !== id))} onClose={() => setShowCompare(false)} />
      )}
    </div>
  )
}
