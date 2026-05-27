import { useQuery } from '@tanstack/react-query'
import { fetchCarStats, fetchInquiries, fetchCars } from '@/lib/queries'
import { fmt } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { Car, TrendingUp, MessageSquare, Tag, Plus, Pencil, Clock } from 'lucide-react'

export default function AdminDashboard() {
  const nav = useNavigate()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchCarStats,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
  const { data: inquiries } = useQuery({
    queryKey: ['inquiries'],
    queryFn: fetchInquiries,
    staleTime: 30 * 1000,
  })
  const { data: recentData } = useQuery({
    queryKey: ['recent-cars'],
    queryFn: () => fetchCars({}, 1),
    staleTime: 3 * 60 * 1000,
  })

  const unread = inquiries?.filter(i => !i.is_read).length || 0
  const recent = recentData?.data.slice(0, 5) || []

  const StatCard = ({
    icon, label, value, sub, color = '#E8520A', loading,
  }: {
    icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string; loading?: boolean
  }) => (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: 16,
      padding: '20px 22px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 6px 20px ${color}20`;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: '#9CA3AF', fontSize: 11, letterSpacing: 1, marginBottom: 10, fontWeight: 700, textTransform: 'uppercase' }}>{label}</div>
          {loading ? (
            <div style={{ width: 80, height: 34, background: 'linear-gradient(90deg,#F3F4F6 25%,#E5E7EB 50%,#F3F4F6 75%)', backgroundSize: '200% 100%', borderRadius: 8, animation: 'shimmer 1.5s infinite' }} />
          ) : (
            <div style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 32, color: '#111827', lineHeight: 1 }}>{value}</div>
          )}
          {sub && <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 6, fontWeight: 500 }}>{sub}</div>}
        </div>
        <div style={{
          background: `${color}15`,
          border: `1.5px solid ${color}30`,
          borderRadius: 12,
          padding: 12,
          color,
        }}>
          {icon}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 26, color: '#111827', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 500 }}>
            Welcome back, Admin · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button onClick={() => nav('/admin/cars/add')}
          style={{
            background: 'linear-gradient(135deg,#E8520A,#FF6B2B)',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '11px 22px', cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700,
            fontFamily: 'Nunito,sans-serif',
            boxShadow: '0 4px 14px rgba(232,82,10,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(232,82,10,0.4)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(232,82,10,0.3)';
          }}>
          <Plus size={16} /> Add Car
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon={<Car size={20} />} label="Total Cars" value={stats?.total ?? 0} sub="In inventory" loading={statsLoading} />
        <StatCard icon={<TrendingUp size={20} />} label="Available" value={stats?.available ?? 0} sub="Ready to sell" color="#059669" loading={statsLoading} />
        <StatCard icon={<Tag size={20} />} label="Sold" value={stats?.sold ?? 0} sub="All time" color="#6366F1" loading={statsLoading} />
        <StatCard icon={<MessageSquare size={20} />} label="New Inquiries" value={unread} sub={`${inquiries?.length ?? 0} total`} color="#7C3AED" />
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 16, color: '#111827', marginBottom: 14 }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
          {[
            { label: 'Add New Car', icon: '🚗', action: () => nav('/admin/cars/add'), color: '#E8520A' },
            { label: 'View Inquiries', icon: '💬', action: () => nav('/admin/inquiries'), color: '#7C3AED' },
            { label: 'Manage Cars', icon: '📋', action: () => nav('/admin/cars'), color: '#059669' },
            { label: 'Valuations', icon: '💰', action: () => nav('/admin/valuations'), color: '#D97706' },
            { label: 'Settings', icon: '⚙️', action: () => nav('/admin/settings'), color: '#0369A1' },
          ].map(q => (
            <button key={q.label} onClick={q.action}
              style={{
                background: '#FFFFFF', border: '1.5px solid #E5E7EB',
                borderRadius: 14, padding: '18px 12px', cursor: 'pointer',
                textAlign: 'center', transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = `${q.color}08`;
                (e.currentTarget as HTMLButtonElement).style.borderColor = q.color;
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 16px ${q.color}20`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
              }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{q.icon}</div>
              <div style={{ color: '#374151', fontSize: 12, fontWeight: 700, fontFamily: 'Nunito,sans-serif' }}>{q.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Cars */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E5E7EB',
        borderRadius: 16, padding: 24, marginBottom: 20,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 17, color: '#111827' }}>Recently Added Cars</h2>
          <button onClick={() => nav('/admin/cars')}
            style={{
              background: 'none', border: 'none', color: '#E8520A',
              cursor: 'pointer', fontSize: 13, fontWeight: 700,
              fontFamily: 'Nunito,sans-serif',
            }}>
            View All →
          </button>
        </div>
        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#9CA3AF' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🚗</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>No cars yet.</div>
            <button onClick={() => nav('/admin/cars/add')}
              style={{ background: 'none', border: 'none', color: '#E8520A', cursor: 'pointer', textDecoration: 'underline', fontSize: 13, marginTop: 4 }}>
              Add your first car
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recent.map((car, i) => (
              <div key={car.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 0', borderTop: i > 0 ? '1px solid #F3F4F6' : 'none',
              }}>
                <div style={{ width: 54, height: 40, borderRadius: 8, overflow: 'hidden', background: '#F9FAFB', flexShrink: 0, border: '1px solid #F3F4F6' }}>
                  {car.images?.[0]
                    ? <img src={car.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={car.title} />
                    : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 20 }}>🚗</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#111827', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{car.title}</div>
                  <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>{car.year} · {car.fuel} · {car.condition}</div>
                </div>
                <div style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 15, color: '#E8520A', flexShrink: 0 }}>{fmt(car.price)}</div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {car.is_sold && (
                    <span style={{ background: '#F3F4F6', color: '#9CA3AF', fontSize: 10, padding: '2px 8px', borderRadius: 8, fontWeight: 700 }}>SOLD</span>
                  )}
                  {car.is_hot_deal && (
                    <span style={{ background: '#FFF5F0', color: '#E8520A', fontSize: 10, padding: '2px 8px', borderRadius: 8, fontWeight: 700, border: '1px solid #FDDCCE' }}>HOT</span>
                  )}
                  {car.is_featured && (
                    <span style={{ background: '#F5F3FF', color: '#7C3AED', fontSize: 10, padding: '2px 8px', borderRadius: 8, fontWeight: 700, border: '1px solid #DDD6FE' }}>★</span>
                  )}
                </div>
                <button onClick={() => nav(`/admin/cars/edit/${car.id}`)}
                  style={{
                    background: 'none', border: '1.5px solid #E5E7EB',
                    color: '#6B7280', borderRadius: 7, padding: '5px 10px',
                    cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center',
                    gap: 4, flexShrink: 0, fontWeight: 600,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#E8520A';
                    (e.currentTarget as HTMLButtonElement).style.color = '#E8520A';
                    (e.currentTarget as HTMLButtonElement).style.background = '#FFF5F0';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB';
                    (e.currentTarget as HTMLButtonElement).style.color = '#6B7280';
                    (e.currentTarget as HTMLButtonElement).style.background = 'none';
                  }}>
                  <Pencil size={11} /> Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Inquiries */}
      {inquiries && inquiries.length > 0 && (
        <div style={{
          background: '#FFFFFF', border: '1px solid #E5E7EB',
          borderRadius: 16, padding: 24,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 17, color: '#111827', display: 'flex', alignItems: 'center', gap: 10 }}>
              Recent Inquiries
              {unread > 0 && (
                <span style={{ background: '#E8520A', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>
                  {unread} new
                </span>
              )}
            </h2>
            <button onClick={() => nav('/admin/inquiries')}
              style={{ background: 'none', border: 'none', color: '#E8520A', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito,sans-serif' }}>
              View All →
            </button>
          </div>
          {inquiries.slice(0, 4).map((inq, i) => (
            <div key={inq.id} style={{
              padding: '12px 0',
              borderTop: i > 0 ? '1px solid #F3F4F6' : 'none',
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: inq.is_read ? '#F3F4F6' : '#FFF5F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
                border: inq.is_read ? 'none' : '1.5px solid #FDDCCE',
              }}>💬</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#111827', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {inq.customer_name || 'Customer'}
                  {!inq.is_read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E8520A', display: 'inline-block' }} />}
                </div>
                <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2, fontWeight: 500 }}>{inq.car_title}</div>
                <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {inq.message?.slice(0, 90)}{(inq.message?.length || 0) > 90 ? '...' : ''}
                </div>
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 11, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={11} /> {new Date(inq.created_at).toLocaleDateString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
