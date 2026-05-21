import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { getCars, getCarById, saveCar, generateId, generateSlug } from '../../lib/data'
import { Car } from '../../lib/types'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import { Link } from 'wouter'

const BRANDS = ['Maruti', 'Hyundai', 'Tata', 'Honda', 'Toyota', 'Ford', 'Mahindra', 'Volkswagen', 'Skoda', 'Renault', 'Nissan', 'Kia', 'MG', 'Jeep', 'Others']
const SEGMENTS = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Luxury']
const FUELS = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']
const TRANSMISSIONS = ['Manual', 'Automatic']
const CONDITIONS = ['Excellent', 'Good', 'Fair']

const EMPTY: Omit<Car, 'id' | 'createdAt'> = {
  title: '', slug: '', description: '', price: 0, priceNegotiable: true,
  brand: 'Maruti', model: '', year: new Date().getFullYear(), kmDriven: 0,
  fuelType: 'Petrol', transmission: 'Manual', color: '', engineCC: 1197,
  segment: 'Hatchback', condition: 'Good', owners: 1,
  photos: [], isSold: false, isFeatured: false, whatsapp: '9506365650',
}

export default function AdminCarEdit({ params }: { params?: { id?: string } }) {
  const [, navigate] = useLocation()
  const isEdit = params?.id && params.id !== 'add'
  const [form, setForm] = useState<Omit<Car, 'id' | 'createdAt'>>(EMPTY)
  const [photoUrl, setPhotoUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isEdit) {
      const car = getCarById(params!.id!)
      if (car) {
        const { id, createdAt, ...rest } = car
        setForm(rest)
      }
    }
  }, [])

  function set(key: keyof typeof form, val: any) {
    setForm(prev => {
      const updated = { ...prev, [key]: val }
      if (key === 'title') updated.slug = generateSlug(val)
      return updated
    })
  }

  function addPhoto() {
    if (photoUrl.trim()) {
      setForm(prev => ({ ...prev, photos: [...prev.photos, photoUrl.trim()] }))
      setPhotoUrl('')
    }
  }

  function removePhoto(i: number) {
    setForm(prev => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== i) }))
  }

  async function handleSave() {
    if (!form.title || !form.brand || !form.model || form.price <= 0) {
      alert('Please fill: Title, Brand, Model, Price')
      return
    }
    setSaving(true)
    const car: Car = {
      ...form,
      id: isEdit ? params!.id! : generateId(),
      createdAt: isEdit ? (getCarById(params!.id!)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    }
    saveCar(car)
    setSaved(true)
    setSaving(false)
    setTimeout(() => navigate('/admin/cars'), 800)
  }

  const field = (label: string, node: React.ReactNode, required = false) => (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {node}
    </div>
  )

  const inp = (key: keyof typeof form, type = 'text', placeholder = '') => (
    <input type={type} value={form[key] as string} placeholder={placeholder}
      onChange={e => set(key, type === 'number' ? Number(e.target.value) : e.target.value)}
      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-400" />
  )

  const sel = (key: keyof typeof form, options: string[]) => (
    <select value={form[key] as string} onChange={e => set(key, e.target.value)}
      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-400 bg-white">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/cars" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Car' : 'Add New Car'}</h1>
          <p className="text-gray-500 text-sm">{isEdit ? 'Update car details' : 'Fill in all car details'}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Title', inp('title', 'text', '2021 Maruti Swift VXI'), true)}
            {field('Slug (auto)', <input value={form.slug} readOnly className="w-full border border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-400" />)}
            {field('Brand', sel('brand', BRANDS), true)}
            {field('Model', inp('model', 'text', 'Swift'), true)}
            {field('Year', inp('year', 'number'), true)}
            {field('Color', inp('color', 'text', 'Pearl White'))}
            {field('Engine (CC)', inp('engineCC', 'number'))}
            {field('Previous Owners', inp('owners', 'number'))}
          </div>
          {field('Description', (
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Describe the car condition, features, history..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-400 resize-none" />
          ))}
        </div>

        {/* Pricing */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Price (₹)', inp('price', 'number'), true)}
            {field('Price Negotiable', (
              <div className="flex items-center gap-3 mt-1">
                <button onClick={() => set('priceNegotiable', true)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${form.priceNegotiable ? 'bg-green-500 text-white border-green-500' : 'border-gray-200 text-gray-600'}`}>
                  Yes
                </button>
                <button onClick={() => set('priceNegotiable', false)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${!form.priceNegotiable ? 'bg-red-500 text-white border-red-500' : 'border-gray-200 text-gray-600'}`}>
                  No
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Specs */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('KM Driven', inp('kmDriven', 'number'), true)}
            {field('Fuel Type', sel('fuelType', FUELS), true)}
            {field('Transmission', sel('transmission', TRANSMISSIONS), true)}
            {field('Segment', sel('segment', SEGMENTS), true)}
            {field('Condition', sel('condition', CONDITIONS))}
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Photos</h2>
          <div className="flex gap-2 mb-4">
            <input value={photoUrl} onChange={e => setPhotoUrl(e.target.value)}
              placeholder="Paste image URL here..."
              onKeyDown={e => e.key === 'Enter' && addPhoto()}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-400" />
            <button onClick={addPhoto}
              className="bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {form.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {form.photos.map((p, i) => (
                <div key={i} className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden group">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2">Tip: Use car image URLs from Google or car websites</p>
        </div>

        {/* Status */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Status & Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('WhatsApp Number', inp('whatsapp', 'tel'))}
            <div />
            {field('Car Status', (
              <div className="flex gap-2 mt-1">
                <button onClick={() => set('isSold', false)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${!form.isSold ? 'bg-green-500 text-white border-green-500' : 'border-gray-200 text-gray-600'}`}>
                  Available
                </button>
                <button onClick={() => set('isSold', true)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${form.isSold ? 'bg-red-500 text-white border-red-500' : 'border-gray-200 text-gray-600'}`}>
                  Sold
                </button>
              </div>
            ))}
            {field('Featured', (
              <div className="flex gap-2 mt-1">
                <button onClick={() => set('isFeatured', true)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${form.isFeatured ? 'bg-amber-500 text-white border-amber-500' : 'border-gray-200 text-gray-600'}`}>
                  Yes — Show on Homepage
                </button>
                <button onClick={() => set('isFeatured', false)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${!form.isFeatured ? 'bg-gray-200 text-gray-600 border-gray-200' : 'border-gray-200 text-gray-600'}`}>
                  No
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <button onClick={handleSave} disabled={saving || saved}
          className={`w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-colors text-lg ${saved ? 'bg-green-500' : 'bg-red-600 hover:bg-red-700 disabled:opacity-60'}`}>
          <Save className="w-5 h-5" />
          {saved ? 'Saved! Redirecting...' : saving ? 'Saving...' : isEdit ? 'Update Car' : 'Add Car'}
        </button>
      </div>
    </div>
  )
}
