import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCars, deleteCar, updateCar } from '@/lib/queries'
import { fmt, fmtKm } from '@/lib/utils'
import { Plus, Search, Pencil, Trash2, Flame, Star, CheckCircle, Upload, X } from 'lucide-react'
import { CSVImport } from '@/components/CSVImport'

export default function AdminCars() {
  const [showImport, setShowImport] = useState(false)
  const nav = useNavigate()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showSold, setShowSold] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ['admin-cars', search, page, showSold],
    queryFn: () => fetchCars({ search: search || undefined, show_sold: showSold }, page),
    staleTime: 3 * 60 * 1000,
    placeholderData: prev => prev,
  })

  const del = useMutation({
    mutationFn: deleteCar,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-cars'] }),
  })

  const toggle = useMutation({
    mutationFn: ({ id, field, val }: { id: string; field: string; val: boolean }) =>
      updateCar(id, { [field]: val } as never),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-cars'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
    },
  })

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} cars? This cannot be undone.`)) return
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 26, color: '#111827', marginBottom: 4 }}>Cars</h1>
          <p style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 500 }}>
            <span style={{ fontWeight: 700, color: '#E8520A' }}>{total}</span> cars in inventory
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowImport(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              border: '1.5px solid #E8520A', color: '#E8520A',
              background: '#FFF5F0', borderRadius: 10, padding: '10px 18px',
              cursor: 'pointer', fontSize: 13, fontWeight: 700,
              fontFamily: 'Nunito,sans-serif', transition: 'all 0.18s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#E8520A';
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#FFF5F0';
              (e.currentTarget as HTMLButtonElement).style.color = '#E8520A';
            }}>
            <Upload size={15} /> Bulk Import (CSV)
          </button>
          <button onClick={() => nav('/admin/cars/add')}
            style={{
              background: 'linear-gradient(135deg,#E8520A,#FF6B2B)',
              color: '#fff', border: 'none', borderRadius: 10,
              padding: '11px 20px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700,
              fontFamily: 'Nunito,sans-serif',
              boxShadow: '0 4px 12px rgba(232,82,10,0.3)',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 18px rgba(232,82,10,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(232,82,10,0.3)';
            }}>
            <Plus size={16} /> Add New Car
          </button>
        </div>
      </div>

      {/* CSV Import Modal */}
      {showImport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setShowImport(false)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 640, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 20, color: '#111827' }}>Bulk Car Import</h2>
              <button onClick={() => setShowImport(false)}
                style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>
            <CSVImport onComplete={() => { setShowImport(false); qc.invalidateQueries({ queryKey: ['admin-cars'] }) }} />
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{
          flex: 1, minWidth: 220, display: 'flex',
          background: '#FFFFFF', borderRadius: 10,
          border: '1.5px solid #E5E7EB', overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'border-color 0.18s',
        }}>
          <div style={{ padding: '10px 12px', color: '#9CA3AF', display: 'flex', alignItems: 'center' }}>
            <Search size={15} />
          </div>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by brand, model, title..."
            style={{
              flex: 1, background: 'none', border: 'none',
              padding: '10px 12px 10px 0', fontSize: 14, color: '#111827',
              outline: 'none', fontFamily: 'Nunito,sans-serif',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', padding: '10px 12px', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center' }}>
              <X size={14} />
            </button>
          )}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6B7280', fontSize: 13, cursor: 'pointer', fontWeight: 600, background: '#FFFFFF', border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '10px 14px' }}>
          <input type="checkbox" checked={showSold} onChange={e => setShowSold(e.target.checked)} style={{ accentColor: '#E8520A', cursor: 'pointer' }} />
          Show Sold
        </label>

        {selected.length > 0 && (
          <button onClick={bulkDelete}
            style={{
              background: '#FEF2F2', border: '1.5px solid #FECACA',
              color: '#DC2626', borderRadius: 10, padding: '10px 14px',
              cursor: 'pointer', fontSize: 13, display: 'flex',
              alignItems: 'center', gap: 6, fontWeight: 700,
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#DC2626';
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2';
              (e.currentTarget as HTMLButtonElement).style.color = '#DC2626';
            }}>
            <Trash2 size={14} /> Delete ({selected.length})
          </button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div className="spinner" />
          <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 12 }}>Loading cars...</div>
        </div>
      ) : cars.length === 0 ? (
        <div style={{
          background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16,
          textAlign: 'center', padding: '60px 24px', color: '#9CA3AF',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🚗</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#374151', marginBottom: 6 }}>No cars found</div>
          <div style={{ fontSize: 13 }}>
            {search ? `No results for "${search}"` : 'Start by adding your first car'}
          </div>
          {!search && (
            <button onClick={() => nav('/admin/cars/add')}
              style={{ marginTop: 16, background: '#E8520A', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'Nunito,sans-serif' }}>
              + Add First Car
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '44px 1fr 110px 110px 80px 150px',
              gap: 12, padding: '12px 18px',
              borderBottom: '1px solid #F3F4F6',
              background: '#F9FAFB',
              color: '#9CA3AF', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
            }}>
              <div>
                <input type="checkbox"
                  style={{ accentColor: '#E8520A', cursor: 'pointer' }}
                  checked={selected.length === cars.length && cars.length > 0}
                  onChange={e => setSelected(e.target.checked ? cars.map(c => c.id) : [])} />
              </div>
              <div>Car</div>
              <div>Price</div>
              <div>Status</div>
              <div>Year</div>
              <div>Actions</div>
            </div>

            {cars.map((car, i) => (
              <div key={car.id}
                style={{
                  display: 'grid', gridTemplateColumns: '44px 1fr 110px 110px 80px 150px',
                  gap: 12, padding: '14px 18px',
                  borderTop: i > 0 ? '1px solid #F9FAFB' : 'none',
                  alignItems: 'center', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#FAFAFA'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}>

                <div>
                  <input type="checkbox"
                    style={{ accentColor: '#E8520A', cursor: 'pointer' }}
                    checked={selected.includes(car.id)}
                    onChange={e => setSelected(s => e.target.checked ? [...s, car.id] : s.filter(x => x !== car.id))} />
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
                  <div style={{ width: 58, height: 42, borderRadius: 8, overflow: 'hidden', background: '#F3F4F6', flexShrink: 0, border: '1px solid #F3F4F6' }}>
                    {car.images?.[0]
                      ? <img src={car.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={car.title} />
                      : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 22 }}>🚗</div>}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: '#111827', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{car.title}</div>
                    <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>{car.fuel} · {fmtKm(car.km_driven)} · {car.condition}</div>
                  </div>
                </div>

                <div style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 14, color: '#E8520A' }}>{fmt(car.price)}</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {car.is_sold
                    ? <span style={{ background: '#F3F4F6', color: '#9CA3AF', fontSize: 10, padding: '3px 8px', borderRadius: 6, textAlign: 'center', fontWeight: 700 }}>SOLD</span>
                    : <span style={{ background: '#ECFDF5', color: '#059669', fontSize: 10, padding: '3px 8px', borderRadius: 6, border: '1px solid #BBF7D0', textAlign: 'center', fontWeight: 700 }}>AVAILABLE</span>}
                  {car.is_hot_deal && <span style={{ background: '#FFF5F0', color: '#E8520A', fontSize: 10, padding: '2px 6px', borderRadius: 6, textAlign: 'center', fontWeight: 700 }}>🔥 HOT</span>}
                  {car.is_featured && <span style={{ background: '#F5F3FF', color: '#7C3AED', fontSize: 10, padding: '2px 6px', borderRadius: 6, textAlign: 'center', fontWeight: 700 }}>⭐ FTD</span>}
                </div>

                <div style={{ color: '#374151', fontSize: 14, fontWeight: 600 }}>{car.year}</div>

                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  <button onClick={() => nav(`/admin/cars/edit/${car.id}`)}
                    style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#374151', borderRadius: 7, padding: '5px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600, transition: 'all 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EFF6FF'; (e.currentTarget as HTMLButtonElement).style.color = '#1D4ED8'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#BFDBFE'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F3F4F6'; (e.currentTarget as HTMLButtonElement).style.color = '#374151'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB'; }}>
                    <Pencil size={11} /> Edit
                  </button>
                  <button onClick={() => toggle.mutate({ id: car.id, field: 'is_sold', val: !car.is_sold })}
                    style={{ background: car.is_sold ? '#ECFDF5' : '#F3F4F6', border: `1px solid ${car.is_sold ? '#BBF7D0' : '#E5E7EB'}`, color: car.is_sold ? '#059669' : '#374151', borderRadius: 7, padding: '5px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600, transition: 'all 0.15s' }}>
                    <CheckCircle size={11} /> {car.is_sold ? 'Unsell' : 'Sell'}
                  </button>
                  <button onClick={() => toggle.mutate({ id: car.id, field: 'is_hot_deal', val: !car.is_hot_deal })}
                    style={{ background: car.is_hot_deal ? '#FFF5F0' : '#F3F4F6', border: `1px solid ${car.is_hot_deal ? '#FDDCCE' : '#E5E7EB'}`, color: car.is_hot_deal ? '#E8520A' : '#374151', borderRadius: 7, padding: '5px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600, transition: 'all 0.15s' }}>
                    <Flame size={11} />
                  </button>
                  <button onClick={() => toggle.mutate({ id: car.id, field: 'is_featured', val: !car.is_featured })}
                    style={{ background: car.is_featured ? '#F5F3FF' : '#F3F4F6', border: `1px solid ${car.is_featured ? '#DDD6FE' : '#E5E7EB'}`, color: car.is_featured ? '#7C3AED' : '#374151', borderRadius: 7, padding: '5px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600, transition: 'all 0.15s' }}>
                    <Star size={11} />
                  </button>
                  <button onClick={() => confirmDel(car.id)}
                    style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: 7, padding: '5px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600, transition: 'all 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#DC2626'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'; (e.currentTarget as HTMLButtonElement).style.color = '#DC2626'; }}>
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{
                    background: p === page ? '#E8520A' : '#FFFFFF',
                    border: `1.5px solid ${p === page ? '#E8520A' : '#E5E7EB'}`,
                    color: p === page ? '#fff' : '#374151',
                    borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
                    fontWeight: p === page ? 800 : 500, minWidth: 38,
                    fontFamily: 'Nunito,sans-serif', fontSize: 14,
                    transition: 'all 0.15s',
                  }}>
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
