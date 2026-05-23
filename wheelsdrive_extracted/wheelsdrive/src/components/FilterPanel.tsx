import { CarFilters } from '@/types'
import { BRANDS, SEGMENTS, FUELS, TRANSMISSIONS, CONDITIONS, fmt } from '@/lib/utils'
import { SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'

const PRICE_CATS = ['Budget','Economy','Mid-Range','Premium','Luxury']
const YEARS = Array.from({length:12},(_,i)=>2025-i)

export default function FilterPanel({ filters, onChange, brands, total }: { filters:Partial<CarFilters>; onChange:(f:Partial<CarFilters>)=>void; brands?:string[]; total:number }) {
  const [open,setOpen] = useState(false)
  const set = (k:keyof CarFilters,v:unknown) => onChange({...filters,[k]:v||undefined})
  const clear = () => onChange({show_sold:false})
  const activeCount = Object.entries(filters).filter(([k,v])=>k!=='show_sold'&&v!==undefined&&v!==''&&v!==false).length

  const sel = { width:'100%',background:'#fff',border:'1.5px solid #E8ECF0',color:'#1A1A2E',borderRadius:8,padding:'9px 12px',fontSize:13,outline:'none',cursor:'pointer' }

  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14,flexWrap:'wrap' }}>
        <button onClick={()=>setOpen(!open)}
          style={{ background:open||activeCount>0?'#FF6B00':'#fff',color:open||activeCount>0?'#fff':'#64748B',border:`1.5px solid ${open||activeCount>0?'#FF6B00':'#E8ECF0'}`,borderRadius:10,padding:'9px 16px',cursor:'pointer',display:'flex',alignItems:'center',gap:8,fontWeight:600,fontSize:13,fontFamily:'DM Sans,sans-serif' }}>
          <SlidersHorizontal size={15}/> Filters {activeCount>0&&`(${activeCount})`}
        </button>
        {activeCount>0&&(
          <button onClick={clear} style={{ background:'none',border:'1px solid #FECACA',color:'#DC2626',borderRadius:8,padding:'8px 12px',cursor:'pointer',fontSize:12,display:'flex',alignItems:'center',gap:4,fontFamily:'DM Sans,sans-serif' }}>
            <X size={12}/> Clear all
          </button>
        )}
        <span style={{ color:'#94A3B8',fontSize:13,marginLeft:'auto' }}>{total} {total===1?'car':'cars'} found</span>
      </div>

      {open && (
        <div className="fade-up" style={{ background:'#fff',border:'1px solid #E8ECF0',borderRadius:16,padding:20,marginBottom:20,boxShadow:'0 4px 16px rgba(0,0,0,0.06)',display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:14 }}>
          {[
            ['BRAND','brand',['',  ...(brands?.length?brands:BRANDS)]],
            ['SEGMENT','segment',['',...SEGMENTS]],
            ['FUEL','fuel',['',...FUELS]],
            ['TRANSMISSION','transmission',['','Manual','Automatic']],
            ['CONDITION','condition',['',...CONDITIONS]],
            ['PRICE RANGE','price_category',['',...PRICE_CATS]],
          ].map(([l,k,opts])=>(
            <div key={String(k)}>
              <label style={{ color:'#94A3B8',fontSize:10,letterSpacing:1,display:'block',marginBottom:5,fontWeight:600 }}>{l}</label>
              <select style={sel} value={(filters as Record<string,unknown>)[String(k)] as string||''} onChange={e=>set(k as keyof CarFilters,e.target.value)}>
                {(opts as string[]).map(o=><option key={o} value={o}>{o||`All ${String(l).toLowerCase()}`}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label style={{ color:'#94A3B8',fontSize:10,letterSpacing:1,display:'block',marginBottom:5,fontWeight:600 }}>MAX PRICE</label>
            <select style={sel} value={filters.max_price||''} onChange={e=>set('max_price',Number(e.target.value))}>
              <option value="">No Limit</option>
              {[300000,500000,700000,1000000,1500000,2000000].map(p=><option key={p} value={p}>{fmt(p)}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color:'#94A3B8',fontSize:10,letterSpacing:1,display:'block',marginBottom:5,fontWeight:600 }}>MIN YEAR</label>
            <select style={sel} value={filters.min_year||''} onChange={e=>set('min_year',Number(e.target.value))}>
              <option value="">Any Year</option>
              {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ display:'flex',alignItems:'center' }}>
            <label style={{ display:'flex',alignItems:'center',gap:8,cursor:'pointer',color:'#1A1A2E',fontSize:13 }}>
              <input type="checkbox" checked={!!filters.is_hot_deal} onChange={e=>set('is_hot_deal',e.target.checked||undefined)} style={{ width:16,height:16,accentColor:'#FF6B00',cursor:'pointer' }}/>
              🔥 Hot Deals only
            </label>
          </div>
          <div style={{ display:'flex',alignItems:'center' }}>
            <label style={{ display:'flex',alignItems:'center',gap:8,cursor:'pointer',color:'#1A1A2E',fontSize:13 }}>
              <input type="checkbox" checked={!!filters.show_sold} onChange={e=>onChange({...filters,show_sold:e.target.checked})} style={{ width:16,height:16,accentColor:'#FF6B00',cursor:'pointer' }}/>
              Show Sold Cars
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
