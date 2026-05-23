import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCars, fetchFeaturedCars, fetchCarStats, fetchBrands } from '@/lib/queries'
import { Car, CarFilters } from '@/types'
import { fmt, waLink } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import CarCard from '@/components/CarCard'
import FilterPanel from '@/components/FilterPanel'
import CompareView from '@/components/CompareView'
import PoweredBy from '@/components/PoweredBy'
import { ChevronLeft, ChevronRight, Shield, Star, TrendingUp, Phone, Tag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const SORT_OPTIONS = [
  { value:'created_at.desc', label:'Newest First' },
  { value:'price.asc', label:'Price: Low to High' },
  { value:'price.desc', label:'Price: High to Low' },
  { value:'year.desc', label:'Year: Newest' },
  { value:'km_driven.asc', label:'Lowest KM' },
]

const TESTIMONIALS = [
  { name:'Ramesh Gupta', city:'Jhansi', text:'Bilkul sahi gaadi mili. No hidden charges. Highly recommended!', rating:5, car:'Maruti Swift' },
  { name:'Priya Sharma', city:'Lalitpur', text:'Very transparent dealing. Got exactly what was shown online.', rating:5, car:'Honda City' },
  { name:'Ajay Verma', city:'Jhansi', text:'Best used car dealer in Bundelkhand. Honest and helpful.', rating:5, car:'Hyundai Creta' },
  { name:'Sunita Yadav', city:'Sagar', text:'Came from Sagar after seeing the site. Worth every km!', rating:4, car:'Tata Nexon' },
]

export default function Home() {
  const [searchParams] = useSearchParams()
  const nav = useNavigate()
  const [filters,setFilters] = useState<Partial<CarFilters>>({ show_sold:false })
  const [sort,setSort] = useState('created_at.desc')
  const [page,setPage] = useState(1)
  const [compareList,setCompareList] = useState<Car[]>([])
  const [showCompare,setShowCompare] = useState(false)

  useEffect(()=>{ const s=searchParams.get('search'); if(s) setFilters(f=>({...f,search:s})) },[])

  const { data:carsData,isLoading } = useQuery({
    queryKey:['cars',filters,sort,page],
    queryFn:()=>fetchCars(filters,page),
    placeholderData:prev=>prev,
  })
  const { data:featured } = useQuery({ queryKey:['featured'], queryFn:()=>fetchFeaturedCars(4) })
  const { data:stats } = useQuery({ queryKey:['stats'], queryFn:fetchCarStats })
  const { data:brands } = useQuery({ queryKey:['brands'], queryFn:fetchBrands })

  const totalPages = Math.ceil((carsData?.total||0)/20)

  const handleFilters = useCallback((f:Partial<CarFilters>)=>{ setFilters(f); setPage(1) },[])
  const toggleCompare = (car:Car) => setCompareList(l=>l.find(x=>x.id===car.id)?l.filter(x=>x.id!==car.id):l.length>=2?[l[1],car]:[...l,car])

  return (
    <div style={{ background:'#F8F9FC',minHeight:'100vh' }}>
      <Navbar compareCount={compareList.length} onCompareClick={()=>setShowCompare(true)}/>

      {/* Hero */}
      <div style={{ paddingTop:64,background:'#fff',borderBottom:'1px solid #E8ECF0' }}>
        <div style={{ maxWidth:1200,margin:'0 auto',padding:'60px 24px 56px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'center' }}>
          <div>
            <div style={{ background:'#FFF3E8',border:'1px solid #FFD5B0',display:'inline-block',borderRadius:20,padding:'5px 14px',fontSize:12,color:'#FF6B00',fontWeight:700,letterSpacing:2,marginBottom:20 }}>
              JHANSI'S #1 TRUSTED USED CAR PLATFORM
            </div>
            <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:'clamp(28px,4vw,52px)',fontWeight:800,lineHeight:1.1,marginBottom:16,color:'#1A1A2E' }}>
              Buy & Sell<br/><span style={{ color:'#FF6B00' }}>Used Cars</span><br/>with Confidence
            </h1>
            <p style={{ color:'#64748B',fontSize:16,lineHeight:1.7,marginBottom:32,maxWidth:440 }}>
              100% verified cars. Transparent pricing. AI-powered valuations. Trusted across Bundelkhand.
            </p>
            <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
              <button onClick={()=>document.getElementById('cars')?.scrollIntoView({behavior:'smooth'})} className="btn-primary" style={{ fontSize:15,padding:'13px 28px',display:'flex',alignItems:'center',gap:8 }}>
                Browse Cars <ArrowRight size={16}/>
              </button>
              <Link to="/sell" style={{ background:'#fff',border:'2px solid #FF6B00',color:'#FF6B00',borderRadius:10,padding:'13px 24px',textDecoration:'none',fontWeight:700,fontSize:15,display:'flex',alignItems:'center',gap:8 }}>
                <Tag size={16}/> Sell Your Car
              </Link>
            </div>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
            {[
              { icon:'🚗', label:'Cars Available', value:stats?.available??'…', color:'#FF6B00' },
              { icon:'⭐', label:'Avg Rating', value:'4.9★', color:'#F59E0B' },
              { icon:'✅', label:'Verified Cars', value:'100%', color:'#16A34A' },
              { icon:'💰', label:'Hidden Charges', value:'Zero', color:'#3B82F6' },
            ].map(s=>(
              <div key={s.label} style={{ background:'#F8F9FC',border:'1px solid #E8ECF0',borderRadius:16,padding:'20px 16px',textAlign:'center' }}>
                <div style={{ fontSize:32,marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:24,color:s.color }}>{s.value}</div>
                <div style={{ color:'#94A3B8',fontSize:12,marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search bar below hero */}
      <div style={{ background:'#fff',borderBottom:'1px solid #E8ECF0',padding:'16px 24px' }}>
        <div style={{ maxWidth:680,margin:'0 auto',display:'flex',background:'#F8F9FC',borderRadius:12,border:'1.5px solid #E8ECF0',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <input placeholder="Search by brand, model, color..." value={filters.search||''}
            onChange={e=>handleFilters({...filters,search:e.target.value})}
            style={{ flex:1,background:'none',border:'none',padding:'13px 18px',fontSize:15,color:'#1A1A2E',outline:'none' }}/>
          <button onClick={()=>document.getElementById('cars')?.scrollIntoView({behavior:'smooth'})}
            style={{ background:'#FF6B00',border:'none',padding:'0 28px',cursor:'pointer',color:'#fff',fontWeight:700,fontSize:14,fontFamily:'DM Sans,sans-serif' }}>
            Search
          </button>
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ background:'#1A1A2E',padding:'14px 24px' }}>
        <div style={{ maxWidth:1200,margin:'0 auto',display:'flex',justifyContent:'center',gap:'clamp(16px,4vw,56px)',flexWrap:'wrap' }}>
          {[[<Shield size={15}/>, 'Verified Cars'],[<Star size={15}/>, 'No Hidden Charges'],[<TrendingUp size={15}/>, 'Best Market Price'],[<Phone size={15}/>, 'WhatsApp Support']].map(([icon,label])=>(
            <div key={String(label)} style={{ display:'flex',alignItems:'center',gap:8,color:'rgba(255,255,255,0.7)',fontSize:13 }}>
              <span style={{ color:'#FF6B00' }}>{icon as React.ReactNode}</span>{String(label)}
            </div>
          ))}
        </div>
      </div>

      {/* Sell Your Car CTA Banner */}
      <div style={{ maxWidth:1200,margin:'40px auto 0',padding:'0 24px' }}>
        <div style={{ background:'linear-gradient(135deg,#FF6B00,#E55A00)',borderRadius:20,padding:'28px 32px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:20 }}>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:22,color:'#fff',marginBottom:6 }}>Sell Your Car & Get Instant AI Valuation</div>
            <div style={{ color:'rgba(255,255,255,0.85)',fontSize:14 }}>Know your car's true market value in seconds. Free inspection available.</div>
          </div>
          <Link to="/sell" style={{ background:'#fff',color:'#FF6B00',borderRadius:10,padding:'12px 24px',fontWeight:800,textDecoration:'none',fontSize:15,display:'flex',alignItems:'center',gap:8,flexShrink:0,fontFamily:'Syne,sans-serif' }}>
            Get Free Valuation <ArrowRight size={16}/>
          </Link>
        </div>
      </div>

      {/* Hot Deals */}
      {featured && featured.length>0&&(
        <div style={{ maxWidth:1200,margin:'48px auto 0',padding:'0 24px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
            <h2 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(18px,2.5vw,26px)',color:'#1A1A2E',margin:0 }}>🔥 Hot Deals</h2>
            <button onClick={()=>{ handleFilters({is_hot_deal:true}); document.getElementById('cars')?.scrollIntoView({behavior:'smooth'}) }}
              style={{ background:'none',border:'1px solid #E8ECF0',color:'#64748B',borderRadius:8,padding:'7px 14px',cursor:'pointer',fontSize:13,fontFamily:'DM Sans,sans-serif',display:'flex',alignItems:'center',gap:6 }}>
              View All <ArrowRight size={13}/>
            </button>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:18 }}>
            {featured.map(car=><CarCard key={car.id} car={car} onView={c=>nav(`/car/${c.id}`)} onCompare={toggleCompare} isComparing={!!compareList.find(x=>x.id===car.id)}/>)}
          </div>
        </div>
      )}

      {/* Browse All */}
      <div id="cars" style={{ maxWidth:1200,margin:'48px auto 0',padding:'0 24px 60px' }}>
        <h2 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(18px,2.5vw,26px)',color:'#1A1A2E',marginBottom:20 }}>Browse All Cars</h2>
        <FilterPanel filters={filters} onChange={handleFilters} brands={brands} total={carsData?.total||0}/>
        <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:16 }}>
          <select value={sort} onChange={e=>{ setSort(e.target.value); setPage(1) }}
            style={{ background:'#fff',border:'1.5px solid #E8ECF0',color:'#1A1A2E',borderRadius:8,padding:'8px 14px',outline:'none',fontSize:13,cursor:'pointer' }}>
            {SORT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {isLoading ? (
          <div style={{ padding:'80px 0',textAlign:'center' }}>
            <div className="spinner"/><div style={{ color:'#94A3B8',marginTop:16,fontSize:14 }}>Loading cars...</div>
          </div>
        ) : carsData?.data.length===0 ? (
          <div style={{ textAlign:'center',padding:'80px 0' }}>
            <div style={{ fontSize:48,marginBottom:16 }}>🔍</div>
            <div style={{ fontSize:18,color:'#64748B',marginBottom:16 }}>No cars found</div>
            <button onClick={()=>handleFilters({show_sold:false})} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:18 }}>
              {carsData?.data.map(car=><CarCard key={car.id} car={car} onView={c=>nav(`/car/${c.id}`)} onCompare={toggleCompare} isComparing={!!compareList.find(x=>x.id===car.id)}/>)}
            </div>
            {totalPages>1&&(
              <div style={{ display:'flex',justifyContent:'center',alignItems:'center',gap:8,marginTop:40 }}>
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                  style={{ background:'#fff',border:'1px solid #E8ECF0',color:page===1?'#CBD5E1':'#1A1A2E',borderRadius:8,padding:'8px 14px',cursor:page===1?'default':'pointer',boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
                  <ChevronLeft size={16}/>
                </button>
                {Array.from({length:Math.min(totalPages,7)},(_,i)=>i+1).map(p=>(
                  <button key={p} onClick={()=>setPage(p)}
                    style={{ background:p===page?'#FF6B00':'#fff',border:`1px solid ${p===page?'#FF6B00':'#E8ECF0'}`,color:p===page?'#fff':'#1A1A2E',borderRadius:8,padding:'8px 14px',cursor:'pointer',fontWeight:p===page?700:400,minWidth:40,boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
                    {p}
                  </button>
                ))}
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                  style={{ background:'#fff',border:'1px solid #E8ECF0',color:page===totalPages?'#CBD5E1':'#1A1A2E',borderRadius:8,padding:'8px 14px',cursor:page===totalPages?'default':'pointer',boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
                  <ChevronRight size={16}/>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Testimonials */}
      <div style={{ background:'#fff',borderTop:'1px solid #E8ECF0',padding:'60px 24px' }}>
        <div style={{ maxWidth:1200,margin:'0 auto' }}>
          <h2 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(18px,2.5vw,26px)',textAlign:'center',color:'#1A1A2E',marginBottom:8 }}>What Customers Say</h2>
          <p style={{ color:'#94A3B8',textAlign:'center',marginBottom:36,fontSize:14 }}>Trusted by thousands across Bundelkhand</p>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:16 }}>
            {TESTIMONIALS.map(t=>(
              <div key={t.name} style={{ background:'#F8F9FC',border:'1px solid #E8ECF0',borderRadius:16,padding:20 }}>
                <div style={{ color:'#F59E0B',marginBottom:10,fontSize:16 }}>{'★'.repeat(t.rating)}{'☆'.repeat(5-t.rating)}</div>
                <p style={{ color:'#475569',fontSize:14,lineHeight:1.65,marginBottom:14 }}>"{t.text}"</p>
                <div style={{ borderTop:'1px solid #E8ECF0',paddingTop:12 }}>
                  <div style={{ color:'#1A1A2E',fontWeight:600,fontSize:14 }}>{t.name}</div>
                  <div style={{ color:'#94A3B8',fontSize:12 }}>{t.city} · Bought {t.car}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background:'#1A1A2E',color:'#fff',padding:'44px 24px 0',textAlign:'center' }}>
        <div style={{ maxWidth:600,margin:'0 auto' }}>
          <div style={{ fontFamily:'Syne,sans-serif',fontSize:24,fontWeight:800,marginBottom:8 }}>Wheels<span style={{ color:'#FF6B00' }}>Drive</span></div>
          <p style={{ color:'rgba(255,255,255,0.5)',fontSize:13,marginBottom:20 }}>Near ITI Chowk, Jhansi, UP · Open Mon–Sun 9AM–7PM</p>
          <a href={waLink('Hi, I want to inquire about a car.')} target="_blank" rel="noreferrer"
            style={{ display:'inline-block',background:'#16A34A',color:'#fff',borderRadius:12,padding:'12px 28px',fontWeight:700,textDecoration:'none',fontSize:15,marginBottom:24 }}>
            📱 WhatsApp: +91 95063 65650
          </a>
          <div style={{ color:'rgba(255,255,255,0.2)',fontSize:12,marginBottom:0 }}>© 2025 WheelsDrive. All rights reserved.</div>
        </div>
        <PoweredBy/>
      </footer>

      <a href={waLink('Hi!')} target="_blank" rel="noreferrer"
        style={{ position:'fixed',bottom:24,right:24,background:'#16A34A',color:'#fff',borderRadius:'50%',width:56,height:56,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,textDecoration:'none',boxShadow:'0 4px 20px rgba(22,163,74,0.4)',zIndex:400 }}>
        💬
      </a>
      {showCompare&&<CompareView cars={compareList} onRemove={id=>setCompareList(l=>l.filter(x=>x.id!==id))} onClose={()=>setShowCompare(false)}/>}
    </div>
  )
}
