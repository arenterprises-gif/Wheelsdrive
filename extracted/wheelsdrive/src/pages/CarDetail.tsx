import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCarById, fetchSimilarCars } from '@/lib/queries'
import { fmt, fmtKm, fmtFull, waLink } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import CarCard from '@/components/CarCard'
import EMIModal from '@/components/EMIModal'
import PoweredBy from '@/components/PoweredBy'
import { ChevronLeft, ChevronRight, MessageCircle, Calculator, Fuel, Gauge, Users, Calendar } from 'lucide-react'

export default function CarDetail() {
  const { id } = useParams<{ id:string }>()
  const nav = useNavigate()
  const [photo,setPhoto] = useState(0)
  const [showEMI,setShowEMI] = useState(false)
  const [compare,setCompare] = useState<import('@/types').Car[]>([])

  const { data:car,isLoading } = useQuery({ queryKey:['car',id], queryFn:()=>fetchCarById(id!), enabled:!!id })
  const { data:similar } = useQuery({ queryKey:['similar',id], queryFn:()=>fetchSimilarCars(car!), enabled:!!car })

  useEffect(()=>{ window.scrollTo(0,0) },[id])

  if(isLoading) return (
    <div style={{ background:'#F8F9FC',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <div className="spinner"/>
    </div>
  )
  if(!car) return (
    <div style={{ background:'#F8F9FC',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16 }}>
      <div style={{ fontSize:48 }}>🚗</div>
      <div style={{ color:'#64748B' }}>Car not found</div>
      <button onClick={()=>nav('/')} className="btn-primary">Go Back</button>
    </div>
  )

  const imgs = car.images?.length ? car.images : []
  const SPECS = [
    { icon:<Calendar size={16}/>, label:'Year', value:car.year },
    { icon:<Gauge size={16}/>, label:'KM Driven', value:fmtKm(car.km_driven) },
    { icon:<Fuel size={16}/>, label:'Fuel', value:car.fuel },
    { icon:<Users size={16}/>, label:'Owners', value:`${car.owners} Owner` },
    { label:'Transmission', value:car.transmission },
    { label:'Condition', value:car.condition },
    { label:'Color', value:car.color },
    { label:'Segment', value:car.segment },
    { label:'Price Category', value:car.price_category },
  ]

  return (
    <div style={{ background:'#F8F9FC',minHeight:'100vh' }}>
      <Navbar/>
      <div style={{ paddingTop:64,maxWidth:1100,margin:'0 auto',padding:'80px 24px 60px' }}>

        {/* Breadcrumb */}
        <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:24,color:'#94A3B8',fontSize:13 }}>
          <button onClick={()=>nav('/')} style={{ background:'none',border:'none',color:'#64748B',cursor:'pointer',display:'flex',alignItems:'center',gap:4,fontFamily:'Nunito,sans-serif',fontSize:13 }}>
            <ChevronLeft size={14}/> Home
          </button>
          <span>/</span><span style={{ color:'#1A1A2E' }}>{car.title}</span>
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:32 }}>
          {/* Gallery */}
          <div>
            <div style={{ borderRadius:16,overflow:'hidden',background:'#F1F5F9',height:300,position:'relative',border:'1px solid #E8ECF0',boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}>
              {imgs.length ? (
                <>
                  <img src={imgs[photo]} alt={car.title} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
                  {imgs.length>1&&(
                    <>
                      <button onClick={()=>setPhoto(p=>(p-1+imgs.length)%imgs.length)}
                        style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.9)',border:'none',borderRadius:8,padding:'8px 10px',cursor:'pointer',boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }}>
                        <ChevronLeft size={16} style={{ color:'#1A1A2E' }}/>
                      </button>
                      <button onClick={()=>setPhoto(p=>(p+1)%imgs.length)}
                        style={{ position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.9)',border:'none',borderRadius:8,padding:'8px 10px',cursor:'pointer',boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }}>
                        <ChevronRight size={16} style={{ color:'#1A1A2E' }}/>
                      </button>
                      <div style={{ position:'absolute',bottom:10,right:14,background:'rgba(0,0,0,0.5)',color:'#fff',fontSize:12,padding:'3px 10px',borderRadius:10 }}>
                        {photo+1}/{imgs.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',fontSize:90 }}>🚗</div>
              )}
              {car.is_sold&&(
                <div style={{ position:'absolute',inset:0,background:'rgba(0,0,0,0.55)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <div style={{ background:'#DC2626',color:'#fff',fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:28,padding:'12px 32px',borderRadius:12,transform:'rotate(-8deg)' }}>SOLD</div>
                </div>
              )}
            </div>
            {imgs.length>1&&(
              <div style={{ display:'flex',gap:8,marginTop:10,overflowX:'auto',paddingBottom:4 }}>
                {imgs.map((url,i)=>(
                  <img key={url} src={url} alt="" onClick={()=>setPhoto(i)}
                    style={{ width:72,height:52,objectFit:'cover',borderRadius:8,cursor:'pointer',border:i===photo?'2px solid #E8520A':'2px solid transparent',flexShrink:0,transition:'border-color 0.2s' }}/>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ color:'#E8520A',fontSize:12,fontWeight:700,letterSpacing:2,marginBottom:6 }}>{car.brand} · {car.segment}</div>
            <h1 style={{ fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:'clamp(20px,2.5vw,30px)',color:'#1A1A2E',marginBottom:4,lineHeight:1.2 }}>{car.title}</h1>
            <div style={{ color:'#94A3B8',fontSize:13,marginBottom:16 }}>{car.year} · {car.color}</div>
            <div style={{ display:'flex',alignItems:'baseline',gap:10,marginBottom:20 }}>
              <div style={{ fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:'clamp(24px,3vw,36px)',color:'#E8520A' }}>{fmt(car.price)}</div>
              <div style={{ color:'#94A3B8',fontSize:13 }}>{fmtFull(car.price)}</div>
            </div>

            {/* Quick stats */}
            <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:20 }}>
              {[
                [<Gauge size={18}/>, fmtKm(car.km_driven)],
                [<Fuel size={18}/>, car.fuel],
                [<Users size={18}/>, `${car.owners} Owner`],
                [<Calendar size={18}/>, car.year],
              ].map(([icon,val],i)=>(
                <div key={i} style={{ background:'#F8F9FC',border:'1px solid #E8ECF0',borderRadius:10,padding:'10px 8px',textAlign:'center' }}>
                  <div style={{ color:'#E8520A',marginBottom:4,display:'flex',justifyContent:'center' }}>{icon as React.ReactNode}</div>
                  <div style={{ color:'#1A1A2E',fontWeight:600,fontSize:12 }}>{String(val)}</div>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div style={{ display:'flex',gap:8,flexWrap:'wrap',marginBottom:20 }}>
              {car.is_hot_deal&&<span style={{ background:'#FFF3E8',color:'#E8520A',border:'1px solid #FFD5B0',fontSize:12,padding:'5px 12px',borderRadius:20,fontWeight:700 }}>🔥 Hot Deal</span>}
              {car.is_featured&&<span style={{ background:'#F3E8FF',color:'#7C3AED',border:'1px solid #DDD6FE',fontSize:12,padding:'5px 12px',borderRadius:20,fontWeight:700 }}>⭐ Featured</span>}
              <span style={{ background:car.condition==='Excellent'?'#DCFCE7':car.condition==='Good'?'#FEF9C3':'#FEE2E2',color:car.condition==='Excellent'?'#16A34A':car.condition==='Good'?'#CA8A04':'#DC2626',border:'1px solid currentColor',fontSize:12,padding:'5px 12px',borderRadius:20,fontWeight:600 }}>{car.condition}</span>
            </div>

            {/* CTAs */}
            {!car.is_sold?(
              <div style={{ display:'flex',gap:10,marginBottom:20 }}>
                <a href={waLink(`Hi, I'm interested in ${car.title} priced at ${fmt(car.price)}. Please share details and availability.`)}
                  target="_blank" rel="noreferrer"
                  style={{ flex:1,background:'#16A34A',color:'#fff',borderRadius:10,padding:'13px 0',textAlign:'center',textDecoration:'none',fontWeight:700,fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',gap:6,boxShadow:'0 4px 12px rgba(22,163,74,0.25)' }}>
                  <MessageCircle size={16}/> WhatsApp Inquiry
                </a>
                <button onClick={()=>setShowEMI(true)} className="btn-ghost" style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,borderRadius:10,padding:'13px 0' }}>
                  <Calculator size={16}/> EMI Calculator
                </button>
              </div>
            ):(
              <div style={{ background:'#F8F9FC',border:'1px solid #E8ECF0',borderRadius:10,padding:14,marginBottom:20,textAlign:'center',color:'#64748B' }}>
                This car has been sold.{' '}
                <button onClick={()=>nav('/')} style={{ background:'none',border:'none',color:'#E8520A',cursor:'pointer',textDecoration:'underline',fontFamily:'Nunito,sans-serif' }}>Browse available cars →</button>
              </div>
            )}

            {car.description&&(
              <div style={{ background:'#F8F9FC',borderRadius:12,padding:16,border:'1px solid #E8ECF0' }}>
                <div style={{ color:'#94A3B8',fontSize:11,letterSpacing:1.5,marginBottom:8,fontWeight:600 }}>DESCRIPTION</div>
                <p style={{ color:'#475569',fontSize:14,lineHeight:1.7,margin:0 }}>{car.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Specs */}
        <div style={{ marginTop:32 }}>
          <h2 style={{ fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:20,color:'#1A1A2E',marginBottom:16 }}>Specifications</h2>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12 }}>
            {SPECS.map(s=>(
              <div key={s.label} style={{ background:'#fff',borderRadius:10,padding:'12px 16px',border:'1px solid #E8ECF0',boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ color:'#94A3B8',fontSize:11,letterSpacing:1,marginBottom:4,fontWeight:600 }}>{s.label.toUpperCase()}</div>
                <div style={{ color:'#1A1A2E',fontWeight:600,fontSize:14 }}>{String(s.value)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        {car.features?.length>0&&(
          <div style={{ marginTop:28 }}>
            <h2 style={{ fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:20,color:'#1A1A2E',marginBottom:16 }}>Features & Highlights</h2>
            <div style={{ display:'flex',flexWrap:'wrap',gap:10 }}>
              {car.features.map(f=>(
                <span key={f} style={{ background:'#FFF3E8',color:'#E8520A',fontSize:13,padding:'6px 14px',borderRadius:20,border:'1px solid #FFD5B0',fontWeight:500 }}>✓ {f}</span>
              ))}
            </div>
          </div>
        )}

        {/* Similar */}
        {similar&&similar.length>0&&(
          <div style={{ marginTop:48 }}>
            <h2 style={{ fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:22,color:'#1A1A2E',marginBottom:20 }}>Similar Cars</h2>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:18 }}>
              {similar.map(c=><CarCard key={c.id} car={c} onView={c2=>nav(`/car/${c2.id}`)} onCompare={c2=>setCompare(l=>l.find(x=>x.id===c2.id)?l.filter(x=>x.id!==c2.id):[...l.slice(-1),c2])} isComparing={!!compare.find(x=>x.id===c.id)}/>)}
            </div>
          </div>
        )}
        <PoweredBy/>
      </div>
      {showEMI&&<EMIModal car={car} onClose={()=>setShowEMI(false)}/>}
      <a href={waLink(`Hi, I'm interested in ${car.title}.`)} target="_blank" rel="noreferrer"
        style={{ position:'fixed',bottom:24,right:24,background:'#16A34A',color:'#fff',borderRadius:'50%',width:56,height:56,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,textDecoration:'none',boxShadow:'0 4px 20px rgba(22,163,74,0.4)',zIndex:400 }}>
        💬
      </a>
    </div>
  )
}
