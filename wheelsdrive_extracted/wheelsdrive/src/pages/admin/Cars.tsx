import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCars, deleteCar, updateCar } from '@/lib/queries'
import { fmt, fmtKm } from '@/lib/utils'
import { Plus, Search, Pencil, Trash2, Flame, Star, CheckCircle } from 'lucide-react'

export default function AdminCars() {
  const nav = useNavigate()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showSold, setShowSold] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ['admin-cars', search, page, showSold],
    queryFn: () => fetchCars({ search: search || undefined, show_sold: showSold }, page),
  })

  const del = useMutation({
    mutationFn: deleteCar,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-cars'] }),
  })

  const toggle = useMutation({
    mutationFn: ({ id, field, val }: { id: string; field: string; val: boolean }) =>
      updateCar(id, { [field]: val } as never),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-cars'] }); qc.invalidateQueries({ queryKey: ['stats'] }) },
  })

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} cars?`)) return
    await Promise.all(selected.map(id => deleteCar(id)))
    setSelected([])
    qc.invalidateQueries({ queryKey: ['admin-cars'] })
  }

  const confirmDel = (id: string) => {
    if (confirm('Delete this car? This cannot be undone.')) del.mutate(id)
  }

  const cars = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / 20)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, color: '#fff', marginBottom: 4 }}>Cars</h1>
          <p style={{ color: '#555', fontSize: 13 }}>{total} cars in inventory</p>
        </div>
        <button onClick={() => nav('/admin/cars/add')} className="btn-red" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Add New Car
        </button>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, display: 'flex', background: '#111127', borderRadius: 10, border: '1px solid #1e1e3a', overflow: 'hidden' }}>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search cars..." style={{ flex: 1, background: 'none', border: 'none', padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none' }} />
          <div style={{ padding: '10px 14px', color: '#444' }}><Search size={16} /></div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888', fontSize: 13, cursor: 'pointer' }}>
          <input type="checkbox" checked={showSold} onChange={e => setShowSold(e.target.checked)} style={{ accentColor: '#dc2626' }} />
          Show Sold
        </label>

        {selected.length > 0 && (
          <button onClick={bulkDelete} style={{ background: '#7f1d1d22', border: '1px solid #7f1d1d', color: '#dc2626', borderRadius: 8, padding: '9px 14px', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Trash2 size={14} /> Delete Selected ({selected.length})
          </button>
        )}
      </div>

      {isLoading ? (
        <div style={{ padding: 60, textAlign: 'center' }}><div className="spinner" /></div>
      ) : cars.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#444' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚗</div>
          <div>No cars found.</div>
        </div>
      ) : (
        <>
          <div className="card" style={{ overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 100px 80px 130px', gap: 12, padding: '12px 16px', borderBottom: '1px solid #1e1e3a', color: '#444', fontSize: 11, letterSpacing: 1 }}>
              <div>
                <input type="checkbox" style={{ accentColor: '#dc2626' }}
                  checked={selected.length === cars.length && cars.length > 0}
                  onChange={e => setSelected(e.target.checked ? cars.map(c => c.id) : [])} />
              </div>
              <div>CAR</div>
              <div>PRICE</div>
              <div>STATUS</div>
              <div>YEAR</div>
              <div>ACTIONS</div>
            </div>

            {cars.map((car, i) => (
              <div key={car.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 100px 80px 130px', gap: 12, padding: '14px 16px', borderTop: i > 0 ? '1px solid #1e1e3a' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#161630'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}>
                <div>
                  <input type="checkbox" style={{ accentColor: '#dc2626' }} checked={selected.includes(car.id)} onChange={e => setSelected(s => e.target.checked ? [...s, car.id] : s.filter(x => x !== car.id))} />
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
                  <div style={{ width: 56, height: 40, borderRadius: 8, overflow: 'hidden', background: '#1a1a3e', flexShrink: 0 }}>
                    {car.images?.[0] ? <img src={car.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 22 }}>🚗</div>}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{car.title}</div>
                    <div style={{ color: '#555', fontSize: 12 }}>{car.year} · {car.fuel} · {fmtKm(car.km_driven)}</div>
                  </div>
                </div>
                <div style={{ color: '#dc2626', fontWeight: 700, fontFamily: 'Syne,sans-serif' }}>{fmt(car.price)}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {car.is_sold ? <span style={{ background: '#1f2937', color: '#6b7280', fontSize: 11, padding: '3px 8px', borderRadius: 8, textAlign: 'center' }}>SOLD</span>
                    : <span style={{ background: '#16a34a22', color: '#16a34a', fontSize: 11, padding: '3px 8px', borderRadius: 8, border: '1px solid #16a34a44', textAlign: 'center' }}>AVAILABLE</span>}
                  {car.is_hot_deal && <span style={{ background: '#dc262222', color: '#dc2626', fontSize: 11, padding: '2px 6px', borderRadius: 8, textAlign: 'center' }}>HOT</span>}
                  {car.is_featured && <span style={{ background: '#7c3aed22', color: '#7c3aed', fontSize: 11, padding: '2px 6px', borderRadius: 8, textAlign: 'center' }}>FEATURED</span>}
                </div>
                <div style={{ color: '#888', fontSize: 14 }}>{car.year}</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  <button onClick={() => nav(`/admin/cars/edit/${car.id}`)}
                    style={{ background: '#1a1a3e', border: '1px solid #1e1e3a', color: '#aaa', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                    <Pencil size={11} /> Edit
                  </button>
                  <button onClick={() => toggle.mutate({ id: car.id, field: 'is_sold', val: !car.is_sold })}
                    style={{ background: car.is_sold ? '#16a34a22' : '#1a1a3e', border: `1px solid ${car.is_sold ? '#16a34a44' : '#1e1e3a'}`, color: car.is_sold ? '#16a34a' : '#aaa', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                    <CheckCircle size={11} /> {car.is_sold ? 'Unsell' : 'Sell'}
                  </button>
                  <button onClick={() => toggle.mutate({ id: car.id, field: 'is_hot_deal', val: !car.is_hot_deal })}
                    style={{ background: car.is_hot_deal ? '#dc262222' : '#1a1a3e', border: `1px solid ${car.is_hot_deal ? '#dc262244' : '#1e1e3a'}`, color: car.is_hot_deal ? '#dc2626' : '#aaa', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                    <Flame size={11} />
                  </button>
                  <button onClick={() => toggle.mutate({ id: car.id, field: 'is_featured', val: !car.is_featured })}
                    style={{ background: car.is_featured ? '#7c3aed22' : '#1a1a3e', border: `1px solid ${car.is_featured ? '#7c3aed44' : '#1e1e3a'}`, color: car.is_featured ? '#7c3aed' : '#aaa', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                    <Star size={11} />
                  </button>
                  <button onClick={() => confirmDel(car.id)}
                    style={{ background: '#7f1d1d22', border: '1px solid #7f1d1d44', color: '#dc2626', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ background: p === page ? '#dc2626' : '#111127', border: `1px solid ${p === page ? '#dc2626' : '#1e1e3a'}`, color: '#fff', borderRadius: 8, padding: '7px 13px', cursor: 'pointer', fontWeight: p === page ? 700 : 400, minWidth: 38 }}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
