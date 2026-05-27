import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchValuationById, updateValuationStatus } from '@/lib/valuationQueries'
import { fmt, waLink } from '@/lib/utils'
import { useState } from 'react'
import { ChevronLeft, Save, Phone } from 'lucide-react'

const STATUS_OPTS = ['pending','reviewed','inspected','approved','rejected']

export default function ValuationDetail() {
  const { id } = useParams<{ id:string }>()
  const nav = useNavigate()
  const qc = useQueryClient()
  const { data:val,isLoading } = useQuery({ queryKey:['valuation',id], queryFn:()=>fetchValuationById(id!) })
  const [status,setStatus] = useState('')
  const [note,setNote] = useState('')
  const [overridePrice,setOverridePrice] = useState('')
  const [saved,setSaved] = useState(false)

  const mut = useMutation({
    mutationFn:()=>updateValuationStatus(id!,{ status:status||val?.status, admin_note:note||val?.admin_note, admin_override_price:overridePrice?Number(overridePrice):val?.admin_override_price }),
    onSuccess:()=>{ qc.invalidateQueries({queryKey:['valuations']}); setSaved(true); setTimeout(()=>setSaved(false),2500) }
  })

  if(isLoading) return <div style={{ padding:60,textAlign:'center' }}><div className="spinner"/></div>
  if(!val) return <div style={{ color:'#64748B',padding:40 }}>Not found</div>

  const r = val.report

  return (
    <div style={{ maxWidth:900,margin:'0 auto' }}>
      <div style={{ display:'flex',alignItems:'center',gap:16,marginBottom:24 }}>
        <button onClick={()=>nav('/admin/valuations')} style={{ background:'none',border:'1px solid #E8ECF0',color:'#64748B',borderRadius:8,padding:'8px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontSize:13,fontFamily:'Nunito,sans-serif' }}>
          <ChevronLeft size={14}/> Back
        </button>
        <h1 style={{ fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:22,color:'#1A1A2E' }}>
          {val.year} {val.brand} {val.model} {val.variant}
        </h1>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20 }}>
        {/* AI Valuation */}
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontFamily:'Nunito,sans-serif',fontWeight:700,fontSize:16,color:'#1A1A2E',marginBottom:16 }}>AI Valuation</h3>
          <div style={{ background:'linear-gradient(135deg,#E8520A,#E55A00)',borderRadius:12,padding:16,textAlign:'center',marginBottom:14,color:'#fff' }}>
            <div style={{ fontSize:12,opacity:0.8,marginBottom:4 }}>Estimated Range</div>
            <div style={{ fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:22 }}>{fmt(r.estimated_min)} — {fmt(r.estimated_max)}</div>
          </div>
          {[['Fast Sale',r.fast_sale_price],['Recommended',r.recommended_price],['Premium',r.premium_price]].map(([l,p])=>(
            <div key={String(l)} style={{ display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #F1F5F9' }}>
              <span style={{ color:'#64748B',fontSize:13 }}>{l}</span>
              <span style={{ color:'#1A1A2E',fontWeight:700,fontSize:14 }}>{fmt(Number(p))}</span>
            </div>
          ))}
          <div style={{ marginTop:14 }}>
            <label style={{ color:'#94A3B8',fontSize:11,fontWeight:600,letterSpacing:0.5,display:'block',marginBottom:6 }}>OVERRIDE PRICE (₹)</label>
            <input type="number" value={overridePrice} onChange={e=>setOverridePrice(e.target.value)} placeholder={String(r.recommended_price)}/>
            {val.admin_override_price&&<div style={{ color:'#E8520A',fontSize:12,marginTop:4 }}>Current override: {fmt(val.admin_override_price)}</div>}
          </div>
        </div>

        {/* Customer + Car */}
        <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
          <div className="card" style={{ padding:20 }}>
            <h3 style={{ fontFamily:'Nunito,sans-serif',fontWeight:700,fontSize:16,color:'#1A1A2E',marginBottom:14 }}>Customer</h3>
            <div style={{ color:'#1A1A2E',fontWeight:600,fontSize:15,marginBottom:4 }}>{val.customer_name}</div>
            <div style={{ color:'#64748B',fontSize:13,marginBottom:12 }}>{val.customer_phone} · {val.customer_email||'No email'}</div>
            {val.want_inspection&&<div style={{ background:'#DCFCE7',color:'#16A34A',fontSize:12,padding:'6px 12px',borderRadius:8,fontWeight:600,display:'inline-block',marginBottom:10 }}>🔍 Wants Free Inspection</div>}
            <a href={waLink(`Hi ${val.customer_name}, this is WheelsDrive. We received your valuation request for your ${val.year} ${val.brand} ${val.model}. Estimated value: ${fmt(r.estimated_min)}-${fmt(r.estimated_max)}.`)}
              target="_blank" rel="noreferrer"
              style={{ display:'flex',alignItems:'center',gap:8,background:'#16A34A',color:'#fff',borderRadius:8,padding:'10px 14px',textDecoration:'none',fontWeight:600,fontSize:13,justifyContent:'center' }}>
              <Phone size={14}/> Contact on WhatsApp
            </a>
          </div>
          <div className="card" style={{ padding:20 }}>
            <h3 style={{ fontFamily:'Nunito,sans-serif',fontWeight:700,fontSize:16,color:'#1A1A2E',marginBottom:14 }}>Car Details</h3>
            {[['Fuel',val.fuel],['KM',`${(val.km_driven/1000).toFixed(0)}k km`],['Owners',val.owners],['Exterior',val.exterior_condition],['Engine',val.engine_condition],['Accident',val.accident_history?'Yes ⚠️':'No ✅'],['Service',val.service_history]].map(([k,v])=>(
              <div key={String(k)} style={{ display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #F8F9FC' }}>
                <span style={{ color:'#94A3B8',fontSize:12 }}>{k}</span>
                <span style={{ color:'#1A1A2E',fontWeight:600,fontSize:12,textTransform:'capitalize' }}>{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Photos */}
      {Object.keys(val.images||{}).filter(k=>k!=='damage').length>0&&(
        <div className="card" style={{ padding:20,marginBottom:20 }}>
          <h3 style={{ fontFamily:'Nunito,sans-serif',fontWeight:700,fontSize:16,color:'#1A1A2E',marginBottom:16 }}>Uploaded Photos</h3>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:10 }}>
            {Object.entries(val.images).filter(([k])=>k!=='damage').map(([key,url])=>(
              url&&<div key={key} style={{ borderRadius:10,overflow:'hidden',border:'1px solid #E8ECF0' }}>
                <img src={url as string} alt={key} style={{ width:'100%',height:100,objectFit:'cover',display:'block' }}/>
                <div style={{ background:'#F8F9FC',color:'#64748B',fontSize:10,fontWeight:600,padding:'4px 8px',textAlign:'center',textTransform:'capitalize' }}>{key}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin controls */}
      <div className="card" style={{ padding:20,marginBottom:20 }}>
        <h3 style={{ fontFamily:'Nunito,sans-serif',fontWeight:700,fontSize:16,color:'#1A1A2E',marginBottom:16 }}>Admin Actions</h3>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
          <div>
            <label style={{ color:'#94A3B8',fontSize:11,fontWeight:600,letterSpacing:0.5,display:'block',marginBottom:6 }}>STATUS</label>
            <select value={status||val.status} onChange={e=>setStatus(e.target.value)}>
              {STATUS_OPTS.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color:'#94A3B8',fontSize:11,fontWeight:600,letterSpacing:0.5,display:'block',marginBottom:6 }}>ADMIN NOTE</label>
            <input value={note||val.admin_note||''} onChange={e=>setNote(e.target.value)} placeholder="Add note..."/>
          </div>
        </div>
        <div style={{ display:'flex',justifyContent:'flex-end',gap:10,marginTop:16 }}>
          {saved&&<div style={{ background:'#DCFCE7',color:'#16A34A',borderRadius:8,padding:'10px 16px',fontSize:13 }}>✓ Saved</div>}
          <button onClick={()=>mut.mutate()} disabled={mut.isPending} className="btn-primary" style={{ display:'flex',alignItems:'center',gap:8 }}>
            <Save size={15}/> Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
