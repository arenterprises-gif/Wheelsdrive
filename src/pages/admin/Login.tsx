import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Loader, Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false) }
    else nav('/admin/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EBF2FF 0%, #DBEAFE 50%, #EEF4FB 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Background decorative elements */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,82,204,0.1) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -100, left: -100,
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{
        background: '#FFFFFF', borderRadius: 24, padding: '48px 44px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 24px 64px rgba(0,82,204,0.18)',
        border: '2px solid #E3F2FD',
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            background: 'linear-gradient(135deg, #0052CC, #0066FF)',
            borderRadius: 18, width: 64, height: 64,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(0,82,204,0.35)',
          }}>🚗</div>
          <div style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 26, color: '#1A202C', letterSpacing: -0.5 }}>
            Wheels<span style={{ color: '#0052CC' }}>Drive</span>
          </div>
          <div style={{ color: '#0052CC', fontSize: 11, fontWeight: 800, letterSpacing: 2, marginTop: 4 }}>ADMIN PANEL</div>
        </div>

        <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 20, color: '#1A202C', textAlign: 'center', marginBottom: 6 }}>
          Welcome back
        </h2>
        <p style={{ color: '#94A3B8', textAlign: 'center', fontSize: 14, marginBottom: 32, fontWeight: 500 }}>
          Sign in to manage your inventory
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ color: '#4A5568', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, display: 'block', marginBottom: 7 }}>EMAIL</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@wheelsdrive.in" required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div>
            <label style={{ color: '#4A5568', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, display: 'block', marginBottom: 7 }}>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type={showPass ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password" required
                style={{ paddingLeft: 42, paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 2 }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#FEF2F2', border: '1.5px solid #FECACA',
              borderRadius: 10, padding: '10px 14px', color: '#EF4444',
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{
              background: loading ? '#94A3B8' : 'linear-gradient(135deg, #0052CC, #0066FF)',
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '14px', fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'Nunito,sans-serif', marginTop: 4,
              boxShadow: loading ? 'none' : '0 6px 20px rgba(0,82,204,0.35)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 28px rgba(0,82,204,0.45)'
              }
            }}
            onMouseLeave={e => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(0,82,204,0.35)'
              }
            }}>
            {loading ? <><Loader size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Signing in...</> : '🔐 Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
