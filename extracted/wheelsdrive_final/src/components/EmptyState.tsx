interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export const EmptyState = ({ icon = '🔍', title, description, action }: EmptyStateProps) => (
  <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'64px 24px',textAlign:'center' }}>
    <span style={{ fontSize: 52, marginBottom: 16 }}>{icon}</span>
    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8, fontFamily: 'Nunito,Nunito,sans-serif' }}>{title}</h3>
    {description && <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 280, marginBottom: 24, lineHeight: 1.6 }}>{description}</p>}
    {action && (
      <button onClick={action.onClick} className="btn-primary" style={{ padding: '10px 24px' }}>
        {action.label}
      </button>
    )}
  </div>
)
