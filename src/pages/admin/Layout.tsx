import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import PoweredBy from '@/components/PoweredBy'
import { LayoutDashboard, Car, MessageSquare, Settings, LogOut, Menu, X, ExternalLink } from 'lucide-react'

const NAV = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { path: '/admin/cars', label: 'Cars', icon: <Car size={18} /> },
  { path: '/admin/inquiries', label: 'Inquiries', icon: <MessageSquare size={18} /> },
  { path: '/admin/settings', label: 'Settings', icon: <Settings size={18} /> },
]

export default function AdminLayout() {
  const nav = useNavigate()
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<string>('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) nav('/admin/login')
      else setUser(data.session.user.email || '')
    })
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    nav('/admin/login')
  }

  const Sidebar = ({ mobile = false }) => (
    <div style={{
      width: mobile ? '100%' : 220,
      background: '#111127',
      borderRight: mobile ? 'none' : '1px solid #1e1e3a',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 0',
      height: mobile ? 'auto' : '100%',
    }}>
      <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #1e1e3a', marginBottom: 8 }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color: '#fff' }}>
          Wheels<span style={{ color: '#dc2626' }}>Drive</span>
        </div>
        <div style={{ color: '#444', fontSize: 12, marginTop: 4 }}>Admin Panel</div>
        {user && <div style={{ color: '#555', fontSize: 11, marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user}</div>}
      </div>

      {NAV.map(item => {
        const active = loc.pathname === item.path
        return (
          <button key={item.path} onClick={() => { nav(item.path); setOpen(false) }}
            style={{
              background: active ? '#1e1e3a' : 'none',
              border: 'none',
              borderLeft: active ? '3px solid #dc2626' : '3px solid transparent',
              color: active ? '#fff' : '#666',
              padding: '12px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 14,
              fontWeight: active ? 600 : 400,
              width: '100%',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = '#666' }}
          >
            <span style={{ color: active ? '#dc2626' : 'inherit' }}>{item.icon}</span>
            {item.label}
          </button>
        )
      })}

      <div style={{ marginTop: 'auto', borderTop: '1px solid #1e1e3a', paddingTop: 12 }}>
        <a href="/" target="_blank" rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', color: '#555', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#fff'}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#555'}>
          <ExternalLink size={16} /> View Live Site
        </a>
        <button onClick={logout}
          style={{ background: 'none', border: 'none', color: '#555', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, width: '100%', fontSize: 13, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#555'}>
          <LogOut size={16} /> Logout
        </button>
      </div>
      <PoweredBy />
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0a0a18', overflow: 'hidden' }}>
      {/* Desktop sidebar */}
      <div style={{ flexShrink: 0, display: 'none' }} className="md:flex" >
        <div style={{ width: 220, height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 100 }}>
          <Sidebar />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, marginLeft: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile topbar */}
        <div style={{ background: '#111127', borderBottom: '1px solid #1e1e3a', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color: '#fff' }}>
            Wheels<span style={{ color: '#dc2626' }}>Drive</span> <span style={{ color: '#444', fontSize: 13, fontFamily: 'DM Sans,sans-serif', fontWeight: 400 }}>Admin</span>
          </div>
          <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile nav drawer */}
        {open && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)' }} onClick={() => setOpen(false)}>
            <div style={{ width: 260, height: '100%', background: '#111127' }} onClick={e => e.stopPropagation()}>
              <Sidebar mobile />
            </div>
          </div>
        )}

        {/* Desktop sidebar spacer */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div style={{ width: 220, flexShrink: 0, display: 'block' }} className="hidden md:block" />
          <main style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px,2vw,28px)' }}>
            <Outlet />
          </main>
        </div>
      </div>

      {/* Fixed desktop sidebar */}
      <div style={{ position: 'fixed', left: 0, top: 0, width: 220, height: '100vh', zIndex: 100, display: 'flex' }}>
        <Sidebar />
      </div>
    </div>
  )
}
