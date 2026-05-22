import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadCarImage, deleteCarImage } from '@/lib/queries'
import { Upload, X, Loader } from 'lucide-react'

interface Props {
  images: string[]
  onChange: (urls: string[]) => void
}

export default function ImageUpload({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const onDrop = useCallback(async (files: File[]) => {
    setUploading(true)
    setError('')
    try {
      const urls = await Promise.all(files.map(f => uploadCarImage(f)))
      onChange([...images, ...urls])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [images, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
  })

  const remove = async (url: string) => {
    onChange(images.filter(u => u !== url))
    await deleteCarImage(url).catch(() => {})
  }

  const moveFirst = (url: string) => {
    onChange([url, ...images.filter(u => u !== url)])
  }

  return (
    <div>
      {/* Drop zone */}
      <div {...getRootProps()} style={{
        border: `2px dashed ${isDragActive ? '#dc2626' : '#1e1e3a'}`,
        borderRadius: 12,
        padding: 28,
        textAlign: 'center',
        cursor: 'pointer',
        background: isDragActive ? '#1a0808' : '#0d0d20',
        transition: 'all 0.2s',
        marginBottom: 14,
      }}>
        <input {...getInputProps()} />
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: '#888' }}>
            <Loader size={28} className="animate-spin" style={{ animation: 'spin 0.7s linear infinite' }} />
            <span style={{ fontSize: 14 }}>Uploading...</span>
          </div>
        ) : (
          <div style={{ color: '#666' }}>
            <Upload size={28} style={{ margin: '0 auto 8px', display: 'block' }} />
            <div style={{ fontSize: 14, marginBottom: 4 }}>{isDragActive ? 'Drop images here' : 'Drag & drop car photos'}</div>
            <div style={{ fontSize: 12, color: '#444' }}>JPG, PNG, WEBP · Max 5MB each · Up to 10 photos</div>
          </div>
        )}
      </div>
      {error && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 10 }}>{error}</div>}

      {/* Preview grid */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
          {images.map((url, i) => (
            <div key={url} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: i === 0 ? '2px solid #dc2626' : '1px solid #1e1e3a' }}>
              <img src={url} alt="" style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block' }} />
              {i === 0 && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(220,38,38,0.85)', fontSize: 10, textAlign: 'center', padding: '2px 0', color: '#fff', fontWeight: 700 }}>
                  COVER
                </div>
              )}
              <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 4 }}>
                {i !== 0 && (
                  <button onClick={() => moveFirst(url)} title="Set as cover"
                    style={{ background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: 4, color: '#fff', width: 20, height: 20, cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ★
                  </button>
                )}
                <button onClick={() => remove(url)}
                  style={{ background: 'rgba(220,38,38,0.8)', border: 'none', borderRadius: 4, color: '#fff', width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {images.length === 0 && (
        <div style={{ color: '#444', fontSize: 12, textAlign: 'center', marginTop: 4 }}>No photos yet. Upload at least 1 photo.</div>
      )}
    </div>
  )
}
