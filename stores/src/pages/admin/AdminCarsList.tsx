import { useState } from 'react'
import { Link } from 'wouter'
import { getCars, deleteCar, saveCar, formatPrice } from '../../lib/data'
import { Car, Plus, Edit, Trash2, Star, Search } from 'lucide-react'

export default function AdminCarsList() {
  const [cars, setCars] = useState(getCars())
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  function refresh() { setCars(getCars()) }

  function handleDelete(id: string, title: string) {
    if (window.confirm(`Delete "${title}"?`)) {
      deleteCar(id)
      refresh()
    }
  }

  function toggleSold(id: string) {
    const car = cars.find(c => c.id === id)
    if (!car) return
    saveCar({ ...car, isSold: !car.isSold })
    refresh()
  }

  function toggleFeatured(id: string) {
    const car = cars.find(c => c.id === id)
    if (!car) return
    saveCar({ ...car, isFeatured: !car.isFeatured })
    refresh()
  }

  const filtered = cars.filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'available') return !c.isSold
    if (filter === 'sold') return c.isSold
    if (filter === 'featured') return c.isFeatured
    return true
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Cars</h1>
          <p className="text-gray-500 text-sm">{cars.length} total</p>
        </div>
        <Link href="/admin/cars/add"
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-red-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Car
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search cars..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400" />
        </div>
        <div className="flex gap-2">
          {[['all', 'All'], ['available', 'Available'], ['sold', 'Sold'], ['featured', 'Featured']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filter === val ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No cars found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Car', 'Price', 'Year / KM', 'Status', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(car => (
                  <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          {car.photos[0]
                            ? <img src={car.photos[0]} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Car className="w-4 h-4 text-gray-300" /></div>}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{car.title}</p>
                          <p className="text-xs text-gray-400">{car.brand} · {car.segment}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-gray-900">{formatPrice(car.price)}</p>
                      {car.priceNegotiable && <p className="text-xs text-green-600">Negotiable</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700">{car.year}</p>
                      <p className="text-xs text-gray-400">{(car.kmDriven / 1000).toFixed(0)}K km</p>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSold(car.id)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${car.isSold ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
                        {car.isSold ? 'Sold' : 'Available'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleFeatured(car.id)}
                        className={`p-1.5 rounded-lg transition-colors ${car.isFeatured ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:text-amber-400'}`}>
                        <Star className="w-4 h-4" fill={car.isFeatured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/cars/${car.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(car.id, car.title)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
