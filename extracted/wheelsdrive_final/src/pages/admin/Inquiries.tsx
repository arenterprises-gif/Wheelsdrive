import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchInquiries, markInquiryRead, deleteInquiry } from '@/lib/queries'
import { waLink } from '@/lib/utils'
import { Trash2, MessageCircle, CheckCheck, Clock } from 'lucide-react'

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
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: 26, color: '#111827' }}>Inquiries</h1>
          {unread > 0 && (
            <span style={{ background: '#0052CC', color: '#fff', fontSize: 12, padding: '3px 12px', borderRadius: 20, fontWeight: 700, fontFamily: 'Nunito,sans-serif' }}>
              {unread} new
            </span>
          )}
        </div>
        <p style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 500 }}>{inquiries?.length || 0} total inquiries</p>
      </div>

      {isLoading ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div className="spinner" />
          <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 12 }}>Loading inquiries...</div>
        </div>
      ) : !inquiries?.length ? (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 20, textAlign: 'center', padding: '60px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <MessageCircle size={48} style={{ margin: '0 auto 14px', color: '#E5E7EB' }} />
          <div style={{ fontWeight: 700, fontSize: 16, color: '#374151', marginBottom: 6 }}>No inquiries yet</div>
          <div style={{ color: '#9CA3AF', fontSize: 13 }}>Customer inquiries will appear here when they contact you.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {inquiries.map(inq => (
            <div
              key={inq.id}
              style={{
                background: '#FFFFFF',
                border: `1.5px solid ${!inq.is_read ? '#B3D1FF' : '#E5E7EB'}`,
                borderRadius: 16,
                padding: '18px 20px',
                boxShadow: !inq.is_read ? '0 2px 12px rgba(0,82,204,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    {!inq.is_read && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0052CC', flexShrink: 0, display: 'inline-block' }} />
                    )}
                    <span style={{ color: '#111827', fontWeight: 800, fontSize: 15, fontFamily: 'Nunito,sans-serif' }}>
                      {inq.customer_name || 'Customer'}
                    </span>
                    {inq.phone && (
                      <span style={{ color: '#6B7280', fontSize: 13, fontWeight: 500, background: '#F9FAFB', padding: '2px 8px', borderRadius: 6, border: '1px solid #E5E7EB' }}>
                        📞 {inq.phone}
                      </span>
                    )}
                    <span style={{ color: '#9CA3AF', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} /> {new Date(inq.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Car reference */}
                  {inq.car_title && (
                    <div style={{ color: '#0052CC', fontSize: 13, marginBottom: 8, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      🚗 Re: {inq.car_title}
                    </div>
                  )}

                  {/* Message */}
                  <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                    {inq.message}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 7, flexShrink: 0, flexWrap: 'wrap' }}>
                  {inq.phone && (
                    <a
                      href={waLink(`Hi ${inq.customer_name || ''}, thank you for your inquiry about ${inq.car_title}. `)}
                      target="_blank" rel="noreferrer"
                      style={{
                        background: '#F0FDF4', border: '1.5px solid #BBF7D0',
                        color: '#16A34A', borderRadius: 9, padding: '8px 13px',
                        textDecoration: 'none', display: 'flex',
                        alignItems: 'center', gap: 6, fontSize: 13,
                        fontWeight: 700, fontFamily: 'Nunito,sans-serif',
                        transition: 'all 0.18s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#16A34A'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#F0FDF4'; (e.currentTarget as HTMLAnchorElement).style.color = '#16A34A'; }}>
                      <MessageCircle size={13} /> Reply
                    </a>
                  )}
                  {!inq.is_read && (
                    <button
                      onClick={() => markRead.mutate(inq.id)}
                      style={{
                        background: '#EFF6FF', border: '1.5px solid #BFDBFE',
                        color: '#1D4ED8', borderRadius: 9, padding: '8px 13px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        gap: 6, fontSize: 13, fontWeight: 700,
                        fontFamily: 'Nunito,sans-serif', transition: 'all 0.18s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1D4ED8'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EFF6FF'; (e.currentTarget as HTMLButtonElement).style.color = '#1D4ED8'; }}>
                      <CheckCheck size={13} /> Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => del.mutate(inq.id)}
                    style={{
                      background: '#FEF2F2', border: '1.5px solid #FECACA',
                      color: '#DC2626', borderRadius: 9, padding: '8px 10px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center',
                      fontSize: 12, transition: 'all 0.18s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#DC2626'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'; (e.currentTarget as HTMLButtonElement).style.color = '#DC2626'; }}>
                    <Trash2 size={14} />
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
