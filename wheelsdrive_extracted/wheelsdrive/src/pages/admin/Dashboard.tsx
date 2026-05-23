import { useQuery } from '@tanstack/react-query'
import { fetchCarStats, fetchInquiries, fetchCars } from '@/lib/queries'
import { fmt } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { Car, TrendingUp, MessageSquare, Tag, Plus, Eye } from 'lucide-react'

export default function AdminDashboard() {
  const nav = useNavigate()

  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: fetchCarStats })
  const { data: inquiries } = useQuery({ queryKey: ['inquiries'], queryFn: fetchInquiries })
  const { data: recentData } = useQuery({ queryKey: ['recent-cars'], queryFn: () => fetchCars({}, 1) })

  const unread = inquiries?.filter(i => !i.is_read).length || 0
  const recent = recentData?.data.slice(0, 5) || []

  const StatCard = ({ icon, label, value, sub, color = '#dc2626' }: { icon: React.ReactNode, label: string, value: string | number, sub?: string, color?: string }) => (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: '#555', fontSize: 12, letterSpacing: 1, marginBottom: 8 }}>{label}</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 30, color: '#fff' }}>{value}</div>
          {sub && <div style={{ color: '#444', fontSize: 12, marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{ background: `${color}18`, border: `1px solid ${color}33`, borderRadius: 10, padding: 10, color }}>
          {icon}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, color: '#fff', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: '#555', fontSize: 13 }}>Welcome back, Admin</p>
        </div>
        <button onClick={() => nav('/admin/cars/add')} className="btn-red" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Add Car
        </button>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon={<Car size={20} />} label="TOTAL CARS" value={stats?.total || 0} sub="In inventory" />
        <StatCard icon={<TrendingUp size={20} />} label="AVAILABLE" value={stats?.available || 0} sub="Ready to sell" color="#16a34a" />
        <StatCard icon={<Tag size={20} />} label="SOLD" value={stats?.sold || 0} sub="All time" color="#6b7280" />
        <StatCard icon={<MessageSquare size={20} />} label="INQUIRIES" value={unread} sub={`${inquiries?.length || 0} total`} color="#7c3aed" />
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Add New Car', icon: '🚗', action: () => nav('/admin/cars/add'), color: '#dc2626' },
          { label: 'View Inquiries', icon: '💬', action: () => nav('/admin/inquiries'), color: '#7c3aed' },
          { label: 'Manage Cars', icon: '📋', action: () => nav('/admin/cars'), color: '#16a34a' },
          { label: 'Settings', icon: '⚙️', action: () => nav('/admin/settings'), color: '#d97706' },
        ].map(q => (
          <button key={q.label} onClick={q.action}
            style={{ background: '#111127', border: `1px solid ${q.color}33`, borderRadius: 14, padding: '18px 16px', cursor: 'pointer', textAlign: 'center', transition: 'border-color 0.2s, background 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${q.color}11`; (e.currentTarget as HTMLButtonElement).style.borderColor = q.color }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#111127'; (e.currentTarget as HTMLButtonElement).style.borderColor = `${q.color}33` }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{q.icon}</div>
            <div style={{ color: '#ccc', fontSize: 13, fontWeight: 600 }}>{q.label}</div>
          </button>
        ))}
      </div>

      {/* Recent cars */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, color: '#fff' }}>Recently Added Cars</h2>
          <button onClick={() => nav('/admin/cars')} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 13 }}>View All →</button>
        </div>
        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#444' }}>
            No cars yet. <button onClick={() => nav('/admin/cars/add')} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', textDecoration: 'underline' }}>Add your first car</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recent.map((car, i) => (
              <div key={car.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderTop: i > 0 ? '1px solid #1e1e3a' : 'none' }}>
                <div style={{ width: 52, height: 38, borderRadius: 8, overflow: 'hidden', background: '#1a1a3e', flexShrink: 0 }}>
                  {car.images?.[0] ? <img src={car.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 20 }}>🚗</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{car.title}</div>
                  <div style={{ color: '#555', fontSize: 12 }}>{car.year} · {car.fuel}</div>
                </div>
                <div style={{ color: '#dc2626', fontWeight: 700, fontFamily: 'Syne,sans-serif', flexShrink: 0 }}>{fmt(car.price)}</div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {car.is_sold && <span style={{ background: '#1f2937', color: '#6b7280', fontSize: 11, padding: '2px 8px', borderRadius: 10 }}>SOLD</span>}
                  {car.is_hot_deal && <span style={{ background: '#dc262222', color: '#dc2626', fontSize: 11, padding: '2px 8px', borderRadius: 10 }}>HOT</span>}
                </div>
                <button onClick={() => nav(`/admin/cars/edit/${car.id}`)} style={{ background: 'none', border: '1px solid #1e1e3a', color: '#666', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  <Eye size={12} /> Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent inquiries */}
      {inquiries && inquiries.length > 0 && (
        <div className="card" style={{ padding: 20, marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, color: '#fff' }}>
              Recent Inquiries {unread > 0 && <span style={{ background: '#dc2626', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 10, marginLeft: 8 }}>{unread} new</span>}
            </h2>
            <button onClick={() => nav('/admin/inquiries')} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 13 }}>View All →</button>
          </div>
          {inquiries.slice(0, 4).map((inq, i) => (
            <div key={inq.id} style={{ padding: '12px 0', borderTop: i > 0 ? '1px solid #1e1e3a' : 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              {!inq.is_read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', marginTop: 5, flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{inq.customer_name || 'Customer'} — {inq.car_title}</div>
                <div style={{ color: '#555', fontSize: 12, marginTop: 2 }}>{inq.message?.slice(0, 80)}{(inq.message?.length || 0) > 80 ? '...' : ''}</div>
              </div>
              <div style={{ color: '#333', fontSize: 11, flexShrink: 0 }}>{new Date(inq.created_at).toLocaleDateString('en-IN')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
