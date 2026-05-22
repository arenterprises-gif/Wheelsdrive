import { useState } from 'react'
import { Car } from '@/types'
import { fmt, fmtFull, calcEMI, waLink } from '@/lib/utils'
import { X } from 'lucide-react'

export default function EMIModal({ car, onClose }: { car: Car; onClose: () => void }) {
  const [dp, setDp] = useState(Math.round(car.price * 0.2))
  const [rate, setRate] = useState(9.5)
  const [tenure, setTenure] = useState(36)

  const loan = car.price - dp
  const emi = calcEMI(loan, rate, tenure)
  const totalPay = emi * tenure
  const totalInt = totalPay - loan

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        className="fade-up"
        style={{ background: '#111127', borderRadius: 20, padding: 28, width: '100%', maxWidth: 440, border: '1px solid #1e1e3a', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, color: '#fff' }}>EMI Calculator</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ background: '#0d0d20', borderRadius: 10, padding: 14, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#666', fontSize: 12 }}>Car</div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{car.title}</div>
          </div>
          <div style={{ color: '#dc2626', fontWeight: 800, fontSize: 20, fontFamily: 'Syne,sans-serif' }}>{fmt(car.price)}</div>
        </div>

        {[
          { label: `Down Payment: ${fmt(dp)}`, val: dp, set: setDp, min: car.price * 0.1, max: car.price * 0.7, step: 5000 },
          { label: `Interest Rate: ${rate}% p.a.`, val: rate, set: setRate, min: 6.5, max: 18, step: 0.25 },
          { label: `Tenure: ${tenure} months (${Math.round(tenure / 12 * 10) / 10} yrs)`, val: tenure, set: setTenure, min: 12, max: 84, step: 6 },
        ].map(({ label, val, set, min, max, step }) => (
          <div key={label} style={{ marginBottom: 18 }}>
            <div style={{ color: '#9999bb', fontSize: 13, marginBottom: 6 }}>{label}</div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={e => set(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#dc2626', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }} />
          </div>
        ))}

        <div style={{ background: 'linear-gradient(135deg,#1a0808,#0d0d20)', border: '1px solid #dc262633', borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 16 }}>
          <div style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>Monthly EMI</div>
          <div style={{ color: '#dc2626', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 40 }}>₹{emi.toLocaleString('en-IN')}</div>
          <div style={{ color: '#555', fontSize: 12, marginTop: 8 }}>Loan: {fmt(loan)} · {tenure} months · {rate}% p.a.</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[['Total Payment', fmtFull(totalPay)], ['Total Interest', fmtFull(totalInt)]].map(([l, v]) => (
            <div key={l} style={{ background: '#0d0d20', borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <div style={{ color: '#666', fontSize: 11, marginBottom: 4 }}>{l}</div>
              <div style={{ color: '#ccc', fontWeight: 600, fontSize: 15 }}>{v}</div>
            </div>
          ))}
        </div>

        <a href={waLink(`Hi, I want to inquire about EMI for ${car.title} (${fmt(car.price)}). Down Payment: ${fmt(dp)}, EMI: ₹${emi.toLocaleString('en-IN')}/month for ${tenure} months at ${rate}% p.a.`)}
          target="_blank" rel="noreferrer"
          className="btn-red"
          style={{ display: 'block', textAlign: 'center', textDecoration: 'none', borderRadius: 10, padding: '12px 0', fontSize: 14, background: '#16a34a' }}>
          📱 Apply on WhatsApp
        </a>
      </div>
    </div>
  )
}
