import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import PoweredBy from '@/components/PoweredBy'
import { LayoutDashboard, Car, MessageSquare, Settings, LogOut, Menu, X, ExternalLink, Tag } from 'lucide-react'

const NAV = [
  { path:'/admin/dashboard', label:'Dashboard', icon:<LayoutDashboard size={17}/> },
  { path:'/admin/cars', label:'Cars', icon:<Car size={17}/> },
  { path:'/admin/valuations', label:'Valuations', icon:<Tag size={17}/> },
  { path:'/admin/inquiries', label:'Inquiries', icon:<MessageSquare size={17}/> },
  { path:'/admin/settings', label:'Settings', icon:<Settings size={17}/> },
]

export default function AdminLayout() {
  const nav = useNavigate()
  const loc = useLocation()
  const [open,setOpen] = useState(false)
  const [user,setUser] = useState('')

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      if(!data.session) nav('/admin/login')
      else setUser(data.session.user.email||'')
    })
  },[])

  const logout = async () => { await supabase.auth.signOut(); nav('/admin/login') }

  const Sidebar = () => (
    <div style={{ width:220,background:'#fff',borderRight:'1px solid #E8ECF0',display:'flex',flexDirection:'column',height:'100%',boxShadow:'2px 0 8px rgba(0,0,0,0.04)' }}>
      <div style={{ padding:'20px 20px 16px',borderBottom:'1px solid #F1F5F9' }}>
        <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:8 }}>
          <div style={{ background:'#FF6B00',borderRadius:8,width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16 }}>🚗</div>
          <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:17,color:'#1A1A2E' }}>Wheels<span style={{ color:'#FF6B00' }}>Drive</span></div>
        </div>
        <div style={{ color:'#94A3B8',fontSize:11,fontWeight:600,letterSpacing:0.5 }}>ADMIN PANEL</div>
        {user&&<div style={{ color:'#CBD5E1',fontSize:11,marginTop:4,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{user}</div>}
      </div>
      <div style={{ flex:1,padding:'8px 0',overflowY:'auto' }}>
        {NAV.map(item=>{
          const active = loc.pathname===item.path||loc.pathname.startsWith(item.path+'/')
          return (
            <button key={item.path} onClick={()=>{nav(item.path);setOpen(false)}}
              style={{ background:active?'#FFF3E8':'none',borderLeft:`3px solid ${active?'#FF6B00':'transparent'}`,border:'none',borderLeftWidth:3,borderLeftStyle:'solid',color:active?'#FF6B00':'#64748B',padding:'11px 20px',cursor:'pointer',display:'flex',alignItems:'center',gap:10,fontSize:14,fontWeight:active?700:400,width:'100%',textAlign:'left',fontFamily:'DM Sans,sans-serif',transition:'all 0.15s' }}
              onMouseEnter={e=>{if(!active)(e.currentTarget as HTMLButtonElement).style.background='#F8F9FC'}}
              onMouseLeave={e=>{if(!active)(e.currentTarget as HTMLButtonElement).style.background=''}}>
              {item.icon} {item.label}
            </button>
          )
        })}
      </div>
      <div style={{ borderTop:'1px solid #F1F5F9',padding:'8px 0' }}>
        <a href="/" target="_blank" rel="noreferrer" style={{ display:'flex',alignItems:'center',gap:10,padding:'10px 20px',color:'#94A3B8',fontSize:13,textDecoration:'none' }}
          onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.color='#1A1A2E'}
          onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.color='#94A3B8'}>
          <ExternalLink size={15}/> View Site
        </a>
        <button onClick={logout} style={{ background:'none',border:'none',color:'#94A3B8',padding:'10px 20px',cursor:'pointer',display:'flex',alignItems:'center',gap:10,width:'100%',fontSize:13,fontFamily:'DM Sans,sans-serif' }}
          onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color='#DC2626'}
          onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color='#94A3B8'}>
          <LogOut size={15}/> Logout
        </button>
      </div>
      <PoweredBy/>
    </div>
  )

  return (
    <div style={{ display:'flex',height:'100vh',background:'#F8F9FC',overflow:'hidden' }}>
      {/* Fixed sidebar */}
      <div style={{ position:'fixed',left:0,top:0,width:220,height:'100vh',zIndex:100,display:'flex' }}>
        <Sidebar/>
      </div>
      <div style={{ flex:1,marginLeft:220,display:'flex',flexDirection:'column',overflow:'hidden' }}>
        {/* Mobile topbar */}
        <div style={{ background:'#fff',borderBottom:'1px solid #E8ECF0',padding:'0 16px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:17,color:'#1A1A2E' }}>Wheels<span style={{ color:'#FF6B00' }}>Drive</span></div>
          <button onClick={()=>setOpen(!open)} style={{ background:'none',border:'none',color:'#64748B',cursor:'pointer' }}>{open?<X size={22}/>:<Menu size={22}/>}</button>
        </div>
        {open&&(
          <div style={{ position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,0.3)' }} onClick={()=>setOpen(false)}>
            <div style={{ width:220,height:'100%',background:'#fff' }} onClick={e=>e.stopPropagation()}><Sidebar/></div>
          </div>
        )}
        <main style={{ flex:1,overflowY:'auto',padding:'clamp(16px,2vw,28px)' }}>
          <Outlet/>
        </main>
      </div>
    </div>
  )
}
