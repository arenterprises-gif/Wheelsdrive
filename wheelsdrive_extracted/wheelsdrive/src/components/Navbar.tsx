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
    <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:500,background:'#fff',borderBottom:'1px solid #E8ECF0',boxShadow:'0 1px 8px rgba(0,0,0,0.06)',height:64 }}>
      <div style={{ maxWidth:1200,margin:'0 auto',padding:'0 20px',height:'100%',display:'flex',alignItems:'center',gap:16 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration:'none',display:'flex',alignItems:'center',gap:8,flexShrink:0 }}>
          <div style={{ background:'#FF6B00',borderRadius:10,width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>🚗</div>
          <span style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:20,color:'#1A1A2E' }}>
            Wheels<span style={{ color:'#FF6B00' }}>Drive</span>
          </span>
        </Link>

        {/* Search */}
        <div style={{ flex:1,maxWidth:400,display:'flex',background:'#F8F9FC',borderRadius:10,border:'1.5px solid #E8ECF0',overflow:'hidden' }}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()}
            placeholder="Search brand, model..." style={{ flex:1,background:'none',border:'none',padding:'9px 14px',fontSize:14,color:'#1A1A2E',outline:'none' }} />
          <button onClick={search} style={{ background:'#FF6B00',border:'none',padding:'0 16px',cursor:'pointer',color:'#fff',display:'flex',alignItems:'center' }}>
            <Search size={16} />
          </button>
        </div>

        {/* Right */}
        <div style={{ marginLeft:'auto',display:'flex',alignItems:'center',gap:10 }}>
          <Link to="/sell" style={{ background:'#FFF3E8',color:'#FF6B00',borderRadius:8,padding:'8px 14px',textDecoration:'none',fontWeight:700,fontSize:13,display:'flex',alignItems:'center',gap:6,border:'1px solid #FFD5B0' }}>
            <Tag size={14} /> Sell Car
          </Link>
          {compareCount > 0 && (
            <button onClick={onCompareClick} style={{ background:'#fff',border:'1.5px solid #FF6B00',color:'#FF6B00',borderRadius:8,padding:'7px 12px',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontSize:13,fontWeight:600 }}>
              <Scale size={14} /> Compare ({compareCount})
            </button>
          )}
          <a href={waLink('Hi, I want to inquire about a car.')} target="_blank" rel="noreferrer"
            style={{ background:'#16A34A',color:'#fff',borderRadius:8,padding:'8px 14px',textDecoration:'none',fontWeight:600,fontSize:13,display:'flex',alignItems:'center',gap:6 }}>
            <Phone size={14} /> WhatsApp
          </a>
          <button onClick={()=>setOpen(!open)} style={{ background:'none',border:'none',color:'#64748B',cursor:'pointer',display:'flex' }}>
            {open ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ background:'#fff',borderTop:'1px solid #E8ECF0',padding:16 }}>
          <div style={{ display:'flex',background:'#F8F9FC',borderRadius:10,border:'1.5px solid #E8ECF0',overflow:'hidden',marginBottom:12 }}>
            <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()}
              placeholder="Search cars..." style={{ flex:1,background:'none',border:'none',outline:'none',padding:'10px 14px',fontSize:14,color:'#1A1A2E' }}/>
            <button onClick={search} style={{ background:'#FF6B00',border:'none',padding:'0 14px',cursor:'pointer',color:'#fff' }}><Search size={16}/></button>
          </div>
          <div style={{ display:'flex',gap:10 }}>
            <Link to="/sell" onClick={()=>setOpen(false)} style={{ flex:1,background:'#FFF3E8',color:'#FF6B00',borderRadius:8,padding:'10px',textAlign:'center',textDecoration:'none',fontWeight:700,fontSize:14,border:'1px solid #FFD5B0' }}>
              🏷️ Sell Your Car
            </Link>
            <a href={waLink('Hi!')} target="_blank" rel="noreferrer"
              style={{ flex:1,background:'#16A34A',color:'#fff',borderRadius:8,padding:'10px',textAlign:'center',textDecoration:'none',fontWeight:600,fontSize:14 }}>
              📱 WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
