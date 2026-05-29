import { Component, ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'64px 24px',textAlign:'center' }}>
          <span style={{ fontSize: 48, marginBottom: 16 }}>⚠️</span>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 }}>Kuch galat ho gaya</h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24 }}>Page refresh karo ya thodi der baad try karo</p>
          <button onClick={() => window.location.reload()} className="btn-primary" style={{ padding: '10px 24px' }}>
            Refresh Karo
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
