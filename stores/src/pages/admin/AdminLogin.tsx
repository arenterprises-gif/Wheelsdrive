import { useState } from 'react'
import { useLocation } from 'wouter'
import { adminLogin } from '../../lib/data'
import { notifyAdminLogin } from '../../lib/whatsapp'
import { Car, Lock } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [, navigate] = useLocation()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 500))
    if (adminLogin(email, password)) {
      await notifyAdminLogin(email)
      navigate('/admin')
    } else {
      setError('Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-red-600 p-2 rounded-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-2xl font-bold">WheelsDrive</span>
          </div>
          <p className="text-gray-400">Admin Panel Login</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-red-400" />
            <h2 className="text-white font-semibold">Secure Login</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com" required
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm" />
            </div>

            {error && <p className="text-red-400 text-sm bg-red-900/30 px-3 py-2 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 p-3 bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500">🔔 A WhatsApp notification will be sent to admin on login.</p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Powered by Clerkneu Technology and Solutions
        </p>
      </div>
    </div>
  )
}
