import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, Download, CheckCircle, XCircle } from 'lucide-react'

const CSV_COLUMNS = ['brand','model','year','price','km_driven','fuel','transmission','color','segment','owners','description']
const FUELS = ['Petrol','Diesel','CNG','Electric','Hybrid']
const TRANSMISSIONS = ['Manual','Automatic','AMT']
const SEGMENTS = ['Hatchback','Sedan','SUV','MUV','Luxury']

interface ImportRow {
  row: number
  data: Record<string, string>
  status: 'pending' | 'success' | 'error'
  error?: string
}

export const CSVImport = ({ onComplete }: { onComplete: () => void }) => {
  const fileRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<ImportRow[]>([])
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'upload' | 'preview' | 'done'>('upload')

  const downloadTemplate = () => {
    const header = CSV_COLUMNS.join(',')
    const example = ['Maruti','Swift','2021','450000','35000','Petrol','Manual','White','Hatchback','1','Excellent single owner Swift'].join(',')
    const blob = new Blob([`${header}\n${example}`], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wheelsdrive_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const parseCSV = (text: string): ImportRow[] => {
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      const data: Record<string, string> = {}
      headers.forEach((h, i) => { data[h] = values[i] || '' })
      const errs: string[] = []
      if (!data.brand) errs.push('brand required')
      if (!data.model) errs.push('model required')
      if (!data.year || isNaN(+data.year) || +data.year < 2000) errs.push('invalid year')
      if (!data.price || isNaN(+data.price) || +data.price < 10000) errs.push('invalid price')
      if (data.fuel && !FUELS.includes(data.fuel)) errs.push(`fuel: ${FUELS.join('/')}`)
      return { row: index + 2, data, status: errs.length ? 'error' : 'pending', error: errs.join(', ') || undefined }
    })
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { setRows(parseCSV(ev.target?.result as string)); setPhase('preview') }
    reader.readAsText(file)
  }

  const startImport = async () => {
    const valid = rows.filter(r => r.status === 'pending')
    setImporting(true)
    setProgress(0)
    const BATCH = 20
    let done = 0
    for (let i = 0; i < valid.length; i += BATCH) {
      const batch = valid.slice(i, i + BATCH)
      const inserts = batch.map(r => ({
        brand: r.data.brand, model: r.data.model, title: `${r.data.brand} ${r.data.model} ${r.data.year}`,
        year: +r.data.year, price: +r.data.price, km_driven: +r.data.km_driven || 0,
        fuel: r.data.fuel || 'Petrol', transmission: r.data.transmission || 'Manual',
        color: r.data.color || 'White', segment: r.data.segment || 'Hatchback',
        owners: +r.data.owners || 1, description: r.data.description || '',
        price_category: +r.data.price < 300000 ? 'Budget' : +r.data.price < 600000 ? 'Economy' : +r.data.price < 1000000 ? 'Mid-Range' : +r.data.price < 1500000 ? 'Premium' : 'Luxury',
        is_sold: false, is_featured: false, is_hot_deal: false, images: [], features: [],
        condition: 'Good',
      }))
      const { error } = await supabase.from('cars').insert(inserts)
      setRows(prev => prev.map(row => {
        if (!batch.find(b => b.row === row.row)) return row
        return { ...row, status: error ? 'error' : 'success', error: error?.message }
      }))
      done += batch.length
      setProgress(Math.round((done / valid.length) * 100))
      await new Promise(r => setTimeout(r, 100))
    }
    setImporting(false)
    setPhase('done')
    setTimeout(onComplete, 1500)
  }

  const validCount = rows.filter(r => r.status === 'pending').length
  const errorCount = rows.filter(r => r.status === 'error').length

  if (phase === 'upload') return (
    <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
      <div
        onClick={() => fileRef.current?.click()}
        style={{ border:'2px dashed var(--color-border)',borderRadius:16,padding:'40px 24px',textAlign:'center',cursor:'pointer',transition:'border-color 0.2s,background 0.2s' }}
        onMouseEnter={e=>{const d=e.currentTarget as HTMLDivElement;d.style.borderColor='#0052CC';d.style.background='#EBF2FF'}}
        onMouseLeave={e=>{const d=e.currentTarget as HTMLDivElement;d.style.borderColor='#E3F2FD';d.style.background=''}}
      >
        <Upload size={32} style={{ color:'#94A3B8',margin:'0 auto 12px' }}/>
        <p style={{ color:'#4A5568',marginBottom:4,fontWeight:600 }}>CSV file choose karo</p>
        <p style={{ color:'#94A3B8',fontSize:12 }}>Max 500 cars ek baar mein</p>
        <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} style={{ display:'none' }}/>
      </div>
      <button onClick={downloadTemplate} style={{ display:'flex',alignItems:'center',gap:8,color:'#0052CC',background:'none',border:'none',cursor:'pointer',fontSize:13,fontWeight:600 }}>
        <Download size={15}/> Template Download Karo
      </button>
    </div>
  )

  if (phase === 'preview') return (
    <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8 }}>
        <div style={{ display:'flex',gap:16 }}>
          <span style={{ color:'#10B981',fontSize:13,display:'flex',alignItems:'center',gap:4 }}><CheckCircle size={14}/> {validCount} ready</span>
          {errorCount>0&&<span style={{ color:'#EF4444',fontSize:13,display:'flex',alignItems:'center',gap:4 }}><XCircle size={14}/> {errorCount} errors</span>}
        </div>
        <button onClick={startImport} disabled={validCount===0||importing} className="btn-primary" style={{ padding:'9px 20px',fontSize:13 }}>
          {validCount} Cars Import Karo
        </button>
      </div>
      {errorCount>0&&(
        <div style={{ background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,padding:'10px 14px' }}>
          <p style={{ fontSize:13,fontWeight:700,color:'#EF4444',marginBottom:6 }}>Fix karo CSV mein:</p>
          {rows.filter(r=>r.status==='error').map(r=>(
            <p key={r.row} style={{ fontSize:12,color:'#EF4444' }}>Row {r.row}: {r.error}</p>
          ))}
        </div>
      )}
      <div style={{ overflowX:'auto',maxHeight:260,border:'1px solid var(--color-border)',borderRadius:10 }}>
        <table style={{ width:'100%',borderCollapse:'collapse',fontSize:13 }}>
          <thead style={{ background:'#F0F7FF',position:'sticky',top:0 }}>
            <tr>{['Row','Car','Price','Status'].map(h=><th key={h} style={{ textAlign:'left',padding:'8px 12px',color:'#4A5568',fontWeight:600 }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.row} style={{ borderTop:'1px solid var(--color-border-light)' }}>
                <td style={{ padding:'8px 12px',color:'#94A3B8' }}>{r.row}</td>
                <td style={{ padding:'8px 12px' }}>{r.data.brand} {r.data.model} {r.data.year}</td>
                <td style={{ padding:'8px 12px' }}>₹{(+r.data.price||0).toLocaleString('en-IN')}</td>
                <td style={{ padding:'8px 12px' }}>
                  {r.status==='error'?<span style={{ color:'#EF4444',fontSize:11 }}>{r.error}</span>
                  :r.status==='success'?<span style={{ color:'#10B981',fontSize:11 }}>✓ Imported</span>
                  :<span style={{ color:'#94A3B8',fontSize:11 }}>Ready</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div style={{ textAlign:'center',padding:'32px 0' }}>
      {importing ? (
        <>
          <div style={{ width:'100%',background:'#E3F2FD',borderRadius:99,height:6,marginBottom:12 }}>
            <div style={{ width:`${progress}%`,background:'#0052CC',borderRadius:99,height:'100%',transition:'width 0.3s' }}/>
          </div>
          <p style={{ color:'#4A5568' }}>{progress}% complete...</p>
        </>
      ) : (
        <>
          <CheckCircle size={48} style={{ color:'#10B981',margin:'0 auto 12px' }}/>
          <p style={{ fontWeight:700,color:'#1A202C' }}>Import complete!</p>
          <p style={{ fontSize:13,color:'#4A5568',marginTop:4 }}>
            {rows.filter(r=>r.status==='success').length} cars add kiye
          </p>
        </>
      )}
    </div>
  )
}
