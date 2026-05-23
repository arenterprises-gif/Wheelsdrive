import { useState } from 'react'
import { Car } from '@/types'
import { fmt, fmtFull, calcEMI, waLink } from '@/lib/utils'
import { X } from 'lucide-react'

export default function EMIModal({ car, onClose }: { car:Car; onClose:()=>void }) {
  const [dp,setDp] = useState(Math.round(car.price*0.2))
  const [rate,setRate] = useState(9.5)
  const [tenure,setTenure] = useState(36)
  const loan = car.price - dp
  const emi = calcEMI(loan,rate,tenure)
  const total = emi*tenure

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:900,display:'flex',alignItems:'center',justifyContent:'center',padding:16 }} onClick={onClose}>
      <div className="fade-up" style={{ background:'#fff',borderRadius:20,padding:28,width:'100%',maxWidth:440,boxShadow:'0 20px 60px rgba(0,0,0,0.15)',maxHeight:'90vh',overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
          <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:20,color:'#1A1A2E' }}>EMI Calculator</div>
          <button onClick={onClose} style={{ background:'#F8F9FC',border:'none',borderRadius:8,width:32,height:32,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748B' }}><X size={16}/></button>
        </div>
        <div style={{ background:'#FFF3E8',border:'1px solid #FFD5B0',borderRadius:12,padding:14,marginBottom:20,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div><div style={{ color:'#64748B',fontSize:12 }}>Car</div><div style={{ color:'#1A1A2E',fontWeight:600,fontSize:14 }}>{car.title}</div></div>
          <div style={{ color:'#FF6B00',fontWeight:800,fontSize:20,fontFamily:'Syne,sans-serif' }}>{fmt(car.price)}</div>
        </div>
        {[
          { label:`Down Payment: ${fmt(dp)}`,val:dp,set:setDp,min:car.price*0.1,max:car.price*0.7,step:5000 },
          { label:`Interest Rate: ${rate}% p.a.`,val:rate,set:setRate,min:6.5,max:18,step:0.25 },
          { label:`Tenure: ${tenure} months`,val:tenure,set:setTenure,min:12,max:84,step:6 },
        ].map(({label,val,set,min,max,step})=>(
          <div key={label} style={{ marginBottom:18 }}>
            <div style={{ color:'#64748B',fontSize:13,marginBottom:6,fontWeight:500 }}>{label}</div>
            <input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(Number(e.target.value))} style={{ width:'100%',accentColor:'#FF6B00',cursor:'pointer',background:'none',border:'none',padding:0 }}/>
          </div>
        ))}
        <div style={{ background:'linear-gradient(135deg,#FF6B00,#E55A00)',borderRadius:14,padding:20,textAlign:'center',marginBottom:16,color:'#fff' }}>
          <div style={{ fontSize:13,opacity:0.85,marginBottom:4 }}>Monthly EMI</div>
          <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:40 }}>₹{emi.toLocaleString('en-IN')}</div>
          <div style={{ fontSize:12,opacity:0.7,marginTop:6 }}>Loan {fmt(loan)} · {tenure}mo · {rate}% p.a.</div>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16 }}>
          {[['Total Payment',fmtFull(total)],['Total Interest',fmtFull(total-loan)]].map(([l,v])=>(
            <div key={String(l)} style={{ background:'#F8F9FC',borderRadius:10,padding:12,textAlign:'center',border:'1px solid #E8ECF0' }}>
              <div style={{ color:'#94A3B8',fontSize:11,marginBottom:4 }}>{l}</div>
              <div style={{ color:'#1A1A2E',fontWeight:700,fontSize:15 }}>{v}</div>
            </div>
          ))}
        </div>
        <a href={waLink(`Hi, EMI inquiry for ${car.title} (${fmt(car.price)}). Down Payment: ${fmt(dp)}, EMI: ₹${emi.toLocaleString('en-IN')}/month for ${tenure} months at ${rate}% p.a.`)}
          target="_blank" rel="noreferrer"
          style={{ display:'block',background:'#16A34A',color:'#fff',borderRadius:10,padding:'12px 0',textAlign:'center',fontWeight:700,textDecoration:'none',fontSize:14 }}>
          📱 Apply on WhatsApp
        </a>
      </div>
    </div>
  )
}
