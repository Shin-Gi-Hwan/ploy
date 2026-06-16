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

const C = {
  cream:   '#f5f1eb',
  surface: '#fdfcfa',
  ink:     '#1a1715',
  mid:     '#736b63',
  low:     '#a89e94',
  border:  '#e4ddd4',
  sage:    '#8a9e86',
}

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
      <div style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        minHeight: '100vh',
        background: C.cream,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: '48px 44px',
          width: '100%',
          maxWidth: 380,
        }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: C.sage, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
            Admin
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: C.ink, marginBottom: 32 }}>
            Sign in
          </h1>
          {authError && (
            <div style={{
              background: '#fdf2f2',
              border: '1px solid #e4c5c5',
              color: '#8b4040',
              borderRadius: 6,
              padding: '12px 16px',
              marginBottom: 24,
              fontSize: 13,
            }}>
              Wrong credentials. Please try again.
            </div>
          )}
          <form onSubmit={login}>
            <input
              type="text" placeholder="Username" value={username}
              onChange={e => setUsername(e.target.value)}
              style={S.input} autoComplete="username" required
            />
            <input
              type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...S.input, marginTop: 12 }} autoComplete="current-password" required
            />
            <button type="submit" style={S.btn}>Sign in</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', background: C.cream }}>
      <header style={{
        background: C.ink,
        padding: '18px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: '#faf8f5', letterSpacing: '0.02em' }}>
          Ploy
        </span>
        <button onClick={refresh} style={{
          background: 'transparent',
          border: `1px solid rgba(255,255,255,0.2)`,
          color: 'rgba(255,255,255,0.6)',
          padding: '6px 16px',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 12,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '0.06em',
        }}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
        <p style={{ fontSize: 12, color: C.low, marginBottom: 28, letterSpacing: '0.04em' }}>
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </p>

        {projects.map(p => (
          <div key={p.id} style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: '28px',
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
              <div>
                <p style={{ fontSize: 11, color: C.low, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                  #{p.id} · {p.type.replace('_', ' ')}
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: C.ink, marginBottom: 4 }}>
                  {p.client.name}
                </h2>
                <p style={{ fontSize: 13, color: C.mid, fontWeight: 300 }}>
                  {p.client.email}{p.client.phone ? ` · ${p.client.phone}` : ''}
                </p>
              </div>

              <select
                value={p.status}
                onChange={e => updateStatus(p.id, e.target.value as Status)}
                style={{
                  padding: '9px 12px',
                  borderRadius: 6,
                  border: `1px solid ${C.border}`,
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  cursor: 'pointer',
                  background: C.cream,
                  color: C.ink,
                  outline: 'none',
                }}
              >
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>

            {/* Tracking link */}
            <p style={{ fontSize: 12, color: C.low, marginBottom: p.deliverables.length > 0 ? 0 : 16 }}>
              Client link:{' '}
              <a href={`/track/${p.magicToken}`} target="_blank" rel="noreferrer"
                style={{ color: C.mid, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                /track/{p.magicToken.slice(0, 8)}…
              </a>
            </p>

            {/* Deliverables */}
            {p.deliverables.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                <p style={{ fontSize: 10, fontWeight: 500, color: C.low, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>
                  Deliverables
                </p>
                {p.deliverables.map(d => (
                  <div key={d.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: C.low, fontWeight: 500, minWidth: 24 }}>v{d.version}</span>
                    {d.note && <span style={{ fontSize: 13, color: C.mid, fontStyle: 'italic', fontWeight: 300 }}>"{d.note}"</span>}
                    <a href={d.downloadUrl} target="_blank" rel="noreferrer"
                      style={{ fontSize: 12, color: C.ink, marginLeft: 'auto', textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap' }}>
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Upload new deliverable */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 10, fontWeight: 500, color: C.low, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>
                Upload files
              </p>
              <input
                type="text"
                placeholder="Note for client (optional)"
                value={noteFor[p.id] || ''}
                onChange={e => setNoteFor(n => ({ ...n, [p.id]: e.target.value }))}
                style={{ ...S.input, marginBottom: 10, fontSize: 13 }}
              />
              <label style={{
                display: 'inline-block',
                padding: '9px 18px',
                background: C.cream,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                cursor: uploadingFor === p.id ? 'default' : 'pointer',
                fontSize: 13,
                color: C.mid,
                fontFamily: "'Inter', sans-serif",
              }}>
                {uploadingFor === p.id ? 'Uploading…' : 'Choose file — PDF, PNG, JPG, ZIP (max 20 MB)'}
                <input type="file" accept=".pdf,.png,.jpg,.jpeg,.zip" style={{ display: 'none' }}
                  disabled={uploadingFor === p.id}
                  onChange={e => { if (e.target.files?.[0]) uploadFile(p.id, e.target.files[0]) }}
                />
              </label>
              {uploadErrorFor[p.id] && (
                <p style={{ marginTop: 8, fontSize: 13, color: '#8b4040' }}>{uploadErrorFor[p.id]}</p>
              )}
            </div>
          </div>
        ))}

        {projects.length === 0 && !loading && (
          <p style={{ color: C.low, textAlign: 'center', marginTop: 80, fontSize: 14, fontWeight: 300 }}>
            No projects yet.
          </p>
        )}
      </main>
    </div>
  )
}

const S = {
  input: {
    width: '100%',
    boxSizing: 'border-box' as const,
    padding: '11px 14px',
    border: `1px solid ${C.border}`,
    borderRadius: 6,
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    display: 'block',
    background: C.cream,
    color: C.ink,
  },
  btn: {
    width: '100%',
    marginTop: 20,
    background: C.ink,
    color: '#faf8f5',
    border: 'none',
    padding: '14px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '0.08em',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,
}
