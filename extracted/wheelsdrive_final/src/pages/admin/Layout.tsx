import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import PoweredBy from '@/components/PoweredBy'
import { LayoutDashboard, Car, MessageSquare, Settings, LogOut, Menu, X, ExternalLink, Tag, Bell } from 'lucide-react'

const NAV = [
  { path:'/admin/dashboard', label:'Dashboard', icon:<LayoutDashboard size={18}/>, color:'#0052CC' },
  { path:'/admin/cars',      label:'Cars',       icon:<Car size={18}/>,            color:'#0052CC' },
  { path:'/admin/valuations',label:'Valuations', icon:<Tag size={18}/>,            color:'#7C3AED' },
  { path:'/admin/inquiries', label:'Inquiries',  icon:<MessageSquare size={18}/>,  color:'#10B981' },
  { path:'/admin/settings',  label:'Settings',   icon:<Settings size={18}/>,       color:'#64748B' },
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
      width: 268,
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)',
      borderRight: '2px solid #E3F2FD',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxShadow: '4px 0 20px rgba(0,82,204,0.1)',
    }}>
      {/* Logo Section */}
      <div style={{
        padding: '24px 20px 20px',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #EBF2FF 100%)',
        borderBottom: '2px solid #E3F2FD',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{
            background: 'linear-gradient(135deg, #0052CC, #0066FF)',
            borderRadius: 14, width: 46, height: 46,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: '0 6px 18px rgba(0,82,204,0.35)', flexShrink: 0,
          }}>🚗</div>
          <div>
            <div style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 20, color: '#1A202C', letterSpacing: -0.5 }}>
              Wheels<span style={{ color: '#0052CC' }}>Drive</span>
            </div>
            <div style={{ color: '#0052CC', fontSize: 10, fontWeight: 800, letterSpacing: 1.5 }}>ADMIN PANEL</div>
          </div>
        </div>
        {user && (
          <div style={{
            color: '#1A202C', fontSize: 12, marginTop: 4,
            background: 'linear-gradient(135deg, #EBF2FF, #DBEAFE)',
            padding: '8px 12px', borderRadius: 10,
            fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            border: '1.5px solid #B3D1FF',
          }}>
            <span style={{ fontSize: 14 }}>👤</span> {user}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
        <div style={{ color: '#94A3B8', fontSize: 10, fontWeight: 800, letterSpacing: 1.5, padding: '0 10px', marginBottom: 8 }}>NAVIGATION</div>
        {NAV.map(item => {
          const active = loc.pathname === item.path || loc.pathname.startsWith(item.path + '/')
          return (
            <button key={item.path}
              onClick={() => { nav(item.path); setOpen(false) }}
              style={{
                background: active ? 'linear-gradient(135deg, #EBF2FF, #DBEAFE)' : 'transparent',
                border: active ? '1.5px solid #B3D1FF' : '1.5px solid transparent',
                borderRadius: 12,
                color: active ? '#0052CC' : '#4A5568',
                padding: '12px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 14,
                fontWeight: active ? 800 : 500,
                width: '100%',
                textAlign: 'left',
                fontFamily: 'Nunito,sans-serif',
                transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                marginBottom: 4,
                boxShadow: active ? '0 2px 8px rgba(0,82,204,0.12)' : 'none',
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = '#F0F7FF'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#B3D1FF'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#0052CC'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#4A5568'
                }
              }}
            >
              <span style={{
                display: 'flex', flexShrink: 0,
                color: active ? '#0052CC' : '#94A3B8',
                transition: 'color 0.2s',
              }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {active && (
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0052CC, #0066FF)',
                  flexShrink: 0, boxShadow: '0 2px 6px rgba(0,82,204,0.4)',
                }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        borderTop: '2px solid #E3F2FD', padding: '12px 10px 10px',
        background: 'linear-gradient(180deg, #F8FAFF, #FFFFFF)',
      }}>
        <a href="/" target="_blank" rel="noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', color: '#64748B', fontSize: 13,
            textDecoration: 'none', borderRadius: 10,
            transition: 'all 0.2s', marginBottom: 4, fontWeight: 600,
            fontFamily: 'Nunito,sans-serif', border: '1.5px solid transparent',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = '#EBF2FF'
            ;(e.currentTarget as HTMLAnchorElement).style.color = '#0052CC'
            ;(e.currentTarget as HTMLAnchorElement).style.borderColor = '#B3D1FF'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLAnchorElement).style.color = '#64748B'
            ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'transparent'
          }}>
          <ExternalLink size={15} /> View Live Site
        </a>
        <button onClick={logout}
          style={{
            background: 'none', border: '1.5px solid transparent', color: '#64748B',
            padding: '10px 14px', cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: 10, width: '100%', fontSize: 13,
            fontFamily: 'Nunito,sans-serif', borderRadius: 10,
            transition: 'all 0.2s', fontWeight: 600,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#EF4444'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#FECACA'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#64748B'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'
          }}>
          <LogOut size={15} /> Logout
        </button>
        <PoweredBy />
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#EEF4FB', overflow: 'hidden' }}>
      {/* Desktop sidebar */}
      <div style={{ position: 'fixed', left: 0, top: 0, width: 268, height: '100vh', zIndex: 100, display: 'flex' }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, marginLeft: 268, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          background: 'linear-gradient(90deg, #FFFFFF, #F8FAFF)',
          borderBottom: '2px solid #E3F2FD',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          boxShadow: '0 2px 10px rgba(0,82,204,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 18, color: '#1A202C', letterSpacing: -0.5 }}>
              Wheels<span style={{ color: '#0052CC' }}>Drive</span>
            </div>
            <div style={{ height: 20, width: 1, background: '#E3F2FD' }} />
            <div style={{ color: '#64748B', fontSize: 13, fontWeight: 600 }}>
              {NAV.find(n => loc.pathname.startsWith(n.path))?.label || 'Admin'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: 'linear-gradient(135deg, #EBF2FF, #DBEAFE)',
              border: '1.5px solid #B3D1FF',
              borderRadius: 20, padding: '6px 14px',
              fontSize: 12, color: '#0052CC', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              Live
            </div>
            <button onClick={() => setOpen(!open)}
              style={{
                background: 'none', border: '1.5px solid #E3F2FD', borderRadius: 10,
                color: '#64748B', cursor: 'pointer', padding: '7px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#EBF2FF'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#0052CC'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#0052CC'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'none'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#E3F2FD'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#64748B'
              }}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {open && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,82,204,0.2)', backdropFilter: 'blur(4px)' }}
            onClick={() => setOpen(false)}>
            <div style={{ width: 268, height: '100%', background: '#fff' }} onClick={e => e.stopPropagation()}>
              <Sidebar />
            </div>
          </div>
        )}

        <main style={{ flex: 1, overflowY: 'auto', padding: 'clamp(20px,3vw,32px)', background: '#EEF4FB' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
