import { getCars } from '../../lib/data'
import { Link } from 'wouter'
import { Car, CheckCircle, XCircle, Star, Plus, Edit } from 'lucide-react'

export default function AdminDashboard() {
  const cars = getCars()
  const total = cars.length
  const available = cars.filter(c => !c.isSold).length
  const sold = cars.filter(c => c.isSold).length
  const featured = cars.filter(c => c.isFeatured).length
  const recent = [...cars].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  const stats = [
    { label: 'Total Cars', value: total, icon: <Car className="w-6 h-6" />, color: 'bg-blue-500' },
    { label: 'Available', value: available, icon: <CheckCircle className="w-6 h-6" />, color: 'bg-green-500' },
    { label: 'Sold', value: sold, icon: <XCircle className="w-6 h-6" />, color: 'bg-red-500' },
    { label: 'Featured', value: featured, icon: <Star className="w-6 h-6" />, color: 'bg-amber-500' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, Admin</p>
        </div>
        <Link href="/admin/cars/add"
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-red-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Car
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-200 flex items-center gap-4">
            <div className={`${s.color} text-white p-3 rounded-xl`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Cars */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Cars</h2>
          <Link href="/admin/cars" className="text-sm text-red-600 hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recent.map(car => (
            <div key={car.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
              <div className="w-14 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                {car.photos[0]
                  ? <img src={car.photos[0]} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><Car className="w-5 h-5 text-gray-300" /></div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{car.title}</p>
                <p className="text-xs text-gray-500">₹{(car.price / 100000).toFixed(1)}L</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${car.isSold ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {car.isSold ? 'Sold' : 'Available'}
              </span>
              <Link href={`/admin/cars/${car.id}/edit`}
                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                <Edit className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
