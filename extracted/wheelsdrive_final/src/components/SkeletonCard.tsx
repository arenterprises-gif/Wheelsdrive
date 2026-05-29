export const SkeletonCard = () => (
  <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
    <div className="animate-pulse" style={{ height: 180, background: '#E5E7EB' }} />
    <div style={{ padding: '14px 16px' }}>
      <div className="animate-pulse" style={{ height: 18, borderRadius: 6, background: '#E5E7EB', width: '70%', marginBottom: 8 }} />
      <div className="animate-pulse" style={{ height: 14, borderRadius: 6, background: '#F3F4F6', width: '40%', marginBottom: 12 }} />
      <div className="animate-pulse" style={{ height: 22, borderRadius: 6, background: '#E5E7EB', width: '50%', marginBottom: 12 }} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <div className="animate-pulse" style={{ height: 14, borderRadius: 6, background: '#F3F4F6', width: 60 }} />
        <div className="animate-pulse" style={{ height: 14, borderRadius: 6, background: '#F3F4F6', width: 60 }} />
        <div className="animate-pulse" style={{ height: 14, borderRadius: 6, background: '#F3F4F6', width: 60 }} />
      </div>
      <div className="animate-pulse" style={{ height: 38, borderRadius: 8, background: '#E5E7EB' }} />
    </div>
  </div>
)

export const SkeletonGrid = ({ count = 8 }: { count?: number }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)
