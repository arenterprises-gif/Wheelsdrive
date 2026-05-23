import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchInquiries, markInquiryRead, deleteInquiry } from '@/lib/queries'
import { waLink } from '@/lib/utils'
import { Trash2, MessageCircle, CheckCheck } from 'lucide-react'

export default function AdminInquiries() {
  const qc = useQueryClient()
  const { data: inquiries, isLoading } = useQuery({ queryKey: ['inquiries'], queryFn: fetchInquiries })

  const markRead = useMutation({
    mutationFn: markInquiryRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inquiries'] }),
  })

  const del = useMutation({
    mutationFn: deleteInquiry,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inquiries'] }),
  })

  const unread = inquiries?.filter(i => !i.is_read).length || 0

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, color: '#fff', marginBottom: 4 }}>
          Inquiries {unread > 0 && <span style={{ background: '#dc2626', color: '#fff', fontSize: 13, padding: '3px 10px', borderRadius: 10, marginLeft: 10, fontFamily: 'DM Sans,sans-serif' }}>{unread} new</span>}
        </h1>
        <p style={{ color: '#555', fontSize: 13 }}>{inquiries?.length || 0} total inquiries</p>
      </div>

      {isLoading ? (
        <div style={{ padding: 60, textAlign: 'center' }}><div className="spinner" /></div>
      ) : !inquiries?.length ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#444' }}>
          <MessageCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <div>No inquiries yet. They'll appear here when customers contact you.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {inquiries.map(inq => (
            <div key={inq.id} className="card"
              style={{ padding: 18, borderLeft: !inq.is_read ? '3px solid #dc2626' : '3px solid transparent', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    {!inq.is_read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', flexShrink: 0 }} />}
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{inq.customer_name || 'Customer'}</span>
                    {inq.phone && <span style={{ color: '#888', fontSize: 13 }}>{inq.phone}</span>}
                    <span style={{ color: '#333', fontSize: 11 }}>{new Date(inq.created_at).toLocaleString('en-IN')}</span>
                  </div>
                  {inq.car_title && (
                    <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 6 }}>Re: {inq.car_title}</div>
                  )}
                  <p style={{ color: '#999', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{inq.message}</p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
                  {inq.phone && (
                    <a href={waLink(`Hi ${inq.customer_name || ''}, thank you for your inquiry about ${inq.car_title}. `)}
                      target="_blank" rel="noreferrer"
                      style={{ background: '#16a34a22', border: '1px solid #16a34a44', color: '#16a34a', borderRadius: 8, padding: '7px 12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
                      <MessageCircle size={13} /> Reply
                    </a>
                  )}
                  {!inq.is_read && (
                    <button onClick={() => markRead.mutate(inq.id)}
                      style={{ background: '#1a1a3e', border: '1px solid #1e1e3a', color: '#888', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <CheckCheck size={13} /> Mark Read
                    </button>
                  )}
                  <button onClick={() => del.mutate(inq.id)}
                    style={{ background: '#7f1d1d22', border: '1px solid #7f1d1d44', color: '#dc2626', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
