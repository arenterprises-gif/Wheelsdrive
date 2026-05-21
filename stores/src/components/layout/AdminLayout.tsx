import { Link, useLocation } from 'wouter'
import { Car, LayoutDashboard, List, Plus, LogOut } from 'lucide-react'
import { adminLogout, isAdminLoggedIn } from '../../lib/data'
import { useEffect } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation()

  useEffect(() => {
    if (!isAdminLoggedIn()) navigate('/admin/login')
  }, [])

  function handleLogout() {
    adminLogout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-1.5 rounded">
              <Car className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">WheelsDrive</p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          <Link href="/admin"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location === '/admin' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/admin/cars"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location === '/admin/cars' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <List className="w-4 h-4" /> All Cars
          </Link>
          <Link href="/admin/cars/add"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location === '/admin/cars/add' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <Plus className="w-4 h-4" /> Add Car
          </Link>
        </nav>

        <div className="p-3 border-t border-gray-800">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
          <Link href="/" className="mt-1 w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ← View Website
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
