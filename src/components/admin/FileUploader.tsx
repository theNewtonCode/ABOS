import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

interface Props {
  bucket: string
  currentUrl?: string | null
  accept?: Record<string, string[]>
  label?: string
  onUploaded: (url: string) => void
  onClear?: () => void
  preview?: 'image' | 'filename'
}

export default function FileUploader({ bucket, currentUrl, accept, label = 'Drop file or click to upload', onUploaded, onClear, preview = 'image' }: Props) {
  const { token } = useAdminAuth()
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setUploading(true)
    setError('')
    setProgress(10)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', bucket)
    formData.append('path', `${Date.now()}-${file.name}`)

    try {
      setProgress(40)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      setProgress(80)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Upload failed')
      setProgress(100)
      onUploaded(json.url)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 600)
    }
  }, [bucket, token, onUploaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept, multiple: false, disabled: uploading,
  })

  return (
    <div>
      {currentUrl && preview === 'image' && (
        <div style={{ marginBottom: 8, position: 'relative', display: 'inline-block' }}>
          <img src={currentUrl} alt="preview" style={{ height: 80, borderRadius: 3, border: '1px solid #00ff4633', display: 'block' }} />
          {onClear && (
            <button onClick={onClear} style={{ position: 'absolute', top: -6, right: -6, background: '#ff5f57', border: 'none', borderRadius: '50%', width: 16, height: 16, cursor: 'pointer', fontSize: 10, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          )}
        </div>
      )}
      {currentUrl && preview === 'filename' && (
        <div style={{ fontSize: 11, color: '#00ff4699', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>📄 {currentUrl.split('/').pop()}</span>
          {onClear && <button onClick={onClear} style={{ background: 'none', border: 'none', color: '#ff5f57', cursor: 'pointer', fontSize: 11 }}>✕ remove</button>}
        </div>
      )}

      <div
        {...getRootProps()}
        style={{
          border: `1px dashed ${isDragActive ? '#00ff46' : '#00ff4444'}`,
          borderRadius: 4, padding: '16px 20px', textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          background: isDragActive ? '#00ff4608' : 'transparent',
          color: '#00ff4666', fontSize: 12, transition: 'all 0.15s',
        }}
      >
        <input {...getInputProps()} />
        <div>{uploading ? 'uploading...' : isDragActive ? 'drop it →' : label}</div>
      </div>

      {progress > 0 && (
        <div style={{ height: 3, background: '#00ff4620', borderRadius: 2, marginTop: 6 }}>
          <div style={{ height: '100%', background: '#00ff46', borderRadius: 2, width: `${progress}%`, transition: 'width 0.3s' }} />
        </div>
      )}
      {error && <div style={{ color: '#ff5f57', fontSize: 11, marginTop: 4 }}>{error}</div>}
    </div>
  )
}
