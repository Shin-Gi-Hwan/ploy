import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { getPartners } from '../lib/api'
import type { PartnerSummary } from '../types/api'
import { getErrorMessage } from '../lib/api'

// ── Star rating ────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= full ? '#f59e0b' : i === full + 1 && half ? '#f59e0b' : '#d1d5db', fontSize: 13 }}>
          {i <= full ? '★' : i === full + 1 && half ? '⯨' : '☆'}
        </span>
      ))}
    </span>
  )
}

// ── Partner card ───────────────────────────────────────────────────────────────

function PartnerCard({ partner }: { partner: PartnerSummary }) {
  const { t } = useTranslation()
  const specialties = partner.specialties?.split(',').map(s => s.trim()).filter(Boolean) ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#fff',
        border: '1px solid #e4e9e4',
        borderRadius: 16,
        padding: '24px 24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
      whileHover={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)', translateY: -2 }}
      transition={{ duration: 0.18 }}
    >
      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: partner.profileImageUrl ? undefined : 'linear-gradient(135deg,#3DD9B3,#2dba9a)',
          overflow: 'hidden', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, color: '#fff', fontWeight: 700,
        }}>
          {partner.profileImageUrl
            ? <img src={partner.profileImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : partner.displayName.charAt(0).toUpperCase()
          }
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#111a11' }}>{partner.displayName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <Stars rating={partner.averageRating} />
            <span style={{ fontSize: 12, color: '#6b7b6b' }}>
              {t('partners.completedCount', { count: partner.completedCount })}
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {partner.bio && (
        <p style={{ fontSize: 13, color: '#4a5a4a', lineHeight: 1.6, margin: 0 }}>
          {partner.bio}
        </p>
      )}

      {/* Specialties */}
      {specialties.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {specialties.map(s => (
            <span key={s} style={{
              fontSize: 11.5, padding: '3px 10px', borderRadius: 20,
              background: '#f0faf6', color: '#0d6b50', border: '1px solid #c5e8dc',
            }}>
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        {partner.yearsOfExperience != null && (
          <span style={{ fontSize: 12, color: '#9aaa9a' }}>
            {t('partners.years', { years: partner.yearsOfExperience })}
          </span>
        )}
        <Link
          to={`/partners/${partner.id}`}
          style={{
            marginLeft: 'auto', fontSize: 13, fontWeight: 600,
            color: '#3DD9B3', textDecoration: 'none',
          }}
        >
          {t('partners.viewProfile')}
        </Link>
      </div>
    </motion.div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function Partners() {
  const { t } = useTranslation()
  const [partners, setPartners] = useState<PartnerSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPartners()
      .then(setPartners)
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8f7', padding: '80px 20px 60px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
          style={{ marginBottom: 48, textAlign: 'center' }}
        >
          <Link to="/" style={{ fontSize: 13, color: '#9aaa9a', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>
            ← {t('common.home')}
          </Link>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: '#111a11', margin: '0 0 12px' }}>
            {t('partners.title')}
          </h1>
          <p style={{ fontSize: 15, color: '#6b7b6b', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
            {t('partners.subtitle')}
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#9aaa9a', padding: 60 }}>{t('common.loading')}</div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#b91c1c', padding: 60 }}>{error}</div>
        ) : partners.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9aaa9a', padding: 60 }}>{t('partners.noPartners')}</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {partners.map((p, i) => (
              <motion.div key={p.id} transition={{ delay: i * 0.06 }}>
                <PartnerCard partner={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
