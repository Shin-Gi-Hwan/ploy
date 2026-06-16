import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import AdminLayout from '../components/layout/AdminLayout'
import Button from '../components/ui/Button'
import { StatusBadge } from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import Card from '../components/ui/Card'
import {
  getAdminProjects,
  updateProjectStatus,
  uploadDeliverable,
  getErrorMessage,
} from '../lib/api'
import type { AdminProject, ProjectStatus } from '../types/api'
import { PROJECT_TYPE_LABELS, PROJECT_STATUS_LABELS, PROJECT_STATUS_ORDER } from '../types/api'

const ALLOWED_EXTS  = ['.pdf', '.png', '.jpg', '.jpeg', '.zip']
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'application/zip', 'application/x-zip-compressed']

// ─── Login ────────────────────────────────────────────────────────────────────

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<void>
}

function Login({ onLogin }: LoginProps) {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await onLogin(username, password)
    } catch {
      setError(t('admin.invalidCredentials'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100svh', background: 'var(--bg-subtle)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-6)',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 700, color: 'var(--mint-600)', letterSpacing: '-0.03em' }}>
            Ploy
          </a>
          <p style={{ marginTop: 'var(--space-2)', fontSize: 14, color: 'var(--text-muted)' }}>
            {t('admin.dashboard')}
          </p>
        </div>

        <Card>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-6)' }}>
            {t('admin.signIn')}
          </h1>

          {error && (
            <div className="alert alert-error" role="alert" style={{ marginBottom: 'var(--space-5)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="field">
              <label htmlFor="admin-username" className="field-label field-label-required">{t('admin.username')}</label>
              <input
                id="admin-username"
                type="text"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="admin-password" className="field-label field-label-required">{t('admin.password')}</label>
              <input
                id="admin-password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" size="md" loading={loading} style={{ marginTop: 'var(--space-2)' }}>
              {t('admin.signIn')}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

// ─── Project card ─────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: AdminProject
  onStatusChange: (id: number, status: ProjectStatus) => Promise<void>
  onUpload: (id: number, file: File, note: string) => Promise<void>
}

function ProjectCard({ project: p, onStatusChange, onUpload }: ProjectCardProps) {
  const { t, i18n } = useTranslation()
  const [note, setNote]             = useState('')
  const [uploading, setUploading]   = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTS.includes(ext)) {
      setUploadError(t('admin.fileTypeError', { ext }))
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setUploadError(null)
    setUploading(true)
    try {
      await onUpload(p.id, file, note)
      setNote('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setUploadError(getErrorMessage(err, 'admin.uploadFailed'))
    } finally {
      setUploading(false)
    }
  }

  const createdDate = new Date(p.createdAt).toLocaleDateString(i18n.language, {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <Card style={{ marginBottom: 'var(--space-4)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-5)', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
              #{p.id} · {t(PROJECT_TYPE_LABELS[p.type])}
            </span>
            <StatusBadge status={p.status} />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
            {p.client.name}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {p.client.email}
            {p.client.phone && ` · ${p.client.phone}`}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
            {t('admin.submitted', { date: createdDate })}
          </p>
        </div>

        {/* Status selector */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <select
            value={p.status}
            onChange={(e) => onStatusChange(p.id, e.target.value as ProjectStatus)}
            className="select"
            style={{ paddingRight: 32, minWidth: 160, fontSize: 13 }}
            aria-label={t('admin.changeStatus', { name: p.client.name })}
          >
            {PROJECT_STATUS_ORDER.map((s) => (
              <option key={s} value={s}>{t(PROJECT_STATUS_LABELS[s])}</option>
            ))}
          </select>
          <svg aria-hidden="true" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--gray-400)' }} width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3.5 5.5L7 9l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Client tracking link */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{t('admin.trackingLink')}</p>
        <a
          href={`/track/${p.magicToken}`}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 13, color: 'var(--mint-600)', textDecoration: 'underline', textUnderlineOffset: 3, wordBreak: 'break-all' }}
        >
          /track/{p.magicToken}
        </a>
      </div>

      {/* Deliverables list */}
      {p.deliverables.length > 0 && (
        <div style={{ marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-5)', borderBottom: '1px solid var(--border-default)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-3)' }}>
            {t('admin.deliverables')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {p.deliverables.map((d) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--mint-600)', minWidth: 28 }}>
                  {t('admin.version', { version: d.version })}
                </span>
                {d.note && (
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.note}
                  </span>
                )}
                <a
                  href={d.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 13, color: 'var(--mint-600)', textDecoration: 'underline', textUnderlineOffset: 3, flexShrink: 0, marginLeft: 'auto' }}
                >
                  {t('admin.download')}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload section */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-3)' }}>
          {t('admin.uploadDeliverable')}
        </p>
        <input
          type="text"
          className="input"
          placeholder={t('admin.noteForClient')}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ marginBottom: 'var(--space-3)', fontSize: 14 }}
        />
        <label style={{ display: 'inline-block', cursor: uploading ? 'default' : 'pointer' }}>
          <span
            className="btn btn-secondary btn-sm"
            style={{ cursor: uploading ? 'default' : 'pointer', opacity: uploading ? 0.5 : 1 }}
            aria-busy={uploading}
          >
            {uploading ? (
              <>
                <span className="spinner spinner-sm" />
                {t('admin.uploading')}
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 10V3M4 6l3-3 3 3M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t('admin.chooseFile')}
              </>
            )}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.zip"
            style={{ display: 'none' }}
            disabled={uploading}
            onChange={handleFileChange}
            aria-label={t('admin.uploadDeliverable')}
          />
        </label>
        <span style={{ marginLeft: 'var(--space-3)', fontSize: 12, color: 'var(--text-muted)' }}>
          {t('admin.fileFormats')}
        </span>

        {uploadError && (
          <div className="alert alert-error" role="alert" style={{ marginTop: 'var(--space-3)' }}>
            {uploadError}
          </div>
        )}
      </div>
    </Card>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function Admin() {
  const { t } = useTranslation()
  const [authed,   setAuthed]   = useState(false)
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [loading,  setLoading]  = useState(false)
  const credsRef = useRef({ username: '', password: '' })

  async function login(username: string, password: string) {
    const data = await getAdminProjects(username, password)
    credsRef.current = { username, password }
    setProjects(data)
    setAuthed(true)
  }

  async function refresh() {
    setLoading(true)
    try {
      const data = await getAdminProjects(credsRef.current.username, credsRef.current.password)
      setProjects(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id: number, status: ProjectStatus) {
    await updateProjectStatus(id, status, credsRef.current.username, credsRef.current.password)
    await refresh()
  }

  async function handleUpload(id: number, file: File, note: string) {
    await uploadDeliverable(id, file, note || undefined, credsRef.current.username, credsRef.current.password)
    await refresh()
  }

  useEffect(() => {
    if (authed) refresh()
  }, [authed])

  if (!authed) return <Login onLogin={login} />

  return (
    <AdminLayout onRefresh={refresh} refreshing={loading}>
      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {[
          { label: t('admin.total'),      value: projects.length },
          { label: t('admin.inProgress'), value: projects.filter((p) => p.status === 'IN_PROGRESS').length },
          { label: t('admin.forReview'),  value: projects.filter((p) => p.status === 'REVIEW').length },
          { label: t('admin.delivered'),  value: projects.filter((p) => p.status === 'DELIVERED').length },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: '#fff', border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)', padding: 'var(--space-4) var(--space-5)',
            minWidth: 100,
          }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {stat.value}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Project list */}
      {loading && projects.length === 0 ? (
        <Spinner fullPage />
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-20) 0', color: 'var(--text-muted)', fontSize: 15 }}>
          {t('admin.noProjects')}
        </div>
      ) : (
        projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            onStatusChange={handleStatusChange}
            onUpload={handleUpload}
          />
        ))
      )}
    </AdminLayout>
  )
}
