import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchSettings, updateSettings } from '@/lib/queries'
import { Save, Loader } from 'lucide-react'

export default function AdminSettings() {
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: fetchSettings })
  const [form, setForm] = useState({ dealer_name: '', address: '', whatsapp: '', about: '', logo_url: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (settings) setForm({ dealer_name: settings.dealer_name || '', address: settings.address || '', whatsapp: settings.whatsapp || '', about: settings.about || '', logo_url: settings.logo_url || '' })
  }, [settings])

  const mut = useMutation({
    mutationFn: () => updateSettings(form),
    onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2500) },
  })

  const F = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="card" style={{ padding: 24, marginBottom: 20 }}>
      <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 17, color: '#fff', marginBottom: 20 }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  )

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label style={{ color: '#666', fontSize: 11, letterSpacing: 1, display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, color: '#fff', marginBottom: 4 }}>Settings</h1>
        <p style={{ color: '#555', fontSize: 13 }}>Manage your dealership info shown on the site</p>
      </div>

      <Section title="Dealer Information">
        <Field label="DEALERSHIP NAME">
          <input value={form.dealer_name} onChange={e => F('dealer_name', e.target.value)} placeholder="WheelsDrive" />
        </Field>
        <Field label="ADDRESS">
          <input value={form.address} onChange={e => F('address', e.target.value)} placeholder="Near ITI Chowk, Jhansi, UP" />
        </Field>
        <Field label="WHATSAPP NUMBER (with country code)">
          <input value={form.whatsapp} onChange={e => F('whatsapp', e.target.value)} placeholder="919506365650" />
        </Field>
      </Section>

      <Section title="About">
        <Field label="ABOUT TEXT (shown on site)">
          <textarea value={form.about} onChange={e => F('about', e.target.value)}
            placeholder="Describe your dealership..." style={{ minHeight: 100, resize: 'vertical' }} />
        </Field>
        <Field label="LOGO URL (optional)">
          <input value={form.logo_url} onChange={e => F('logo_url', e.target.value)} placeholder="https://..." />
        </Field>
      </Section>

      {/* Supabase Setup Guide */}
      <div className="card" style={{ padding: 24, marginBottom: 20, border: '1px solid #7c3aed44' }}>
        <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 17, color: '#fff', marginBottom: 16 }}>
          🔧 Supabase Setup Guide
        </h3>
        <div style={{ color: '#888', fontSize: 13, lineHeight: 1.8 }}>
          <p style={{ marginBottom: 12 }}>Run this SQL in your Supabase SQL editor to set up the database:</p>
          <div style={{ background: '#0d0d20', borderRadius: 10, padding: 16, fontFamily: 'monospace', fontSize: 12, color: '#9999bb', overflowX: 'auto', whiteSpace: 'pre', border: '1px solid #1e1e3a' }}>{SETUP_SQL}</div>
          <p style={{ marginTop: 12, color: '#555' }}>Also create a Storage bucket named <strong style={{ color: '#fff' }}>car-images</strong> with public access enabled.</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        {saved && <div style={{ background: '#16a34a22', border: '1px solid #16a34a44', color: '#16a34a', borderRadius: 8, padding: '10px 16px', fontSize: 13 }}>✓ Settings saved</div>}
        <button onClick={() => mut.mutate()} disabled={mut.isPending} className="btn-red"
          style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: mut.isPending ? 0.7 : 1 }}>
          {mut.isPending ? <><Loader size={15} style={{ animation: 'spin 0.7s linear infinite' }} /> Saving...</> : <><Save size={15} /> Save Settings</>}
        </button>
      </div>
    </div>
  )
}

const SETUP_SQL = `-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Maruti',
  model TEXT DEFAULT '',
  year INTEGER NOT NULL DEFAULT 2020,
  price INTEGER NOT NULL,
  km_driven INTEGER NOT NULL DEFAULT 0,
  fuel TEXT NOT NULL DEFAULT 'Petrol',
  transmission TEXT NOT NULL DEFAULT 'Manual',
  condition TEXT NOT NULL DEFAULT 'Good',
  color TEXT DEFAULT '',
  owners INTEGER DEFAULT 1,
  segment TEXT DEFAULT 'Hatchback',
  price_category TEXT DEFAULT 'Economy',
  is_hot_deal BOOLEAN DEFAULT false,
  is_sold BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  description TEXT DEFAULT '',
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Full-text search vector
ALTER TABLE cars ADD COLUMN IF NOT EXISTS
  search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(title,'') || ' ' ||
      coalesce(brand,'') || ' ' ||
      coalesce(model,'') || ' ' ||
      coalesce(color,'') || ' ' ||
      coalesce(segment,'') || ' ' ||
      coalesce(description,'')
    )
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_cars_search ON cars USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_segment ON cars(segment);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_is_sold ON cars(is_sold);
CREATE INDEX IF NOT EXISTS idx_cars_is_hot ON cars(is_hot_deal);
CREATE INDEX IF NOT EXISTS idx_cars_created ON cars(created_at DESC);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
  car_title TEXT DEFAULT '',
  customer_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  message TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  dealer_name TEXT DEFAULT 'WheelsDrive',
  address TEXT DEFAULT 'Near ITI Chowk, Jhansi, UP',
  whatsapp TEXT DEFAULT '919506365650',
  about TEXT DEFAULT '',
  logo_url TEXT DEFAULT ''
);

INSERT INTO settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Increment views function
CREATE OR REPLACE FUNCTION increment_views(car_id UUID)
RETURNS void AS $$
  UPDATE cars SET views = views + 1 WHERE id = car_id;
$$ LANGUAGE sql;

-- RLS: Enable public read, admin write
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read cars"
  ON cars FOR SELECT USING (true);

CREATE POLICY "Auth users manage cars"
  ON cars FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can insert inquiries"
  ON inquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth users manage inquiries"
  ON inquiries FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read settings"
  ON settings FOR SELECT USING (true);

CREATE POLICY "Auth users manage settings"
  ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Storage bucket: create manually in Supabase Dashboard
-- Bucket name: car-images (Public bucket)`
