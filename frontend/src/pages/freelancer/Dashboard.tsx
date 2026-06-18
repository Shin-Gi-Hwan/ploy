import { useTranslation } from 'react-i18next'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'

export default function FreelancerDashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <DashboardLayout title={t('dashboard.nav.overview')}>
      <div className="client-greeting">
        <h2 className="client-greeting-text">
          {t('dashboard.greeting', { name: user?.name ?? '' })}
        </h2>
      </div>

      <div className="client-empty" style={{ marginTop: '2rem' }}>
        <p className="client-empty-text">{t('dashboard.freelancer.noProjects')}</p>
      </div>
    </DashboardLayout>
  )
}
