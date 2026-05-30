import { useState, useCallback } from 'react'
import { supabase } from '@/services/supabaseService'
import { Upload, X, Loader } from 'lucide-react'

interface Props {
  images: string[]
  onChange: (urls: string[]) => void
}

export default function ImageUpload({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback(async (files: File[]) => {
    setUploading(true)
    setError('')
    try {
      const urls = await Promise.all(
        files.map(async (f) => {
          const filename = `${Date.now()}-${Math.random()}-${f.name}`
          const { data, error } = await supabase.storage
            .from('car-images')
            .upload(filename, f)

          if (error) throw error

          const { data: publicUrl } = supabase.storage
            .from('car-images')
            .getPublicUrl(filename)

          return publicUrl.publicUrl
        })
      )
      onChange([...images, ...urls])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [images, onChange])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length) onDrop(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length) onDrop(files)
  }

  const remove = (i: number) => {
    onChange(images.filter((_, idx) => idx !== i))
  }

  const moveFirst = (i: number) => {
    const newImages = [...images]
    const [image] = newImages.splice(i, 1)
    newImages.unshift(image)
    onChange(newImages)
  }

  return (
    <div>
      <label
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: isDragActive ? '2px solid #0052CC' : '2px dashed #E5E7EB',
          borderRadius: 12,
          padding: 28,
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          background: isDragActive ? '#EBF2FF' : '#fff',
          transition: 'all 0.2s',
        }}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        {uploading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ color: '#64748B', fontSize: 13, fontWeight: 500 }}>Uploading...</span>
          </div>
        ) : (
          <>
            <Upload size={24} style={{ margin: '0 auto', marginBottom: 8, opacity: 0.6 }} />
            <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
              Drag & drop car photos
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
              or click to select. Up to 10 photos/slide max 5MB each
            </div>
          </>
        )}
      </label>

      {error && (
        <div style={{ color: '#DC2626', fontSize: 12, marginTop: 8, fontWeight: 500 }}>
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8, fontWeight: 600 }}>
            {images.length} photo{images.length !== 1 ? 's' : ''} uploaded
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
            {images.map((url, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img
                  src={url}
                  alt={`Car ${i + 1}`}
                  style={{
                    width: '100%',
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: i === 0 ? '2px solid #0052CC' : '1px solid #E5E7EB',
                  }}
                />
                {i === 0 && (
                  <div style={{ position: 'absolute', top: 4, left: 4, background: '#0052CC', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                    MAIN
                  </div>
                )}
                <button
                  onClick={() => remove(i)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: '#DC2626',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: 4,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={14} />
                </button>
                {i !== 0 && (
                  <button
                    onClick={() => moveFirst(i)}
                    title="Set as main photo"
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      background: '#fff',
                      color: '#0052CC',
                      border: '1px solid #0052CC',
                      borderRadius: 4,
                      padding: 4,
                      cursor: 'pointer',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    ⭐
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
      }
