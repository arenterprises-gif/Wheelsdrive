import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchSettings, updateSettings } from '@/lib/queries'
import { Save, Loader, Check, Copy, Database } from 'lucide-react'

const SETUP_SQL = `-- Run in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL, brand TEXT DEFAULT 'Maruti', model TEXT DEFAULT '',
  year INTEGER DEFAULT 2020, price INTEGER NOT NULL, km_driven INTEGER DEFAULT 0,
  fuel TEXT DEFAULT 'Petrol', transmission TEXT DEFAULT 'Manual',
  condition TEXT DEFAULT 'Good', color TEXT DEFAULT '', owners INTEGER DEFAULT 1,
  segment TEXT DEFAULT 'Hatchback', price_category TEXT DEFAULT 'Economy',
  is_hot_deal BOOLEAN DEFAULT false, is_sold BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false, description TEXT DEFAULT '',
  features TEXT[] DEFAULT '{}', images TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(brand,'') || ' ' ||
    coalesce(model,'') || ' ' || coalesce(color,'') || ' ' || coalesce(description,''))
  ) STORED
);

CREATE INDEX IF NOT EXISTS idx_cars_search ON cars USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_sold ON cars(is_sold);
CREATE INDEX IF NOT EXISTS idx_cars_hot ON cars(is_hot_deal);

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
  car_title TEXT DEFAULT '', customer_name TEXT DEFAULT '',
  phone TEXT DEFAULT '', message TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS car_valuations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT, customer_phone TEXT, customer_email TEXT,
  brand TEXT, model TEXT, variant TEXT, year INTEGER,
  fuel TEXT, transmission TEXT, km_driven INTEGER, owners INTEGER,
  registration_city TEXT, insurance_valid BOOLEAN DEFAULT true,
  accident_history BOOLEAN DEFAULT false, service_history TEXT,
  exterior_condition TEXT, interior_condition TEXT,
  tire_condition TEXT, engine_condition TEXT,
  want_inspection BOOLEAN DEFAULT false,
  images JSONB DEFAULT '{}', report JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending', admin_note TEXT DEFAULT '',
  admin_override_price INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1, dealer_name TEXT DEFAULT 'WheelsDrive',
  address TEXT DEFAULT 'Near ITI Chowk, Jhansi, UP',
  whatsapp TEXT DEFAULT '919506365650', about TEXT DEFAULT '', logo_url TEXT DEFAULT ''
);

INSERT INTO settings (id) VALUES (1) ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION increment_views(car_id UUID)
RETURNS void AS $$ UPDATE cars SET views = views + 1 WHERE id = car_id; $$ LANGUAGE sql;

ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cars" ON cars FOR SELECT USING (true);
CREATE POLICY "Auth manage cars" ON cars FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public insert inquiry" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth manage inquiries" ON inquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public insert valuation" ON car_valuations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own valuation" ON car_valuations FOR SELECT USING (true);
CREATE POLICY "Auth manage valuations" ON car_valuations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Auth manage settings" ON settings FOR ALL USING (auth.role() = 'authenticated');`

const cardStyle: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: 16,
  padding: 24,
  marginBottom: 18,
  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
}

export default function AdminSettings() {
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: fetchSettings })
  const [form, setForm] = useState({ dealer_name: '', address: '', whatsapp: '', about: '', logo_url: '' })
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (settings) setForm({
      dealer_name: settings.dealer_name || '',
      address: settings.address || '',
      whatsapp: settings.whatsapp || '',
      about: settings.about || '',
      logo_url: settings.logo_url || '',
    })
  }, [settings])

  const mut = useMutation({
    mutationFn: () => updateSettings(form),
    onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2500) },
  })

  const F = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const copySQL = () => {
    navigator.clipboard.writeText(SETUP_SQL).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 26, color: '#111827', marginBottom: 4 }}>Settings</h1>
        <p style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 500 }}>Manage your dealership info</p>
      </div>

      {/* Dealer Info */}
      <div style={cardStyle}>
        <h3 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 17, color: '#111827', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid #F3F4F6' }}>
          🏪 Dealer Information
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            ['DEALER NAME',    'dealer_name', 'WheelsDrive'],
            ['ADDRESS',        'address',     'Near ITI Chowk, Jhansi, UP'],
            ['WHATSAPP NUMBER','whatsapp',    '919506365650'],
            ['LOGO URL',       'logo_url',    'https://...'],
          ].map(([l, k, ph]) => (
            <div key={k}>
              <label style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                {l}
              </label>
              <input
                value={form[k as keyof typeof form]}
                onChange={e => F(k, e.target.value)}
                placeholder={ph}
              />
            </div>
          ))}
          <div>
            <label style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
              ABOUT
            </label>
            <textarea
              value={form.about}
              onChange={e => F('about', e.target.value)}
              style={{ minHeight: 90, resize: 'vertical' }}
              placeholder="About your dealership..."
            />
          </div>
        </div>
      </div>

      {/* SQL Setup */}
      <div style={{ ...cardStyle, border: '1.5px solid #E0E7FF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 17, color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Database size={16} style={{ color: '#6366F1' }} /> Supabase SQL Setup
          </h3>
          <button
            onClick={copySQL}
            style={{
              background: copied ? '#ECFDF5' : '#F5F3FF',
              border: `1px solid ${copied ? '#BBF7D0' : '#DDD6FE'}`,
              color: copied ? '#059669' : '#7C3AED',
              borderRadius: 8, padding: '6px 12px',
              cursor: 'pointer', fontSize: 12, display: 'flex',
              alignItems: 'center', gap: 5, fontWeight: 700,
              transition: 'all 0.2s',
            }}>
            {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy SQL</>}
          </button>
        </div>
        <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 12, fontWeight: 500 }}>
          Run this in your Supabase SQL editor to create all tables (includes valuation tables):
        </p>
        <div style={{
          background: '#1E1E2E', borderRadius: 12, padding: '16px 18px',
          fontFamily: 'monospace', fontSize: 11, color: '#A8B2D8',
          overflowX: 'auto', whiteSpace: 'pre', border: '1px solid #2D2D44',
          maxHeight: 280, overflowY: 'auto', lineHeight: 1.6,
        }}>
          {SETUP_SQL}
        </div>
        <p style={{ color: '#9CA3AF', fontSize: 12, marginTop: 12 }}>
          Also create a Storage bucket named <strong style={{ color: '#6366F1' }}>car-images</strong> with public access.
        </p>
      </div>

      {/* Save */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'center' }}>
        {saved && (
          <div style={{ background: '#ECFDF5', border: '1px solid #BBF7D0', color: '#059669', borderRadius: 10, padding: '10px 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
            <Check size={14} /> Settings saved!
          </div>
        )}
        <button
          onClick={() => mut.mutate()}
          disabled={mut.isPending}
          style={{
            background: mut.isPending ? '#9CA3AF' : 'linear-gradient(135deg,#0052CC,#0066FF)',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '11px 24px', cursor: mut.isPending ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            fontWeight: 700, fontSize: 14, fontFamily: 'Nunito,sans-serif',
            boxShadow: mut.isPending ? 'none' : '0 4px 14px rgba(0,82,204,0.3)',
            transition: 'all 0.2s',
          }}>
          {mut.isPending
            ? <><Loader size={15} style={{ animation: 'spin 0.7s linear infinite' }} /> Saving...</>
            : <><Save size={15} /> Save Settings</>}
        </button>
      </div>
    </div>
  )
}
