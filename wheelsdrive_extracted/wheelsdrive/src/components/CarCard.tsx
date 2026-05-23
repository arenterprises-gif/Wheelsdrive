import { Car } from '@/types'
import { fmt, fmtKm, waLink } from '@/lib/utils'
import { Scale, MessageCircle, Eye, Fuel, Gauge, Users } from 'lucide-react'

interface Props { car: Car; onView: (c:Car)=>void; onCompare: (c:Car)=>void; isComparing?: boolean }

const COND_STYLE: Record<string,{bg:string;color:string}> = {
  Excellent:{bg:'#DCFCE7',color:'#16A34A'},
  Good:{bg:'#FEF9C3',color:'#CA8A04'},
  Fair:{bg:'#FEE2E2',color:'#DC2626'},
}

export default function CarCard({ car, onView, onCompare, isComparing }: Props) {
  const img = car.images?.[0]
  const cond = COND_STYLE[car.condition] || COND_STYLE.Good

  return (
    <div className="fade-up" onClick={()=>onView(car)}
      style={{ background:'#fff',borderRadius:16,overflow:'hidden',border:isComparing?'2px solid #FF6B00':'1px solid #E8ECF0',cursor:'pointer',transition:'transform 0.2s,box-shadow 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}
      onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)';(e.currentTarget as HTMLDivElement).style.boxShadow='0 12px 32px rgba(0,0,0,0.12)'}}
      onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform='';(e.currentTarget as HTMLDivElement).style.boxShadow='0 1px 4px rgba(0,0,0,0.06)'}}>

      {/* Image */}
      <div style={{ height:180,background:'linear-gradient(135deg,#F8F9FC,#EEF2FF)',position:'relative',overflow:'hidden' }}>
        {img ? <img src={img} alt={car.title} loading="lazy" style={{ width:'100%',height:'100%',objectFit:'cover' }}/> :
          <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:8 }}>
            <span style={{ fontSize:56 }}>🚗</span>
            <span style={{ color:'#CBD5E1',fontSize:12 }}>No photo</span>
          </div>}

        {/* Badges */}
        <div style={{ position:'absolute',top:10,left:10,display:'flex',gap:6 }}>
          {car.is_hot_deal && <span style={{ background:'#FF6B00',color:'#fff',fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:20 }}>🔥 HOT</span>}
          {car.is_featured && <span style={{ background:'#7C3AED',color:'#fff',fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:20 }}>⭐ TOP</span>}
          {car.is_sold && <span style={{ background:'#64748B',color:'#fff',fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:20 }}>SOLD</span>}
        </div>
        <div style={{ position:'absolute',top:10,right:10 }}>
          <span style={{ background:cond.bg,color:cond.color,fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:20 }}>{car.condition}</span>
        </div>
        {car.images?.length > 1 && (
          <div style={{ position:'absolute',bottom:8,right:10,background:'rgba(0,0,0,0.5)',color:'#fff',fontSize:11,padding:'2px 8px',borderRadius:10,display:'flex',alignItems:'center',gap:4 }}>
            <Eye size={11}/> {car.images.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding:'14px 16px' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10 }}>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ color:'#1A1A2E',fontWeight:700,fontSize:15,fontFamily:'Syne,sans-serif',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{car.title}</div>
            <div style={{ color:'#94A3B8',fontSize:12,marginTop:2 }}>{car.year} · {car.color}</div>
          </div>
          <div style={{ color:'#FF6B00',fontWeight:800,fontSize:18,fontFamily:'Syne,sans-serif',flexShrink:0,marginLeft:8 }}>{fmt(car.price)}</div>
        </div>

        {/* Stats row */}
        <div style={{ display:'flex',gap:12,marginBottom:14,paddingBottom:12,borderBottom:'1px solid #F1F5F9' }}>
          {[[<Gauge size={12}/>,fmtKm(car.km_driven)],[<Fuel size={12}/>,car.fuel],[<Users size={12}/>,`${car.owners} Owner`]].map(([icon,label],i)=>(
            <div key={i} style={{ display:'flex',alignItems:'center',gap:4,color:'#64748B',fontSize:12 }}>
              <span style={{ color:'#94A3B8' }}>{icon as React.ReactNode}</span>{String(label)}
            </div>
          ))}
        </div>

        {/* Transmission badge */}
        <div style={{ marginBottom:12 }}>
          <span style={{ background:'#F8F9FC',color:'#64748B',fontSize:11,padding:'4px 10px',borderRadius:6,border:'1px solid #E8ECF0',fontWeight:500 }}>{car.transmission}</span>
          <span style={{ background:'#F8F9FC',color:'#64748B',fontSize:11,padding:'4px 10px',borderRadius:6,border:'1px solid #E8ECF0',fontWeight:500,marginLeft:6 }}>{car.segment}</span>
        </div>

        {/* Actions */}
        <div style={{ display:'flex',gap:8 }}>
          <button onClick={e=>{e.stopPropagation();onView(car)}} className="btn-primary" style={{ flex:1,padding:'9px 0',fontSize:13,borderRadius:8 }}>View Details</button>
          <a href={waLink(`Hi, I'm interested in ${car.title} (${fmt(car.price)}).`)} target="_blank" rel="noreferrer"
            onClick={e=>e.stopPropagation()}
            style={{ background:'#F0FDF4',color:'#16A34A',border:'1px solid #BBF7D0',borderRadius:8,padding:'9px 12px',textDecoration:'none',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <MessageCircle size={15}/>
          </a>
          <button onClick={e=>{e.stopPropagation();onCompare(car)}}
            style={{ background:isComparing?'#FF6B00':'#F8F9FC',color:isComparing?'#fff':'#94A3B8',border:`1px solid ${isComparing?'#FF6B00':'#E8ECF0'}`,borderRadius:8,padding:'9px 12px',cursor:'pointer',transition:'all 0.2s' }}>
            <Scale size={15}/>
          </button>
        </div>
      </div>
    </div>
  )
}
