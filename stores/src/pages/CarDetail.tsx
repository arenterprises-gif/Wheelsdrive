import { getCarBySlug, getCars, formatPrice } from '../lib/data'
import { Link } from 'wouter'
import { Car as CarIcon, Phone, ChevronRight, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { openWhatsApp } from '../lib/whatsapp'

export default function CarDetail({ params }: { params: { slug: string } }) {
  const car = getCarBySlug(params.slug)
  const [activePhoto, setActivePhoto] = useState(0)

  if (!car) return (
    <div className="text-center py-16">
      <CarIcon className="w-16 h-16 text-gray-200 mx-auto mb-3" />
      <p className="text-gray-500">Car not found</p>
      <Link href="/cars" className="mt-3 text-red-600 text-sm hover:underline inline-block">Browse all cars</Link>
    </div>
  )

  const similar = getCars().filter(c => c.id !== car.id && (c.brand === car.brand || c.segment === car.segment) && !c.isSold).slice(0, 3)

  const specs = [
    ['Year', car.year.toString()],
    ['KM Driven', `${(car.kmDriven / 1000).toFixed(0)}K km`],
    ['Fuel Type', car.fuelType],
    ['Transmission', car.transmission],
    ['Engine', `${car.engineCC} cc`],
    ['Color', car.color],
    ['Owners', `${car.owners} Owner${car.owners > 1 ? 's' : ''}`],
    ['Condition', car.condition],
    ['Segment', car.segment],
  ]

  function handleWhatsApp() {
    openWhatsApp(car!.whatsapp, `Hi, I'm interested in *${car!.title}* (₹${formatPrice(car!.price)}). Is it still available?`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-red-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/cars" className="hover:text-red-600">Cars</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 truncate">{car.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Photos */}
        <div>
          <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
            {car.photos[activePhoto] ? (
              <img src={car.photos[activePhoto]} alt={car.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CarIcon className="w-20 h-20 text-gray-300" />
              </div>
            )}
            {car.isSold && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="bg-red-600 text-white font-bold text-2xl px-8 py-3 rotate-[-15deg] shadow-xl">SOLD</div>
              </div>
            )}
          </div>
          {car.photos.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {car.photos.map((p, i) => (
                <button key={i} onClick={() => setActivePhoto(i)}
                  className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${i === activePhoto ? 'border-red-500' : 'border-gray-200'}`}>
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{car.title}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-red-600">{formatPrice(car.price)}</span>
            {car.priceNegotiable && (
              <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4" /> Negotiable
              </span>
            )}
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
            {specs.map(([label, val]) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {car.description && (
            <div className="mb-5">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{car.description}</p>
            </div>
          )}

          {/* CTA */}
          {!car.isSold ? (
            <button onClick={handleWhatsApp}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-colors">
              <Phone className="w-5 h-5" /> WhatsApp: +91 {car.whatsapp}
            </button>
          ) : (
            <div className="w-full bg-gray-100 text-gray-500 py-4 rounded-xl font-semibold text-center">
              This car has been sold
            </div>
          )}

          {/* Mobile sticky WhatsApp */}
          {!car.isSold && (
            <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 lg:hidden z-40">
              <button onClick={handleWhatsApp}
                className="w-full bg-green-500 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" /> WhatsApp Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Similar Cars */}
      {similar.length > 0 && (
        <div className="mt-12 pb-20 lg:pb-0">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Similar Cars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {similar.map(c => (
              <Link key={c.id} href={`/cars/${c.slug}`}>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer group">
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    {c.photos[0] ? (
                      <img src={c.photos[0]} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : <div className="w-full h-full flex items-center justify-center"><CarIcon className="w-10 h-10 text-gray-300" /></div>}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.title}</p>
                    <p className="text-red-600 font-bold mt-1">{formatPrice(c.price)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
