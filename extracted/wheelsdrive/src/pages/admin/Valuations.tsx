import { useQuery } from '@tanstack/react-query'
import { fetchValuations } from '@/lib/valuationQueries'
import { fmt } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { Eye, Clock } from 'lucide-react'
import { useState } from 'react'

const STATUS: Record<string, { bg: string; color: string; border: string; label: string }> = {
  pending:   { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', label: 'Pending'   },
  reviewed:  { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE', label: 'Reviewed'  },
  inspected: { bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE', label: 'Inspected' },
  approved:  { bg: '#ECFDF5', color: '#059669', border: '#BBF7D0', label: 'Approved'  },
  rejected:  { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', label: 'Rejected'  },
}

export default function AdminValuations() {
  const nav = useNavigate()
  const [statusFilter, setStatusFilter] = useState('')
  const { data: valuations, isLoading } = useQuery({ queryKey: ['valuations'], queryFn: fetchValuations })
  const filtered = statusFilter ? valuations?.filter(v => v.status === statusFilter) : valuations

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 26, color: '#111827', marginBottom: 4 }}>Car Valuations</h1>
          <p style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 500 }}>
            <span style={{ fontWeight: 700, color: '#E8520A' }}>{valuations?.length || 0}</span> total requests
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            background: '#FFFFFF', border: '1.5px solid #E5E7EB',
            color: '#374151', borderRadius: 10, padding: '9px 16px',
            outline: 'none', fontSize: 13, cursor: 'pointer',
            fontFamily: 'Nunito,sans-serif', fontWeight: 600,
          }}>
          <option value="">All Status</option>
          {Object.entries(STATUS).map(([val, { label }]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div className="spinner" />
          <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 12 }}>Loading valuations...</div>
        </div>
      ) : !filtered?.length ? (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 20, textAlign: 'center', padding: '60px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>📋</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#374151', marginBottom: 6 }}>No valuation requests yet</div>
          <div style={{ color: '#9CA3AF', fontSize: 13 }}>They'll appear here when customers submit their car for valuation.</div>
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
            gap: 12, padding: '12px 20px',
            background: '#F9FAFB', borderBottom: '1px solid #F3F4F6',
            color: '#9CA3AF', fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 0.7,
          }}>
            <div>Car / Customer</div>
            <div>Est. Price</div>
            <div>Status</div>
            <div>Date</div>
            <div>Action</div>
          </div>

          {filtered.map((val, i) => {
            const st = STATUS[val.status] || STATUS.pending
            return (
              <div
                key={val.id}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                  gap: 12, padding: '15px 20px',
                  borderTop: i > 0 ? '1px solid #F9FAFB' : 'none',
                  alignItems: 'center', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onClick={() => nav(`/admin/valuations/${val.id}`)}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#FAFAFA'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}>

                <div>
                  <div style={{ color: '#111827', fontWeight: 700, fontSize: 14 }}>
                    {val.year} {val.brand} {val.model}
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2, fontWeight: 500 }}>
                    {val.customer_name} · {val.customer_phone}
                  </div>
                </div>

                <div style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 15, color: '#E8520A' }}>
                  {fmt(val.admin_override_price || val.report?.recommended_price || 0)}
                </div>

                <span style={{
                  background: st.bg, color: st.color, border: `1px solid ${st.border}`,
                  fontSize: 11, padding: '5px 12px', borderRadius: 20,
                  fontWeight: 700, display: 'inline-block',
                }}>
                  {st.label}
                </span>

                <div style={{ color: '#9CA3AF', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} /> {new Date(val.created_at).toLocaleDateString('en-IN')}
                </div>

                <button
                  onClick={e => { e.stopPropagation(); nav(`/admin/valuations/${val.id}`) }}
                  style={{
                    background: '#F9FAFB', border: '1.5px solid #E5E7EB',
                    color: '#6B7280', borderRadius: 8, padding: '7px 14px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    gap: 5, fontSize: 12, fontWeight: 700,
                    fontFamily: 'Nunito,sans-serif', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF5F0'; (e.currentTarget as HTMLButtonElement).style.color = '#E8520A'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#FDDCCE'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB'; (e.currentTarget as HTMLButtonElement).style.color = '#6B7280'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB'; }}>
                  <Eye size={12} /> View
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
