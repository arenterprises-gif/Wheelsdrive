import { Link } from 'wouter'
import { getCars, formatPrice } from '../lib/data'
import { Car, Search, Phone, MapPin, Star, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'wouter'

const SEGMENTS = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Luxury']
const BUDGET_RANGES = [
  { label: 'Under ₹2L', value: 'under-2l' },
  { label: '₹2L - ₹4L', value: '2l-4l' },
  { label: '₹4L - ₹6L', value: '4l-6l' },
  { label: '₹6L - ₹10L', value: '6l-10l' },
  { label: 'Above ₹10L', value: 'above-10l' },
]
const BRANDS = ['Maruti', 'Hyundai', 'Tata', 'Honda', 'Toyota', 'Ford', 'Others']

export default function Home() {
  const [search, setSearch] = useState('')
  const [, navigate] = useLocation()
  const cars = getCars()
  const featured = cars.filter(c => c.isFeatured && !c.isSold)
  const totalAvailable = cars.filter(c => !c.isSold).length

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) navigate(`/cars?search=${encodeURIComponent(search)}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-4 h-4 text-red-400 fill-red-400" />
            <span className="text-sm text-red-300">Jhansi's Most Trusted Car Dealer</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Find Your Perfect <span className="text-red-400">Used Car</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            {totalAvailable}+ quality verified cars available. Best prices, honest deals.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by car name, brand..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-400 backdrop-blur"
              />
            </div>
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-medium transition-colors whitespace-nowrap">
              Search
            </button>
          </form>

          {/* Quick stats */}
          <div className="flex justify-center gap-8 mt-10">
            {[['200+', 'Cars Sold'], ['5★', 'Rating'], ['2+', 'Years Trust']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-white">{num}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      {featured.length > 0 && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Featured Cars</h2>
                <p className="text-gray-500 text-sm mt-1">Hand-picked quality vehicles</p>
              </div>
              <Link href="/cars" className="flex items-center gap-1 text-red-600 text-sm font-medium hover:text-red-700">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.slice(0, 6).map(car => (
                <Link key={car.id} href={`/cars/${car.slug}`}>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5 group cursor-pointer">
                    <div className="relative aspect-video bg-gray-100">
                      {car.photos[0] ? (
                        <img src={car.photos[0]} alt={car.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {formatPrice(car.price)}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate">{car.title}</h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{car.year}</span>
                        <span>•</span>
                        <span>{(car.kmDriven / 1000).toFixed(0)}K km</span>
                        <span>•</span>
                        <span>{car.fuelType}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Budget Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Budget Wise</h2>
          <p className="text-gray-500 text-sm mb-6">Find cars in your budget range</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {BUDGET_RANGES.map(b => (
              <Link key={b.value} href={`/cars?price=${b.value}`}>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-red-300 hover:shadow-md transition-all cursor-pointer group">
                  <Car className="w-8 h-8 text-red-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold text-gray-800">{b.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Segment Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Segment</h2>
          <p className="text-gray-500 text-sm mb-6">Choose the type that fits your lifestyle</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {SEGMENTS.map(seg => {
              const count = cars.filter(c => c.segment === seg && !c.isSold).length
              return (
                <Link key={seg} href={`/cars?segment=${seg}`}>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5 text-center hover:from-red-50 hover:to-red-100 hover:border-red-200 transition-all cursor-pointer">
                    <p className="font-semibold text-gray-800">{seg}</p>
                    <p className="text-xs text-gray-500 mt-1">{count} available</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Brand Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Brands</h2>
          <p className="text-gray-500 text-sm mb-6">Shop by your favourite brand</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {BRANDS.map(brand => {
              const count = cars.filter(c => (brand === 'Others'
                ? !['Maruti', 'Hyundai', 'Tata', 'Honda', 'Toyota', 'Ford'].includes(c.brand)
                : c.brand === brand) && !c.isSold).length
              return (
                <Link key={brand} href={`/cars?brand=${brand}`}>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-red-300 hover:shadow-sm transition-all cursor-pointer">
                    <p className="text-sm font-semibold text-gray-800">{brand}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{count}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 bg-gray-900 text-white" id="contact">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Visit Us or Call Now</h2>
          <p className="text-gray-400 mb-8">We are open Monday to Saturday, 9 AM to 7 PM</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: <MapPin className="w-6 h-6 text-red-400" />, label: 'Location', val: 'Near ITI, Jhansi, UP' },
              { icon: <Phone className="w-6 h-6 text-red-400" />, label: 'Garvit', val: '+91 95063 65650' },
              { icon: <Phone className="w-6 h-6 text-red-400" />, label: 'Email', val: 'clerkneu@gmail.com' },
            ].map(item => (
              <div key={item.label} className="bg-gray-800 rounded-xl p-5 flex flex-col items-center gap-2">
                {item.icon}
                <p className="text-sm text-gray-400">{item.label}</p>
                <p className="font-semibold text-white">{item.val}</p>
              </div>
            ))}
          </div>
          <a href="https://wa.me/919506365650?text=Hi, I want to enquire about a car"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-full font-semibold transition-colors text-lg">
            <Phone className="w-5 h-5" /> WhatsApp: 9506365650
          </a>
        </div>
      </section>
    </div>
  )
}
