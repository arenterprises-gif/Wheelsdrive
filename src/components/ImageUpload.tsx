// src/components/ImageUpload.tsx
// FIX: Uses @/lib/supabase (not supabaseService which throws on missing env vars)
// FIX: Proper error handling, loading states, drag-and-drop

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase'
import { Upload, X, Loader, Star } from 'lucide-react'

interface Props {
  images: string[]
  onChange: (urls: string[]) => void
}

async function uploadToSupabase(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `cars/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  
  const { error } = await supabase.storage
    .from('car-images')
    .upload(path, file, { cacheControl: '3600', upsert: false })
  
  if (error) throw new Error(error.message)
  
  const { data } = supabase.storage.from('car-images').getPublicUrl(path)
  return data.publicUrl
}

export default function ImageUpload({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return
    setUploading(true)
    setError('')
    setUploadProgress(0)

    try {
      const urls: string[] = []
      for (let i = 0; i < acceptedFiles.length; i++) {
        const url = await uploadToSupabase(acceptedFiles[i])
        urls.push(url)
        setUploadProgress(Math.round(((i + 1) / acceptedFiles.length) * 100))
      }
      onChange([...images, ...urls])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed. Check your Supabase storage bucket.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [images, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    disabled: uploading,
  })

  const remove = async (url: string) => {
    onChange(images.filter(u => u !== url))
    // Fire-and-forget delete from storage
    const path = url.split('/car-images/').pop()
    if (path) supabase.storage.from('car-images').remove([path]).catch(() => {})
  }

  const moveFirst = (url: string) => {
    onChange([url, ...images.filter(u => u !== url)])
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? '#0052CC' : uploading ? '#B3D1FF' : '#E5E7EB'}`,
          borderRadius: 12,
          padding: '28px 20px',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          background: isDragActive ? '#EBF2FF' : uploading ? '#F0F7FF' : '#FAFAFA',
          transition: 'all 0.2s',
          marginBottom: 14,
        }}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <Loader size={28} style={{ color: '#0052CC', animation: 'spin 0.7s linear infinite' }} />
            <span style={{ fontSize: 14, color: '#0052CC', fontWeight: 600 }}>
              Uploading... {uploadProgress}%
            </span>
            <div style={{ width: '60%', background: '#E5E7EB', borderRadius: 99, height: 4 }}>
              <div style={{ width: `${uploadProgress}%`, background: '#0052CC', borderRadius: 99, height: '100%', transition: 'width 0.3s' }} />
            </div>
          </div>
        ) : (
          <div style={{ color: '#64748B' }}>
            <Upload size={28} style={{ margin: '0 auto 10px', display: 'block', color: isDragActive ? '#0052CC' : '#94A3B8' }} />
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
              {isDragActive ? 'Drop photos here' : 'Drag & drop car photos'}
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>
              JPG, PNG, WEBP · Max 5MB each · Up to 10 photos
            </div>
            <div style={{
              marginTop: 12,
              display: 'inline-block',
              background: '#0052CC',
              color: '#fff',
              borderRadius: 8,
              padding: '7px 18px',
              fontSize: 13,
              fontWeight: 700,
            }}>
              Browse Files
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA',
          borderRadius: 8, padding: '10px 14px',
          color: '#DC2626', fontSize: 13, fontWeight: 500, marginBottom: 12,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8, fontWeight: 600 }}>
            {images.length} photo{images.length !== 1 ? 's' : ''} uploaded
            {images.length > 0 && <span style={{ color: '#94A3B8' }}> · First photo is the cover</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
            {images.map((url, i) => (
              <div
                key={url}
                style={{
                  position: 'relative', borderRadius: 10, overflow: 'hidden',
                  border: i === 0 ? '2.5px solid #0052CC' : '1.5px solid #E5E7EB',
                  aspectRatio: '4/3',
                }}
              >
                <img
                  src={url}
                  alt={`Photo ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {i === 0 && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(0,82,204,0.85)',
                    fontSize: 9, textAlign: 'center', padding: '3px 0',
                    color: '#fff', fontWeight: 700, letterSpacing: 0.5,
                  }}>
                    COVER
                  </div>
                )}
                <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 3 }}>
                  {i !== 0 && (
                    <button
                      onClick={() => moveFirst(url)}
                      title="Set as cover"
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none', borderRadius: 4,
                        width: 22, height: 22, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                    >
                      <Star size={11} style={{ color: '#F59E0B' }} />
                    </button>
                  )}
                  <button
                    onClick={() => remove(url)}
                    style={{
                      background: 'rgba(220,38,38,0.9)',
                      border: 'none', borderRadius: 4,
                      width: 22, height: 22, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  >
                    <X size={11} style={{ color: '#fff' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {images.length === 0 && !uploading && (
        <div style={{ color: '#94A3B8', fontSize: 12, textAlign: 'center', marginTop: 4 }}>
          No photos yet. At least 1 photo required.
        </div>
      )}
    </div>
  )
}
