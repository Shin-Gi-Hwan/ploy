import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

// Credentials are stored in component memory only — never in localStorage.
// Sent as Authorization: Basic <base64> on every request (HTTP Basic).

type Status = 'BRIEF_SUBMITTED' | 'IN_PROGRESS' | 'REVIEW' | 'DELIVERED'
type ProjectType = 'BUSINESS_CARD' | 'PRESENTATION' | 'WEBSITE'

interface DeliverableView {
  id: number; version: number; note: string | null; downloadUrl: string; uploadedAt: string
}
interface ClientView {
  id: number; name: string; email: string; phone: string | null
}
interface Project {
  id: number; type: ProjectType; status: Status; magicToken: string
  createdAt: string; client: ClientView; deliverables: DeliverableView[]
}

const STATUS_LABELS: Record<Status, string> = {
  BRIEF_SUBMITTED: 'Brief received',
  IN_PROGRESS:     'In progress',
  REVIEW:          'Ready for review',
  DELIVERED:       'Delivered',
}

const ALL_STATUSES: Status[] = ['BRIEF_SUBMITTED', 'IN_PROGRESS', 'REVIEW', 'DELIVERED']

function basicHeader(username: string, password: string) {
  return 'Basic ' + btoa(`${username}:${password}`)
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState(false)
  const credsRef = useRef({ username: '', password: '' })

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadingFor, setUploadingFor] = useState<number | null>(null)
  const [noteFor, setNoteFor] = useState<Record<number, string>>({})
  const [uploadErrorFor, setUploadErrorFor] = useState<Record<number, string>>({})

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setAuthError(false)
    try {
      const res = await axios.get<Project[]>('/api/admin/projects', {
        headers: { Authorization: basicHeader(username, password) },
      })
      credsRef.current = { username, password }
      setProjects(res.data)
      setAuthed(true)
    } catch {
      setAuthError(true)
    }
  }

  function api() {
    return axios.create({
      headers: { Authorization: basicHeader(credsRef.current.username, credsRef.current.password) },
    })
  }

  async function refresh() {
    setLoading(true)
    try {
      const { data } = await api().get<Project[]>('/api/admin/projects')
      setProjects(data)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(projectId: number, status: Status) {
    await api().patch(`/api/admin/projects/${projectId}/status`, { status })
    await refresh()
  }

  const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'application/zip', 'application/x-zip-compressed']
  const ALLOWED_EXTS = ['.pdf', '.png', '.jpg', '.jpeg', '.zip']

  async function uploadFile(projectId: number, file: File) {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTS.includes(ext)) {
      setUploadErrorFor(e => ({ ...e, [projectId]: `Invalid file type "${ext}". Allowed: PDF, PNG, JPG, ZIP.` }))
      return
    }
    setUploadErrorFor(e => ({ ...e, [projectId]: '' }))
    setUploadingFor(projectId)
    const form = new FormData()
    form.append('file', file)
    const note = noteFor[projectId] || ''
    if (note) form.append('note', note)
    try {
      await api().post(`/api/admin/projects/${projectId}/deliverables`, form)
      setNoteFor(n => ({ ...n, [projectId]: '' }))
      await refresh()
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setUploadErrorFor(e => ({ ...e, [projectId]: err.response?.data || 'Upload failed.' }))
      }
    } finally {
      setUploadingFor(null)
    }
  }

  useEffect(() => {
    if (authed) refresh()
  }, [authed])

  if (!authed) {
    return (
      <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', padding: '40px 36px', borderRadius: 12, width: 360, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: '#111827' }}>Admin</h1>
          {authError && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 14 }}>Wrong credentials</div>}
          <form onSubmit={login}>
            <input
              type="text" placeholder="Username" value={username}
              onChange={e => setUsername(e.target.value)}
              style={inputStyle} autoComplete="username" required
            />
            <input
              type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...inputStyle, marginTop: 12 }} autoComplete="current-password" required
            />
            <button type="submit" style={btnStyle}>Sign in</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f9fafb' }}>
      <header style={{ background: '#111827', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Ploy — Admin</span>
        <button onClick={refresh} style={{ background: 'transparent', border: '1px solid #4b5563', color: '#d1d5db', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>{projects.length} project{projects.length !== 1 ? 's' : ''}</p>

        {projects.map(p => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 2 }}>#{p.id} · {p.type.replace('_', ' ')}</p>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{p.client.name}</h2>
                <p style={{ fontSize: 14, color: '#6b7280' }}>{p.client.email}{p.client.phone ? ` · ${p.client.phone}` : ''}</p>
              </div>

              {/* Status selector */}
              <select
                value={p.status}
                onChange={e => updateStatus(p.id, e.target.value as Status)}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, cursor: 'pointer' }}
              >
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>

            {/* Tracking link */}
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 12 }}>
              Client link:{' '}
              <a href={`/track/${p.magicToken}`} target="_blank" rel="noreferrer"
                style={{ color: '#6b7280' }}>/track/{p.magicToken.slice(0, 8)}…</a>
            </p>

            {/* Deliverables */}
            {p.deliverables.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Deliverables</p>
                {p.deliverables.map(d => (
                  <div key={d.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#374151' }}>v{d.version}</span>
                    {d.note && <span style={{ fontSize: 13, color: '#6b7280', fontStyle: 'italic' }}>"{d.note}"</span>}
                    <a href={d.downloadUrl} target="_blank" rel="noreferrer"
                      style={{ fontSize: 13, color: '#111827', marginLeft: 'auto' }}>↓ Download</a>
                  </div>
                ))}
              </div>
            )}

            {/* Upload new deliverable */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Upload files</p>
              <input
                type="text"
                placeholder="Note for client (optional)"
                value={noteFor[p.id] || ''}
                onChange={e => setNoteFor(n => ({ ...n, [p.id]: e.target.value }))}
                style={{ ...inputStyle, marginBottom: 8, fontSize: 13 }}
              />
              <label style={{
                display: 'inline-block', padding: '8px 16px', background: '#f3f4f6',
                border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#374151',
              }}>
                {uploadingFor === p.id ? 'Uploading…' : 'Choose file (PDF, PNG, JPG, ZIP — max 20MB)'}
                <input type="file" accept=".pdf,.png,.jpg,.jpeg,.zip" style={{ display: 'none' }}
                  disabled={uploadingFor === p.id}
                  onChange={e => { if (e.target.files?.[0]) uploadFile(p.id, e.target.files[0]) }}
                />
              </label>
              {uploadErrorFor[p.id] && (
                <p style={{ marginTop: 8, fontSize: 13, color: '#b91c1c' }}>{uploadErrorFor[p.id]}</p>
              )}
            </div>
          </div>
        ))}

        {projects.length === 0 && !loading && (
          <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: 60 }}>No projects yet.</p>
        )}
      </main>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '10px 12px',
  border: '1px solid #d1d5db', borderRadius: 8, fontSize: 15,
  fontFamily: 'inherit', outline: 'none', display: 'block',
}
const btnStyle: React.CSSProperties = {
  width: '100%', marginTop: 20, background: '#111827', color: '#fff',
  border: 'none', padding: 12, borderRadius: 8, fontSize: 15,
  fontWeight: 600, cursor: 'pointer',
}
