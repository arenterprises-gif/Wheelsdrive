import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchSettings, updateSettings } from '@/lib/queries'
import { Save, Loader } from 'lucide-react'

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

export default function AdminSettings() {
  const { data:settings } = useQuery({ queryKey:['settings'], queryFn:fetchSettings })
  const [form,setForm] = useState({ dealer_name:'', address:'', whatsapp:'', about:'', logo_url:'' })
  const [saved,setSaved] = useState(false)

  useEffect(()=>{ if(settings) setForm({ dealer_name:settings.dealer_name||'', address:settings.address||'', whatsapp:settings.whatsapp||'', about:settings.about||'', logo_url:settings.logo_url||'' }) },[settings])

  const mut = useMutation({ mutationFn:()=>updateSettings(form), onSuccess:()=>{ setSaved(true); setTimeout(()=>setSaved(false),2500) } })
  const F=(k:string,v:string)=>setForm(f=>({...f,[k]:v}))

  return (
    <div style={{ maxWidth:600 }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:24,color:'#1A1A2E',marginBottom:4 }}>Settings</h1>
        <p style={{ color:'#64748B',fontSize:13 }}>Manage your dealership info</p>
      </div>

      <div className="card" style={{ padding:24,marginBottom:20 }}>
        <h3 style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:17,color:'#1A1A2E',marginBottom:20 }}>Dealer Information</h3>
        <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
          {[['DEALER NAME','dealer_name','WheelsDrive'],['ADDRESS','address','Near ITI Chowk, Jhansi, UP'],['WHATSAPP NUMBER','whatsapp','919506365650'],['LOGO URL','logo_url','https://...']].map(([l,k,ph])=>(
            <div key={k}><label style={{ color:'#94A3B8',fontSize:11,fontWeight:600,letterSpacing:0.5,display:'block',marginBottom:6 }}>{l}</label>
            <input value={form[k as keyof typeof form]} onChange={e=>F(k,e.target.value)} placeholder={ph}/></div>
          ))}
          <div><label style={{ color:'#94A3B8',fontSize:11,fontWeight:600,letterSpacing:0.5,display:'block',marginBottom:6 }}>ABOUT</label>
          <textarea value={form.about} onChange={e=>F('about',e.target.value)} style={{ minHeight:80,resize:'vertical' }} placeholder="About your dealership..."/></div>
        </div>
      </div>

      <div className="card" style={{ padding:24,marginBottom:20,border:'1px solid #E0E7FF' }}>
        <h3 style={{ fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:17,color:'#1A1A2E',marginBottom:12 }}>🔧 Supabase SQL Setup</h3>
        <p style={{ color:'#64748B',fontSize:13,marginBottom:12 }}>Run this in your Supabase SQL editor to create all tables (includes valuation tables):</p>
        <div style={{ background:'#F8F9FC',borderRadius:10,padding:16,fontFamily:'monospace',fontSize:11,color:'#475569',overflowX:'auto',whiteSpace:'pre',border:'1px solid #E8ECF0',maxHeight:300,overflowY:'auto' }}>{SETUP_SQL}</div>
        <p style={{ color:'#94A3B8',fontSize:12,marginTop:10 }}>Also create a Storage bucket named <strong>car-images</strong> with public access.</p>
      </div>

      <div style={{ display:'flex',justifyContent:'flex-end',gap:12 }}>
        {saved&&<div style={{ background:'#DCFCE7',border:'1px solid #BBF7D0',color:'#16A34A',borderRadius:8,padding:'10px 16px',fontSize:13 }}>✓ Saved</div>}
        <button onClick={()=>mut.mutate()} disabled={mut.isPending} className="btn-primary" style={{ display:'flex',alignItems:'center',gap:8 }}>
          {mut.isPending?<><Loader size={15} style={{ animation:'spin 0.7s linear infinite' }}/>Saving...</>:<><Save size={15}/>Save Settings</>}
        </button>
      </div>
    </div>
  )
}
