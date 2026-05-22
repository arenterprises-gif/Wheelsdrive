import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Scale, Menu, X, Phone } from 'lucide-react'
import { waLink } from '@/lib/utils'

interface NavbarProps {
  compareCount?: number
  onCompareClick?: () => void
}

export default function Navbar({ compareCount = 0, onCompareClick }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const nav = useNavigate()

  const search = () => {
    if (q.trim()) {
      nav(`/?search=${encodeURIComponent(q.trim())}`)
      setQ('')
      setOpen(false)
    }
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
      background: 'rgba(10,10,24,0.97)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #1e1e3a', height: 64,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: '100%', display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 26 }}>🚗</span>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, color: '#fff' }}>
            Wheels<span style={{ color: '#dc2626' }}>Drive</span>
          </span>
        </Link>

        {/* Desktop search */}
        <div style={{ flex: 1, maxWidth: 420, display: 'flex', background: '#111127', borderRadius: 10, border: '1px solid #1e1e3a', overflow: 'hidden' }}
          className="hidden md:flex">
          <input
            value={q} onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="Search brand, model, color..."
            style={{ flex: 1, background: 'none', border: 'none', color: '#fff', outline: 'none', padding: '10px 14px', fontSize: 14 }}
          />
          <button onClick={search} style={{ background: '#dc2626', border: 'none', padding: '0 16px', cursor: 'pointer', color: '#fff' }}>
            <Search size={16} />
          </button>
        </div>

        {/* Right */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          {compareCount > 0 && (
            <button onClick={onCompareClick}
              style={{ background: '#1e1e3a', border: '1px solid #dc2626', color: '#fff', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
              <Scale size={14} /> Compare ({compareCount})
            </button>
          )}
          <a href={waLink('Hi, I want to inquire about a car.')} target="_blank" rel="noreferrer"
            style={{ background: '#16a34a', color: '#fff', borderRadius: 8, padding: '8px 14px', textDecoration: 'none', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
            className="hidden sm:flex">
            <Phone size={14} /> WhatsApp
          </a>
          <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }} className="md:hidden">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: '#111127', borderTop: '1px solid #1e1e3a', padding: 16 }}>
          <div style={{ display: 'flex', background: '#0d0d20', borderRadius: 10, border: '1px solid #1e1e3a', overflow: 'hidden', marginBottom: 12 }}>
            <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Search cars..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', padding: '10px 14px', fontSize: 14, color: '#fff' }} />
            <button onClick={search} style={{ background: '#dc2626', border: 'none', padding: '0 14px', cursor: 'pointer', color: '#fff' }}><Search size={16} /></button>
          </div>
          <a href={waLink('Hi!')} target="_blank" rel="noreferrer"
            style={{ display: 'block', background: '#16a34a', color: '#fff', borderRadius: 8, padding: '10px', textAlign: 'center', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
            📱 WhatsApp: +91 95063 65650
          </a>
        </div>
      )}
    </nav>
  )
}
