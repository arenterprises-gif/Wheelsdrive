import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Scale, Menu, X, Phone, Tag, ChevronDown } from 'lucide-react'
import { waLink } from '@/lib/utils'

export default function Navbar({ compareCount = 0, onCompareClick }: { compareCount?: number; onCompareClick?: () => void }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)
  const nav = useNavigate()

  const search = () => {
    if (q.trim()) { nav(`/?search=${encodeURIComponent(q.trim())}`); setQ(''); setOpen(false) }
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
      background: 'linear-gradient(90deg, #FFFFFF 0%, #F8FAFF 100%)',
      borderBottom: '2px solid #E3F2FD',
      boxShadow: '0 2px 16px rgba(0,82,204,0.1)',
      height: 66,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', height: '100%', display: 'flex', alignItems: 'center', gap: 16 }}>
        
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            background: 'linear-gradient(135deg, #0052CC, #0066FF)',
            borderRadius: 12, width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, boxShadow: '0 4px 12px rgba(0,82,204,0.35)',
          }}>🚗</div>
          <div>
            <div style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 20, color: '#1A202C', letterSpacing: -0.5, lineHeight: 1.2 }}>
              Wheels<span style={{ color: '#0052CC' }}>Drive</span>
            </div>
            <div style={{ color: '#94A3B8', fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>JHANSI'S #1</div>
          </div>
        </Link>

        {/* Search Bar - desktop */}
        <div style={{
          flex: 1, maxWidth: 480, display: 'flex',
          background: focused ? '#F0F7FF' : '#F8FAFF',
          borderRadius: 12,
          border: `2px solid ${focused ? '#0052CC' : '#E3F2FD'}`,
          overflow: 'hidden',
          transition: 'all 0.2s',
          boxShadow: focused ? '0 0 0 4px rgba(0,82,204,0.1)' : 'none',
        }}>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Brand, model, color search karo..."
            style={{
              flex: 1, background: 'none', border: 'none', padding: '10px 16px',
              fontSize: 14, color: '#1A202C', outline: 'none',
              fontFamily: 'Nunito,sans-serif', fontWeight: 500,
            }}
          />
          <button
            onClick={search}
            style={{
              background: 'linear-gradient(135deg, #0052CC, #0066FF)',
              border: 'none', padding: '0 18px', cursor: 'pointer',
              color: '#fff', display: 'flex', alignItems: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, #003D99, #0052CC)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, #0052CC, #0066FF)'}>
            <Search size={16} />
          </button>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link to="/sell"
            style={{
              background: 'linear-gradient(135deg, #EBF2FF, #DBEAFE)',
              color: '#0052CC', borderRadius: 10,
              padding: '9px 16px', textDecoration: 'none', fontWeight: 700,
              fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
              border: '1.5px solid #B3D1FF', transition: 'all 0.2s',
              fontFamily: 'Nunito,sans-serif',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'linear-gradient(135deg, #0052CC, #0066FF)'
              el.style.color = '#fff'
              el.style.borderColor = '#0052CC'
              el.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'linear-gradient(135deg, #EBF2FF, #DBEAFE)'
              el.style.color = '#0052CC'
              el.style.borderColor = '#B3D1FF'
              el.style.transform = 'translateY(0)'
            }}>
            <Tag size={14} /> Sell Car
          </Link>

          {compareCount > 0 && (
            <button
              onClick={onCompareClick}
              style={{
                background: '#EBF2FF', border: '1.5px solid #0052CC',
                color: '#0052CC', borderRadius: 10, padding: '8px 14px',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                gap: 6, fontSize: 13, fontWeight: 700,
                fontFamily: 'Nunito,sans-serif', transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#0052CC'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#fff'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#EBF2FF'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#0052CC'
              }}>
              <Scale size={14} /> Compare ({compareCount})
            </button>
          )}

          <a
            href={waLink('Hi, I want to inquire about a car.')}
            target="_blank" rel="noreferrer"
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: '#fff', borderRadius: 10,
              padding: '9px 16px', textDecoration: 'none', fontWeight: 700,
              fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'Nunito,sans-serif', transition: 'all 0.2s',
              boxShadow: '0 3px 10px rgba(16,185,129,0.3)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = 'translateY(-2px)'
              el.style.boxShadow = '0 6px 18px rgba(16,185,129,0.4)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = '0 3px 10px rgba(16,185,129,0.3)'
            }}>
            <Phone size={14} /> WhatsApp
          </a>

          <button
            onClick={() => setOpen(!open)}
            style={{
              background: 'none', border: '1.5px solid #E3F2FD',
              borderRadius: 10, color: '#64748B', cursor: 'pointer',
              display: 'flex', padding: '8px', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#0052CC'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#0052CC'
              ;(e.currentTarget as HTMLButtonElement).style.background = '#EBF2FF'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#E3F2FD'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#64748B'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'none'
            }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          background: 'linear-gradient(135deg, #FFFFFF, #F0F7FF)',
          borderTop: '2px solid #E3F2FD',
          padding: '16px 20px',
          boxShadow: '0 12px 24px rgba(0,82,204,0.12)',
        }}>
          <div style={{
            display: 'flex',
            background: '#F0F7FF',
            borderRadius: 12, border: '2px solid #B3D1FF',
            overflow: 'hidden', marginBottom: 14,
          }}>
            <input
              value={q} onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Search cars..."
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                padding: '12px 14px', fontSize: 14, color: '#1A202C',
                fontFamily: 'Nunito,sans-serif',
              }}
            />
            <button
              onClick={search}
              style={{
                background: 'linear-gradient(135deg, #0052CC, #0066FF)',
                border: 'none', padding: '0 16px', cursor: 'pointer',
                color: '#fff', display: 'flex', alignItems: 'center',
              }}>
              <Search size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/sell" onClick={() => setOpen(false)}
              style={{
                flex: 1, background: 'linear-gradient(135deg, #EBF2FF, #DBEAFE)',
                color: '#0052CC', borderRadius: 12, padding: '12px',
                textAlign: 'center', textDecoration: 'none', fontWeight: 700,
                fontSize: 14, border: '1.5px solid #B3D1FF', fontFamily: 'Nunito,sans-serif',
              }}>
              🏷️ Sell Your Car
            </Link>
            <a href={waLink('Hi!')} target="_blank" rel="noreferrer"
              style={{
                flex: 1, background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#fff', borderRadius: 12, padding: '12px',
                textAlign: 'center', textDecoration: 'none', fontWeight: 700,
                fontSize: 14, fontFamily: 'Nunito,sans-serif',
              }}>
              📱 WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
