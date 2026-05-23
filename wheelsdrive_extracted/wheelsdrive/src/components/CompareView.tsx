import { Car } from '@/types'
import { fmt, fmtKm } from '@/lib/utils'
import { X } from 'lucide-react'

export default function CompareView({ cars, onRemove, onClose }: { cars:Car[]; onRemove:(id:string)=>void; onClose:()=>void }) {
  const specs: { key:keyof Car; label:string; render:(c:Car)=>string; better?:'lower'|'higher' }[] = [
    { key:'price', label:'Price', render:c=>fmt(c.price), better:'lower' },
    { key:'year', label:'Year', render:c=>String(c.year), better:'higher' },
    { key:'km_driven', label:'KM Driven', render:c=>fmtKm(c.km_driven), better:'lower' },
    { key:'fuel', label:'Fuel', render:c=>c.fuel },
    { key:'transmission', label:'Transmission', render:c=>c.transmission },
    { key:'condition', label:'Condition', render:c=>c.condition },
    { key:'owners', label:'Owners', render:c=>`${c.owners}`, better:'lower' },
    { key:'segment', label:'Segment', render:c=>c.segment },
  ]
  const isBetter = (spec:typeof specs[0], car:Car, other:Car) => {
    if(!spec.better) return false
    const a=car[spec.key] as number, b=other[spec.key] as number
    if(typeof a!=='number'||typeof b!=='number') return false
    return spec.better==='lower'?a<b:a>b
  }
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:900,overflowY:'auto',padding:16 }} onClick={onClose}>
      <div className="fade-up" style={{ maxWidth:660,margin:'40px auto',background:'#fff',borderRadius:20,padding:24,boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
          <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:22,color:'#1A1A2E' }}>⚖️ Compare</div>
          <button onClick={onClose} style={{ background:'#F8F9FC',border:'none',borderRadius:8,width:32,height:32,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748B' }}><X size={16}/></button>
        </div>
        {cars.length<2 ? (
          <div style={{ textAlign:'center',padding:'40px 0',color:'#94A3B8' }}>Select 2 cars using ⚖️ button</div>
        ) : (
          <table style={{ width:'100%',borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <td style={{ width:'30%',padding:8 }}/>
                {cars.slice(0,2).map(c=>(
                  <td key={c.id} style={{ padding:8,textAlign:'center' }}>
                    <div style={{ background:'#F8F9FC',borderRadius:12,padding:12,position:'relative',border:'1px solid #E8ECF0' }}>
                      <button onClick={()=>onRemove(c.id)} style={{ position:'absolute',top:6,right:6,background:'none',border:'none',color:'#DC2626',cursor:'pointer',fontSize:16 }}>✕</button>
                      <div style={{ fontSize:28,marginBottom:4 }}>{c.images?.[0]?<img src={c.images[0]} style={{ width:70,height:46,objectFit:'cover',borderRadius:8 }}/>:'🚗'}</div>
                      <div style={{ color:'#1A1A2E',fontWeight:700,fontSize:13,fontFamily:'Syne,sans-serif' }}>{c.title}</div>
                      <div style={{ color:'#FF6B00',fontWeight:800,fontSize:16,fontFamily:'Syne,sans-serif' }}>{fmt(c.price)}</div>
                    </div>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map(spec=>(
                <tr key={String(spec.key)} style={{ borderTop:'1px solid #F1F5F9' }}>
                  <td style={{ padding:'10px 8px',color:'#64748B',fontSize:13 }}>{spec.label}</td>
                  {cars.slice(0,2).map((c,i)=>{
                    const other=cars[1-i]; const better=other?isBetter(spec,c,other):false
                    return <td key={c.id} style={{ padding:'10px 8px',textAlign:'center',color:better?'#16A34A':'#1A1A2E',fontWeight:better?700:400,fontSize:14 }}>{better&&'✓ '}{spec.render(c)}</td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
