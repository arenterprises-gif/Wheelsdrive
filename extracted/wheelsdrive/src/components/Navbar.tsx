import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Scale, Menu, X, Phone, Tag } from 'lucide-react'
import { waLink } from '@/lib/utils'

export default function Navbar({ compareCount = 0, onCompareClick }: { compareCount?: number; onCompareClick?: () => void }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const nav = useNavigate()

  const search = () => {
    if (q.trim()) { nav(`/?search=${encodeURIComponent(q.trim())}`); setQ(''); setOpen(false) }
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
      background: '#FFFFFF', borderBottom: '1px solid #F3F4F6',
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)', height: 64,
    }}>
      <div style={{ maxWidth: 1260, margin: '0 auto', padding: '0 20px', height: '100%', display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{
            background: 'linear-gradient(135deg,#E8520A,#FF6B2B)',
            borderRadius: 10, width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 3px 8px rgba(232,82,10,0.28)',
          }}>🚗</div>
          <span style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 20, color: '#111827', letterSpacing: -0.5 }}>
            Wheels<span style={{ color: '#E8520A' }}>Drive</span>
          </span>
        </Link>

        {/* Search — hidden on small screens via flex */}
        <div style={{
          flex: 1, maxWidth: 420, display: 'flex',
          background: '#F9FAFB', borderRadius: 10,
          border: '1.5px solid #E5E7EB', overflow: 'hidden',
          transition: 'border-color 0.2s',
        }}
          onFocusCapture={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#E8520A'}
          onBlurCapture={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#E5E7EB'}>
          <input
            value={q} onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="Search brand, model, color..."
            style={{ flex: 1, background: 'none', border: 'none', padding: '9px 14px', fontSize: 14, color: '#111827', outline: 'none', fontFamily: 'Nunito,sans-serif' }}
          />
          <button onClick={search}
            style={{ background: '#E8520A', border: 'none', padding: '0 16px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#C43E00'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#E8520A'}>
            <Search size={15} />
          </button>
        </div>

        {/* Right actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/sell"
            style={{
              background: '#FFF5F0', color: '#E8520A', borderRadius: 8,
              padding: '8px 14px', textDecoration: 'none', fontWeight: 700,
              fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
              border: '1.5px solid #FDDCCE', transition: 'all 0.2s',
              fontFamily: 'Nunito,sans-serif',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#E8520A'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#FFF5F0'; (e.currentTarget as HTMLAnchorElement).style.color = '#E8520A'; }}>
            <Tag size={14} /> Sell Car
          </Link>

          {compareCount > 0 && (
            <button onClick={onCompareClick}
              style={{
                background: '#fff', border: '1.5px solid #E8520A',
                color: '#E8520A', borderRadius: 8, padding: '7px 12px',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                gap: 6, fontSize: 13, fontWeight: 700,
                fontFamily: 'Nunito,sans-serif', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#E8520A'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#E8520A'; }}>
              <Scale size={14} /> Compare ({compareCount})
            </button>
          )}

          <a href={waLink('Hi, I want to inquire about a car.')} target="_blank" rel="noreferrer"
            style={{
              background: '#16A34A', color: '#fff', borderRadius: 8,
              padding: '8px 14px', textDecoration: 'none', fontWeight: 700,
              fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'Nunito,sans-serif', transition: 'all 0.2s',
              boxShadow: '0 2px 6px rgba(22,163,74,0.25)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#15803D'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#16A34A'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; }}>
            <Phone size={14} /> WhatsApp
          </a>

          <button onClick={() => setOpen(!open)}
            style={{ background: 'none', border: '1.5px solid #E5E7EB', borderRadius: 8, color: '#6B7280', cursor: 'pointer', display: 'flex', padding: '7px', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E8520A'; (e.currentTarget as HTMLButtonElement).style.color = '#E8520A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLButtonElement).style.color = '#6B7280'; }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ background: '#fff', borderTop: '1px solid #F3F4F6', padding: '16px 20px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', background: '#F9FAFB', borderRadius: 10, border: '1.5px solid #E5E7EB', overflow: 'hidden', marginBottom: 12 }}>
            <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Search cars..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', padding: '11px 14px', fontSize: 14, color: '#111827', fontFamily: 'Nunito,sans-serif' }} />
            <button onClick={search} style={{ background: '#E8520A', border: 'none', padding: '0 14px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}>
              <Search size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/sell" onClick={() => setOpen(false)}
              style={{ flex: 1, background: '#FFF5F0', color: '#E8520A', borderRadius: 10, padding: '11px', textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: 14, border: '1.5px solid #FDDCCE', fontFamily: 'Nunito,sans-serif' }}>
              🏷️ Sell Your Car
            </Link>
            <a href={waLink('Hi!')} target="_blank" rel="noreferrer"
              style={{ flex: 1, background: '#16A34A', color: '#fff', borderRadius: 10, padding: '11px', textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: 14, fontFamily: 'Nunito,sans-serif' }}>
              📱 WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
