import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchValuations, updateValuationStatus } from '@/lib/valuationQueries'
import { fmt } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { Eye, MessageSquare } from 'lucide-react'
import { useState } from 'react'

const STATUS_STYLE: Record<string,{bg:string;color:string}> = {
  pending:{bg:'#FEF9C3',color:'#CA8A04'}, reviewed:{bg:'#DBEAFE',color:'#2563EB'},
  inspected:{bg:'#F3E8FF',color:'#7C3AED'}, approved:{bg:'#DCFCE7',color:'#16A34A'}, rejected:{bg:'#FEE2E2',color:'#DC2626'}
}

export default function AdminValuations() {
  const nav = useNavigate()
  const [statusFilter,setStatusFilter] = useState('')
  const { data:valuations,isLoading } = useQuery({ queryKey:['valuations'], queryFn:fetchValuations })
  const filtered = statusFilter ? valuations?.filter(v=>v.status===statusFilter) : valuations

  return (
    <div>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24,flexWrap:'wrap',gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:24,color:'#1A1A2E',marginBottom:4 }}>Car Valuations</h1>
          <p style={{ color:'#64748B',fontSize:13 }}>{valuations?.length||0} total requests</p>
        </div>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
          style={{ background:'#fff',border:'1.5px solid #E8ECF0',color:'#1A1A2E',borderRadius:8,padding:'8px 14px',outline:'none',fontSize:13,cursor:'pointer' }}>
          <option value="">All Status</option>
          {['pending','reviewed','inspected','approved','rejected'].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
      </div>

      {isLoading ? <div style={{ padding:60,textAlign:'center' }}><div className="spinner"/></div> :
      !filtered?.length ? (
        <div style={{ textAlign:'center',padding:'60px 0',color:'#94A3B8' }}>
          <div style={{ fontSize:40,marginBottom:12 }}>📋</div>
          <div>No valuation requests yet</div>
        </div>
      ) : (
        <div className="card" style={{ overflow:'hidden' }}>
          {filtered.map((val,i)=>{
            const st = STATUS_STYLE[val.status]||STATUS_STYLE.pending
            return (
              <div key={val.id} style={{ display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr auto',gap:12,padding:'14px 16px',borderTop:i>0?'1px solid #F1F5F9':'none',alignItems:'center',transition:'background 0.15s',cursor:'pointer' }}
                onClick={()=>nav(`/admin/valuations/${val.id}`)}
                onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#F8F9FC'}
                onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background=''}>
                <div>
                  <div style={{ color:'#1A1A2E',fontWeight:600,fontSize:14 }}>{val.year} {val.brand} {val.model}</div>
                  <div style={{ color:'#94A3B8',fontSize:12,marginTop:2 }}>{val.customer_name} · {val.customer_phone}</div>
                </div>
                <div style={{ color:'#FF6B00',fontWeight:700,fontFamily:'Syne,sans-serif',fontSize:15 }}>
                  {fmt(val.admin_override_price||val.report?.recommended_price||0)}
                </div>
                <span style={{ background:st.bg,color:st.color,fontSize:11,padding:'4px 10px',borderRadius:20,fontWeight:700,textTransform:'capitalize',display:'inline-block' }}>
                  {val.status}
                </span>
                <div style={{ color:'#94A3B8',fontSize:12 }}>{new Date(val.created_at).toLocaleDateString('en-IN')}</div>
                <button onClick={e=>{e.stopPropagation();nav(`/admin/valuations/${val.id}`)}}
                  style={{ background:'#F8F9FC',border:'1px solid #E8ECF0',color:'#64748B',borderRadius:8,padding:'7px 12px',cursor:'pointer',display:'flex',alignItems:'center',gap:4,fontSize:12 }}>
                  <Eye size={13}/> View
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
