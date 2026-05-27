import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import PoweredBy from '@/components/PoweredBy'
import { LayoutDashboard, Car, MessageSquare, Settings, LogOut, Menu, X, ExternalLink, Tag } from 'lucide-react'

const NAV = [
  { path:'/admin/dashboard', label:'Dashboard', icon:<LayoutDashboard size={18}/> },
  { path:'/admin/cars',      label:'Cars',       icon:<Car size={18}/> },
  { path:'/admin/valuations',label:'Valuations', icon:<Tag size={18}/> },
  { path:'/admin/inquiries', label:'Inquiries',  icon:<MessageSquare size={18}/> },
  { path:'/admin/settings',  label:'Settings',   icon:<Settings size={18}/> },
]

export default function AdminLayout() {
  const nav = useNavigate()
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) nav('/admin/login', { replace: true })
      else setUser(data.session.user.email || '')
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) nav('/admin/login', { replace: true })
    })
    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => { await supabase.auth.signOut(); nav('/admin/login') }

  const Sidebar = () => (
    <div style={{
      width: 260,
      background: '#FFFFFF',
      borderRight: '1px solid #E5E7EB',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxShadow: '4px 0 16px rgba(0,0,0,0.06)',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            background: 'linear-gradient(135deg,#E8520A,#FF6B2B)',
            borderRadius: 12,
            width: 42,
            height: 42,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            boxShadow: '0 4px 12px rgba(232,82,10,0.3)',
            flexShrink: 0,
          }}>🚗</div>
          <div>
            <div style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 19, color: '#111827', letterSpacing: -0.5 }}>
              Wheels<span style={{ color: '#E8520A' }}>Drive</span>
            </div>
            <div style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>ADMIN PANEL</div>
          </div>
        </div>
        {user && (
          <div style={{
            color: '#6B7280', fontSize: 12, marginTop: 4,
            background: '#FFF5F0', padding: '7px 10px', borderRadius: 8,
            fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            <span style={{ fontSize: 14 }}>👤</span> {user}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV.map(item => {
          const active = loc.pathname === item.path || loc.pathname.startsWith(item.path + '/')
          return (
            <button key={item.path}
              onClick={() => { nav(item.path); setOpen(false) }}
              style={{
                background: active ? 'linear-gradient(135deg,#FFF5F0,#FFF0E6)' : 'transparent',
                border: active ? '1.5px solid #FDDCCE' : '1.5px solid transparent',
                borderRadius: 10,
                color: active ? '#E8520A' : '#6B7280',
                padding: '11px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                width: '100%',
                textAlign: 'left',
                fontFamily: 'Nunito,sans-serif',
                transition: 'all 0.18s',
                marginBottom: 4,
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB';
                  (e.currentTarget as HTMLButtonElement).style.color = '#111827';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = '#6B7280';
                }
              }}
            >
              <span style={{ opacity: active ? 1 : 0.65, display: 'flex', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
              {active && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#E8520A', flexShrink: 0 }} />}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #F3F4F6', padding: '10px 10px 8px' }}>
        <a href="/" target="_blank" rel="noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', color: '#6B7280', fontSize: 13,
            textDecoration: 'none', borderRadius: 8,
            transition: 'all 0.18s', marginBottom: 4, fontWeight: 500,
            fontFamily: 'Nunito,sans-serif',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = '#EFF6FF';
            (e.currentTarget as HTMLAnchorElement).style.color = '#1D4ED8';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.color = '#6B7280';
          }}>
          <ExternalLink size={15} /> View Site
        </a>
        <button onClick={logout}
          style={{
            background: 'none', border: 'none', color: '#6B7280',
            padding: '10px 14px', cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: 10, width: '100%', fontSize: 13,
            fontFamily: 'Nunito,sans-serif', borderRadius: 8,
            transition: 'all 0.18s', fontWeight: 500,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2';
            (e.currentTarget as HTMLButtonElement).style.color = '#DC2626';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = '#6B7280';
          }}>
          <LogOut size={15} /> Logout
        </button>
        <PoweredBy />
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F4F5F7', overflow: 'hidden' }}>
      {/* Desktop sidebar */}
      <div style={{ position: 'fixed', left: 0, top: 0, width: 260, height: '100vh', zIndex: 100, display: 'flex' }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, marginLeft: 260, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile topbar */}
        <div style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          padding: '0 20px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 18, color: '#111827', letterSpacing: -0.5 }}>
            Wheels<span style={{ color: '#E8520A' }}>Drive</span>
          </div>
          <button onClick={() => setOpen(!open)}
            style={{
              background: 'none',
              border: '1.5px solid #E5E7EB',
              borderRadius: 8,
              color: '#6B7280',
              cursor: 'pointer',
              padding: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#EFF6FF';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#1D4ED8';
              (e.currentTarget as HTMLButtonElement).style.color = '#1D4ED8';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB';
              (e.currentTarget as HTMLButtonElement).style.color = '#6B7280';
            }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        {open && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }}
            onClick={() => setOpen(false)}>
            <div style={{ width: 260, height: '100%', background: '#fff' }} onClick={e => e.stopPropagation()}>
              <Sidebar />
            </div>
          </div>
        )}

        <main style={{ flex: 1, overflowY: 'auto', padding: 'clamp(20px,3vw,32px)', background: '#F4F5F7' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
