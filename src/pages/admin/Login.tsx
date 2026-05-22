import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, Loader } from 'lucide-react'
import PoweredBy from '@/components/PoweredBy'

export default function AdminLogin() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async () => {
    if (!email || !pass) { setError('Please enter email and password'); return }
    setLoading(true)
    setError('')
    const { error: e } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (e) { setError(e.message); setLoading(false); return }
    nav('/admin/dashboard')
  }

  return (
    <div style={{ background: '#0a0a18', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, flexDirection: 'column' }}>
      <div className="card fade-up" style={{ width: '100%', maxWidth: 380, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🔐</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22, color: '#fff' }}>Admin Panel</div>
          <div style={{ color: '#555', fontSize: 13, marginTop: 4 }}>WheelsDrive Management</div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ color: '#666', fontSize: 12, letterSpacing: 1, display: 'block', marginBottom: 6 }}>EMAIL</label>
          <input type="email" placeholder="admin@wheelsdrive.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
        </div>

        <div style={{ marginBottom: 20, position: 'relative' }}>
          <label style={{ color: '#666', fontSize: 12, letterSpacing: 1, display: 'block', marginBottom: 6 }}>PASSWORD</label>
          <input type={show ? 'text' : 'password'} placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} style={{ paddingRight: 40 }} />
          <button onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, bottom: 10, background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && <div style={{ background: '#7f1d1d22', border: '1px solid #7f1d1d', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</div>}

        <button onClick={login} disabled={loading} className="btn-red" style={{ width: '100%', padding: '13px 0', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
          {loading ? <><Loader size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Logging in...</> : 'Login to Admin Panel'}
        </button>

        <button onClick={() => nav('/')} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', width: '100%', marginTop: 16, fontSize: 13 }}>
          ← Back to WheelsDrive
        </button>
      </div>
      <PoweredBy />
    </div>
  )
}
