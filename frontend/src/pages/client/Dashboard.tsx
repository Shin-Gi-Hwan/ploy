import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { getMyProjects } from '../../lib/api'
import type { Project } from '../../types/api'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'

// ─── Status badge colors ───────────────────────────────────────────────────────

function statusVariant(status: string): 'default' | 'info' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'COMPLETED':  return 'success'
    case 'REVIEW':     return 'warning'
    case 'REJECTED':   return 'error'
    case 'IN_PROGRESS':
    case 'ASSIGNED':   return 'info'
    default:           return 'default'
  }
}

// ─── Recent project row ───────────────────────────────────────────────────────

function ProjectRow({ project }: { project: Project }) {
  const { t } = useTranslation()
  return (
    <div className="client-project-row">
      <div className="client-project-info">
        <span className="client-project-title">{project.title}</span>
        <span className="client-project-type">{t(`type.${project.serviceType}`)}</span>
      </div>
      <Badge variant={statusVariant(project.status)}>
        {t(`status.${project.status}`)}
      </Badge>
      <span className="client-project-date">
        {new Date(project.createdAt).toLocaleDateString()}
      </span>
      <Link to={`/client/projects/${project.id}`} className="client-project-link">
        {t('dashboard.view')} →
      </Link>
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`client-stat-card${accent ? ' accent' : ''}`}>
      <span className="client-stat-value">{value}</span>
      <span className="client-stat-label">{label}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClientDashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    getMyProjects()
      .then(setProjects)
      .catch(() => setError(t('errors.somethingWentWrong')))
      .finally(() => setLoading(false))
  }, [t])

  const active    = projects.filter(p => !['COMPLETED', 'REJECTED'].includes(p.status))
  const completed = projects.filter(p => p.status === 'COMPLETED')
  const recent    = projects.slice(0, 5)

  const greeting = t('dashboard.greeting', { name: user?.name ?? '' })

  return (
    <DashboardLayout title={t('dashboard.nav.overview')}>
      {/* ── Greeting ── */}
      <div className="client-greeting">
        <h2 className="client-greeting-text">{greeting}</h2>
        <Link to="/client/request">
          <button className="btn btn-primary btn-md">{t('dashboard.newRequest')}</button>
        </Link>
      </div>

      {/* ── Stats ── */}
      <div className="client-stats">
        <StatCard label={t('dashboard.stats.total')}     value={projects.length} />
        <StatCard label={t('dashboard.stats.active')}    value={active.length}    accent />
        <StatCard label={t('dashboard.stats.completed')} value={completed.length} />
      </div>

      {/* ── Recent projects ── */}
      <section className="client-section">
        <div className="client-section-header">
          <h3 className="client-section-title">{t('dashboard.recentProjects')}</h3>
          {projects.length > 5 && (
            <Link to="/client/projects" className="client-section-link">
              {t('dashboard.viewAll')} →
            </Link>
          )}
        </div>

        {loading && (
          <div className="client-loading">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="client-error">{error}</div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="client-empty">
            <p className="client-empty-text">{t('dashboard.noProjects')}</p>
            <Link to="/client/request">
              <button className="btn btn-primary btn-md">{t('dashboard.newRequest')}</button>
            </Link>
          </div>
        )}

        {!loading && !error && recent.length > 0 && (
          <div className="client-project-list">
            {recent.map(p => <ProjectRow key={p.id} project={p} />)}
          </div>
        )}
      </section>
    </DashboardLayout>
  )
}
