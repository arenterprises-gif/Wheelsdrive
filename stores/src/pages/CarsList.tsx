import { getCars, formatPrice } from '../lib/data'
import { Car as CarIcon, SlidersHorizontal, X, Search } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { useState, useMemo } from 'react'
import { Car } from '../lib/types'

const SEGMENTS = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Luxury']
const BRANDS = ['Maruti', 'Hyundai', 'Tata', 'Honda', 'Toyota', 'Ford', 'Others']
const FUELS = ['Petrol', 'Diesel', 'CNG', 'Electric']
const TRANSMISSIONS = ['Manual', 'Automatic']
const PRICE_RANGES = [
  { label: 'Under ₹2L', value: 'under-2l', min: 0, max: 200000 },
  { label: '₹2L - ₹4L', value: '2l-4l', min: 200000, max: 400000 },
  { label: '₹4L - ₹6L', value: '4l-6l', min: 400000, max: 600000 },
  { label: '₹6L - ₹10L', value: '6l-10l', min: 600000, max: 1000000 },
  { label: 'Above ₹10L', value: 'above-10l', min: 1000000, max: Infinity },
]

export default function CarsList() {
  const [location] = useLocation()
  const params = new URLSearchParams(location.split('?')[1] || '')
  const [search, setSearch] = useState(params.get('search') || '')
  const [selectedBrands, setSelectedBrands] = useState<string[]>(params.get('brand') ? [params.get('brand')!] : [])
  const [selectedSegments, setSelectedSegments] = useState<string[]>(params.get('segment') ? [params.get('segment')!] : [])
  const [selectedFuels, setSelectedFuels] = useState<string[]>([])
  const [selectedTransmission, setSelectedTransmission] = useState('')
  const [selectedPrice, setSelectedPrice] = useState(params.get('price') || '')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const allCars = getCars()

  const filtered = useMemo(() => {
    let result = allCars.filter(car => {
      if (search && !car.title.toLowerCase().includes(search.toLowerCase()) &&
        !car.brand.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedBrands.length > 0) {
        const match = selectedBrands.some(b =>
          b === 'Others' ? !['Maruti', 'Hyundai', 'Tata', 'Honda', 'Toyota', 'Ford'].includes(car.brand)
            : car.brand === b
        )
        if (!match) return false
      }
      if (selectedSegments.length > 0 && !selectedSegments.includes(car.segment)) return false
      if (selectedFuels.length > 0 && !selectedFuels.includes(car.fuelType)) return false
      if (selectedTransmission && car.transmission !== selectedTransmission) return false
      if (selectedPrice) {
        const range = PRICE_RANGES.find(r => r.value === selectedPrice)
        if (range && (car.price < range.min || car.price > range.max)) return false
      }
      return true
    })
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price)
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return result
  }, [allCars, search, selectedBrands, selectedSegments, selectedFuels, selectedTransmission, selectedPrice, sortBy])

  function toggle(arr: string[], set: (v: string[]) => void, val: string) {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  function clearAll() {
    setSearch(''); setSelectedBrands([]); setSelectedSegments([])
    setSelectedFuels([]); setSelectedTransmission(''); setSelectedPrice('')
  }

  const activeFilters = selectedBrands.length + selectedSegments.length + selectedFuels.length +
    (selectedTransmission ? 1 : 0) + (selectedPrice ? 1 : 0)

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters {activeFilters > 0 && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full ml-1">{activeFilters}</span>}</h3>
        {activeFilters > 0 && <button onClick={clearAll} className="text-xs text-red-600 hover:underline">Clear all</button>}
      </div>

      {/* Budget */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Budget</p>
        {PRICE_RANGES.map(r => (
          <label key={r.value} className="flex items-center gap-2 py-1.5 cursor-pointer">
            <input type="radio" name="price" value={r.value} checked={selectedPrice === r.value}
              onChange={e => setSelectedPrice(e.target.value)} className="text-red-600" />
            <span className="text-sm text-gray-600">{r.label}</span>
          </label>
        ))}
        {selectedPrice && <button onClick={() => setSelectedPrice('')} className="text-xs text-gray-400 hover:text-red-500 mt-1">Clear</button>}
      </div>

      {/* Segment */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Segment</p>
        {SEGMENTS.map(s => (
          <label key={s} className="flex items-center gap-2 py-1.5 cursor-pointer">
            <input type="checkbox" checked={selectedSegments.includes(s)}
              onChange={() => toggle(selectedSegments, setSelectedSegments, s)} className="text-red-600 rounded" />
            <span className="text-sm text-gray-600">{s}</span>
          </label>
        ))}
      </div>

      {/* Brand */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Brand</p>
        {BRANDS.map(b => (
          <label key={b} className="flex items-center gap-2 py-1.5 cursor-pointer">
            <input type="checkbox" checked={selectedBrands.includes(b)}
              onChange={() => toggle(selectedBrands, setSelectedBrands, b)} className="text-red-600 rounded" />
            <span className="text-sm text-gray-600">{b}</span>
          </label>
        ))}
      </div>

      {/* Fuel */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Fuel Type</p>
        {FUELS.map(f => (
          <label key={f} className="flex items-center gap-2 py-1.5 cursor-pointer">
            <input type="checkbox" checked={selectedFuels.includes(f)}
              onChange={() => toggle(selectedFuels, setSelectedFuels, f)} className="text-red-600 rounded" />
            <span className="text-sm text-gray-600">{f}</span>
          </label>
        ))}
      </div>

      {/* Transmission */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Transmission</p>
        {TRANSMISSIONS.map(t => (
          <label key={t} className="flex items-center gap-2 py-1.5 cursor-pointer">
            <input type="radio" name="transmission" value={t} checked={selectedTransmission === t}
              onChange={e => setSelectedTransmission(e.target.value)} className="text-red-600" />
            <span className="text-sm text-gray-600">{t}</span>
          </label>
        ))}
        {selectedTransmission && <button onClick={() => setSelectedTransmission('')} className="text-xs text-gray-400 hover:text-red-500 mt-1">Clear</button>}
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Cars</h1>
          <p className="text-gray-500 text-sm">{filtered.length} cars found</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search cars..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 w-full sm:w-48" />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400">
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <button onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilters > 0 && <span className="bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{activeFilters}</span>}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar - Desktop */}
        <div className="hidden md:block w-52 shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-20">
            <FilterSidebar />
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {showFilters && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        )}

        {/* Cars Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <CarIcon className="w-16 h-16 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">No cars found matching your filters</p>
              <button onClick={clearAll} className="mt-3 text-red-600 text-sm hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(car => (
                <Link key={car.id} href={`/cars/${car.slug}`}>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5 group cursor-pointer">
                    <div className="relative aspect-video bg-gray-100">
                      {car.photos[0] ? (
                        <img src={car.photos[0]} alt={car.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CarIcon className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      {car.isSold && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="bg-red-600 text-white font-bold text-lg px-6 py-2 rotate-[-15deg] shadow-lg">SOLD</div>
                        </div>
                      )}
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {formatPrice(car.price)}
                      </span>
                      {car.priceNegotiable && <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Negotiable</span>}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate text-sm">{car.title}</h3>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {[`${car.year}`, `${(car.kmDriven / 1000).toFixed(0)}K km`, car.fuelType, car.transmission].map(tag => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
