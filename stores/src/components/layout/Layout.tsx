import { Link, useLocation } from 'wouter'
import { Car, Phone, Mail, MapPin, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [location] = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-red-600 p-1.5 rounded">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg leading-none">WheelsDrive</span>
              <p className="text-xs text-gray-500 leading-none">Jhansi</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className={`text-sm font-medium transition-colors ${location === '/' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}>Home</Link>
            <Link href="/cars" className={`text-sm font-medium transition-colors ${location.startsWith('/cars') ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}>Browse Cars</Link>
            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">Contact</a>
            <a href="https://wa.me/919506365650" target="_blank" rel="noopener noreferrer"
              className="bg-green-500 text-white text-sm px-4 py-2 rounded-full font-medium hover:bg-green-600 transition-colors flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-3">
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-2">Home</Link>
            <Link href="/cars" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-2">Browse Cars</Link>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-2">Contact</a>
            <a href="https://wa.me/919506365650" target="_blank" rel="noopener noreferrer"
              className="bg-green-500 text-white text-sm px-4 py-2 rounded-full font-medium text-center">
              WhatsApp Us
            </a>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6" id="contact">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-red-600 p-1.5 rounded">
                  <Car className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-lg">WheelsDrive</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Trusted second hand car dealer in Jhansi. Quality vehicles at best prices. Buy with confidence.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</Link>
                <Link href="/cars" className="text-sm text-gray-400 hover:text-white transition-colors">Browse Cars</Link>
                <Link href="/cars?segment=SUV" className="text-sm text-gray-400 hover:text-white transition-colors">SUVs</Link>
                <Link href="/cars?segment=Sedan" className="text-sm text-gray-400 hover:text-white transition-colors">Sedans</Link>
              </div>
            </div>

            <div id="contact-info">
              <h3 className="text-white font-semibold mb-3">Contact</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-400">Near ITI, Jhansi, Uttar Pradesh</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-400 shrink-0" />
                  <a href="tel:9506365650" className="text-sm text-gray-400 hover:text-white">Garvit: +91 95063 65650</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red-400 shrink-0" />
                  <a href="mailto:clerkneu@gmail.com" className="text-sm text-gray-400 hover:text-white">clerkneu@gmail.com</a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-xs text-gray-500">© 2025 WheelsDrive. All rights reserved.</p>
            <p className="text-xs text-gray-500">Powered by <span className="text-red-400 font-medium">Clerkneu Technology and Solutions</span></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
