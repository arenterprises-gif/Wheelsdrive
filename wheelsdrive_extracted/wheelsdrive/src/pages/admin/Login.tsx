import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, Loader } from 'lucide-react'
import PoweredBy from '@/components/PoweredBy'

export default function AdminLogin() {
  const nav = useNavigate()
  const [email,setEmail] = useState('')
  const [pass,setPass] = useState('')
  const [show,setShow] = useState(false)
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')

  const login = async () => {
    if(!email||!pass) { setError('Please enter email and password'); return }
    setLoading(true); setError('')
    const { error:e } = await supabase.auth.signInWithPassword({ email, password:pass })
    if(e) { setError(e.message); setLoading(false); return }
    nav('/admin/dashboard')
  }

  return (
    <div style={{ background:'#F8F9FC',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:16,flexDirection:'column' }}>
      <div style={{ background:'#fff',border:'1px solid #E8ECF0',borderRadius:20,padding:32,width:'100%',maxWidth:380,boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }} className="fade-up">
        <div style={{ textAlign:'center',marginBottom:28 }}>
          <div style={{ background:'#FF6B00',borderRadius:16,width:56,height:56,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,margin:'0 auto 14px' }}>🔐</div>
          <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:22,color:'#1A1A2E' }}>Admin Panel</div>
          <div style={{ color:'#94A3B8',fontSize:13,marginTop:4 }}>WheelsDrive Management</div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ color:'#64748B',fontSize:11,fontWeight:600,letterSpacing:0.5,display:'block',marginBottom:6 }}>EMAIL</label>
          <input type="email" placeholder="admin@wheelsdrive.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}/>
        </div>
        <div style={{ marginBottom:20,position:'relative' }}>
          <label style={{ color:'#64748B',fontSize:11,fontWeight:600,letterSpacing:0.5,display:'block',marginBottom:6 }}>PASSWORD</label>
          <input type={show?'text':'password'} placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} style={{ paddingRight:40 }}/>
          <button onClick={()=>setShow(!show)} style={{ position:'absolute',right:12,bottom:11,background:'none',border:'none',color:'#94A3B8',cursor:'pointer',display:'flex' }}>{show?<EyeOff size={16}/>:<Eye size={16}/>}</button>
        </div>
        {error&&<div style={{ background:'#FEE2E2',border:'1px solid #FECACA',borderRadius:8,padding:'10px 14px',color:'#DC2626',fontSize:13,marginBottom:16 }}>{error}</div>}
        <button onClick={login} disabled={loading} className="btn-primary" style={{ width:'100%',padding:'13px 0',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:loading?0.7:1 }}>
          {loading?<><Loader size={16} style={{ animation:'spin 0.7s linear infinite' }}/>Logging in...</>:'Login to Admin Panel'}
        </button>
        <button onClick={()=>nav('/')} style={{ background:'none',border:'none',color:'#94A3B8',cursor:'pointer',width:'100%',marginTop:14,fontSize:13,fontFamily:'DM Sans,sans-serif' }}>← Back to WheelsDrive</button>
      </div>
      <PoweredBy/>
    </div>
  )
}
