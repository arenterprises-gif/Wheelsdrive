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
    setLoading(true); setError('')
    const { error: e } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (e) { setError(e.message); setLoading(false); return }
    nav('/admin/dashboard')
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg,#F9FAFB 0%,#FFF5F0 100%)',
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 16, flexDirection: 'column',
    }}>
      {/* Card */}
      <div
        className="fade-up"
        style={{
          background: '#fff', border: '1px solid #E5E7EB',
          borderRadius: 24, padding: '36px 32px',
          width: '100%', maxWidth: 390,
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{
            background: 'linear-gradient(135deg,#E8520A,#FF6B2B)',
            borderRadius: 18, width: 60, height: 60,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 16px',
            boxShadow: '0 6px 20px rgba(232,82,10,0.3)',
          }}>🔐</div>
          <div style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 24, color: '#111827', letterSpacing: -0.5 }}>
            Admin Panel
          </div>
          <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4, fontWeight: 500 }}>
            WheelsDrive Management
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ color: '#6B7280', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
            Email
          </label>
          <input
            type="email"
            placeholder="admin@wheelsdrive.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 22, position: 'relative' }}>
          <label style={{ color: '#6B7280', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
            Password
          </label>
          <input
            type={show ? 'text' : 'password'}
            placeholder="••••••••"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={{ paddingRight: 44 }}
          />
          <button
            onClick={() => setShow(!show)}
            style={{ position: 'absolute', right: 12, bottom: 11, background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex', padding: 0, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#E8520A'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#9CA3AF'}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '11px 14px', color: '#DC2626', fontSize: 13, marginBottom: 16, fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={login}
          disabled={loading}
          style={{
            width: '100%', padding: '13px 0', fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: loading ? '#9CA3AF' : 'linear-gradient(135deg,#E8520A,#FF6B2B)',
            color: '#fff', border: 'none', borderRadius: 12,
            fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Nunito,sans-serif',
            boxShadow: loading ? 'none' : '0 6px 20px rgba(232,82,10,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 28px rgba(232,82,10,0.4)'; } }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = loading ? 'none' : '0 6px 20px rgba(232,82,10,0.3)'; }}>
          {loading
            ? <><Loader size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Logging in...</>
            : 'Login to Admin Panel'}
        </button>

        <button
          onClick={() => nav('/')}
          style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', width: '100%', marginTop: 14, fontSize: 13, fontFamily: 'Nunito,sans-serif', fontWeight: 600, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#E8520A'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#9CA3AF'}>
          ← Back to WheelsDrive
        </button>
      </div>

      <PoweredBy />
    </div>
  )
}
