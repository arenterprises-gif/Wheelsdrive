import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchValuationById } from '@/lib/valuationQueries'
import { fmt, waLink } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import PoweredBy from '@/components/PoweredBy'
import { TrendingUp, TrendingDown, Minus, Share2, Phone, RotateCcw } from 'lucide-react'

const ScoreBar = ({ label, score, color='#0052CC' }: { label:string; score:number; color?:string }) => (
  <div style={{ marginBottom:14 }}>
    <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
      <span style={{ color:'#64748B',fontSize:13 }}>{label}</span>
      <span style={{ color:'#1A1A2E',fontWeight:700,fontSize:13 }}>{score}/100</span>
    </div>
    <div style={{ background:'#F1F5F9',borderRadius:6,height:8,overflow:'hidden' }}>
      <div style={{ width:`${score}%`,height:'100%',background:color,borderRadius:6,transition:'width 1s ease' }}/>
    </div>
  </div>
)

const ImpactIcon = ({ impact }: { impact:string }) =>
  impact==='positive'?<TrendingUp size={14} style={{ color:'#16A34A' }}/>:
  impact==='negative'?<TrendingDown size={14} style={{ color:'#DC2626' }}/>:
  <Minus size={14} style={{ color:'#64748B' }}/>

export default function ValuationResult() {
  const { id } = useParams<{ id:string }>()
  const nav = useNavigate()
  const { data:val, isLoading } = useQuery({ queryKey:['valuation',id], queryFn:()=>fetchValuationById(id!) })

  if(isLoading) return (
    <div style={{ background:'#F8F9FC',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div className="spinner"/>
        <div style={{ color:'#64748B',marginTop:16,fontSize:14 }}>Calculating your car value...</div>
      </div>
    </div>
  )

  if(!val) return <div style={{ textAlign:'center',padding:60,color:'#64748B' }}>Valuation not found</div>

  const r = val.report
  const displayPrice = val.admin_override_price || r.recommended_price

  return (
    <div style={{ background:'#F8F9FC',minHeight:'100vh' }}>
      <Navbar/>
      <div style={{ paddingTop:64 }}>
        {/* Hero result */}
        <div style={{ background:'linear-gradient(135deg,#1A1A2E,#2D2D4E)',color:'#fff',padding:'48px 24px',textAlign:'center' }}>
          <div style={{ maxWidth:600,margin:'0 auto' }}>
            <div style={{ background:'rgba(255,107,0,0.2)',border:'1px solid rgba(255,107,0,0.4)',display:'inline-block',borderRadius:20,padding:'4px 14px',fontSize:12,fontWeight:700,letterSpacing:2,marginBottom:16,color:'#0052CC' }}>
              AI VALUATION COMPLETE
            </div>
            <div style={{ color:'rgba(255,255,255,0.7)',fontSize:15,marginBottom:8 }}>
              {val.year} {val.brand} {val.model} {val.variant}
            </div>
            <div style={{ fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:20 }}>
              Estimated Market Value Range
            </div>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:12,marginBottom:8 }}>
              <span style={{ fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:'clamp(28px,6vw,52px)',color:'#0052CC' }}>
                {fmt(r.estimated_min)}
              </span>
              <span style={{ color:'rgba(255,255,255,0.4)',fontSize:24 }}>—</span>
              <span style={{ fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:'clamp(28px,6vw,52px)',color:'#0052CC' }}>
                {fmt(r.estimated_max)}
              </span>
            </div>
            <div style={{ background:'rgba(255,107,0,0.15)',borderRadius:12,padding:'10px 20px',display:'inline-block',marginBottom:28 }}>
              <span style={{ color:'rgba(255,255,255,0.7)',fontSize:13 }}>Overall Score: </span>
              <span style={{ color:'#0052CC',fontWeight:800,fontSize:20,fontFamily:'Nunito,sans-serif' }}>{r.scores.overall_score}/100</span>
            </div>

            {/* 3 price options */}
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12 }}>
              {[
                { label:'Fast Sale', price:r.fast_sale_price, desc:'Sell within days', color:'#3B82F6' },
                { label:'Best Price', price:r.recommended_price, desc:'Ideal market price', color:'#0052CC', highlight:true },
                { label:'Premium', price:r.premium_price, desc:'If you can wait', color:'#8B5CF6' },
              ].map(p=>(
                <div key={p.label} style={{ background:p.highlight?'rgba(255,107,0,0.15)':'rgba(255,255,255,0.05)', border:`1px solid ${p.highlight?'rgba(255,107,0,0.4)':'rgba(255,255,255,0.1)'}`, borderRadius:12, padding:'14px 10px', textAlign:'center' }}>
                  <div style={{ color:p.color,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:6 }}>{p.label}</div>
                  <div style={{ color:'#fff',fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:'clamp(14px,2.5vw,22px)' }}>{fmt(p.price)}</div>
                  <div style={{ color:'rgba(255,255,255,0.4)',fontSize:11,marginTop:4 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth:800,margin:'0 auto',padding:'32px 16px' }}>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20 }}>
            {/* Scores */}
            <div style={{ background:'#fff',borderRadius:16,padding:22,border:'1px solid #E8ECF0',boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:17,color:'#1A1A2E',marginBottom:20 }}>Score Breakdown</h3>
              <ScoreBar label="Overall Score" score={r.scores.overall_score}/>
              <ScoreBar label="Condition" score={r.scores.condition_score} color="#16A34A"/>
              <ScoreBar label="Market Demand" score={r.scores.demand_score} color="#3B82F6"/>
              <ScoreBar label="KM Rating" score={r.scores.km_score} color="#8B5CF6"/>
              <ScoreBar label="Brand Value" score={r.scores.brand_score} color="#F59E0B"/>
            </div>

            {/* Car summary */}
            <div style={{ background:'#fff',borderRadius:16,padding:22,border:'1px solid #E8ECF0',boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:17,color:'#1A1A2E',marginBottom:20 }}>Car Details</h3>
              {[
                ['Year',val.year],['Fuel',val.fuel],['KM',`${(val.km_driven/1000).toFixed(0)}k km`],
                ['Owners',`${val.owners} owner`],['Transmission',val.transmission],
                ['Exterior',val.exterior_condition],['Engine',val.engine_condition],
                ['Insurance',val.insurance_valid?'✅ Valid':'❌ Expired'],
                ['Accident',val.accident_history?'⚠️ Yes':'✅ None'],
                ['Service',val.service_history],
              ].map(([k,v])=>(
                <div key={String(k)} style={{ display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #F8F9FC' }}>
                  <span style={{ color:'#94A3B8',fontSize:13 }}>{k}</span>
                  <span style={{ color:'#1A1A2E',fontWeight:600,fontSize:13,textTransform:'capitalize' }}>{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown */}
          <div style={{ background:'#fff',borderRadius:16,padding:22,border:'1px solid #E8ECF0',boxShadow:'0 2px 8px rgba(0,0,0,0.05)',marginBottom:20 }}>
            <h3 style={{ fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:17,color:'#1A1A2E',marginBottom:20 }}>Valuation Breakdown</h3>
            <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
              {r.breakdown.map((b,i)=>(
                <div key={i} style={{ display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:'#F8F9FC',borderRadius:10,border:`1px solid ${b.impact==='positive'?'#BBF7D0':b.impact==='negative'?'#FECACA':'#E8ECF0'}` }}>
                  <div style={{ flexShrink:0 }}><ImpactIcon impact={b.impact}/></div>
                  <div style={{ flex:1 }}>
                    <div style={{ color:'#1A1A2E',fontWeight:600,fontSize:13 }}>{b.label}</div>
                    <div style={{ color:'#64748B',fontSize:12,marginTop:2 }}>{b.detail}</div>
                  </div>
                  {b.value_impact!==0&&(
                    <div style={{ color:b.impact==='positive'?'#16A34A':'#DC2626',fontWeight:700,fontSize:13,flexShrink:0 }}>
                      {b.value_impact>0?'+':''}{fmt(Math.abs(b.value_impact))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ background:'linear-gradient(135deg,#EBF2FF,#FFE8D0)',borderRadius:16,padding:24,border:'1px solid #B3D1FF',textAlign:'center',marginBottom:20 }}>
            <h3 style={{ fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:20,color:'#1A1A2E',marginBottom:8 }}>Ready to Sell?</h3>
            <p style={{ color:'#64748B',fontSize:14,marginBottom:20 }}>Our team will contact you shortly. WhatsApp us for faster response.</p>
            <div style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap' }}>
              <a href={waLink(`Hi, I just got a valuation for my ${val.year} ${val.brand} ${val.model}. Estimated value: ${fmt(r.estimated_min)}-${fmt(r.estimated_max)}. I'd like to proceed with selling.`)}
                target="_blank" rel="noreferrer"
                style={{ background:'#16A34A',color:'#fff',borderRadius:10,padding:'12px 24px',fontWeight:700,textDecoration:'none',fontSize:14,display:'flex',alignItems:'center',gap:8 }}>
                <Phone size={16}/> WhatsApp Now
              </a>
              <button onClick={()=>nav('/sell')} style={{ background:'#fff',border:'1.5px solid #E8ECF0',color:'#64748B',borderRadius:10,padding:'12px 20px',cursor:'pointer',fontWeight:600,fontSize:14,display:'flex',alignItems:'center',gap:8,fontFamily:'Nunito,sans-serif' }}>
                <RotateCcw size={16}/> New Valuation
              </button>
            </div>
          </div>
        </div>
        <PoweredBy/>
      </div>
    </div>
  )
}
