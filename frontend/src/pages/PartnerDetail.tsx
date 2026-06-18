import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { getPartner, getErrorMessage } from '../lib/api'
import type { PartnerDetail as PartnerDetailType, PortfolioItem } from '../types/api'

// ── Stars ──────────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= full ? '#f59e0b' : i === full + 1 && half ? '#f59e0b' : '#d1d5db', fontSize: 16 }}>
          {i <= full ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}

// ── Portfolio card ─────────────────────────────────────────────────────────────

function PortfolioCard({ item }: { item: PortfolioItem }) {
  const { t } = useTranslation()
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.16 }}
      style={{
        background: '#f7f8f7',
        border: '1px solid #e4e9e4',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: '100%', aspectRatio: '16/10', background: '#e8ece8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {item.thumbnailUrl
          ? <img src={item.thumbnailUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 32 }}>
              {item.category === 'PPT' ? '📊' : item.category === 'LOGO' ? '✏️' : item.category === 'WEBSITE' ? '🌐' : item.category === 'BUSINESS_CARD' ? '💳' : '📄'}
            </span>
        }
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 20,
            background: '#f0faf6', color: '#0d6b50', border: '1px solid #c5e8dc',
          }}>
            {t(`partners.category.${item.category}`)}
          </span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#111a11', marginBottom: 4 }}>{item.title}</div>
        {item.description && (
          <p style={{ fontSize: 12.5, color: '#6b7b6b', margin: 0, lineHeight: 1.5 }}>{item.description}</p>
        )}
      </div>
    </motion.div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PartnerDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const [partner, setPartner] = useState<PartnerDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    getPartner(Number(id))
      .then(setPartner)
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aaa9a' }}>
      {t('common.loading')}
    </div>
  )

  if (error || !partner) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ color: '#b91c1c' }}>{error || t('errors.notFound')}</p>
      <Link to="/partners" style={{ color: '#3DD9B3', textDecoration: 'none', fontSize: 14 }}>{t('partners.backToList')}</Link>
    </div>
  )

  const specialties = partner.specialties?.split(',').map(s => s.trim()).filter(Boolean) ?? []
  const skills = partner.skills?.split(',').map(s => s.trim()).filter(Boolean) ?? []

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8f7', padding: '80px 20px 60px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Back */}
        <Link to="/partners" style={{ fontSize: 13, color: '#9aaa9a', textDecoration: 'none', display: 'inline-block', marginBottom: 28 }}>
          {t('partners.backToList')}
        </Link>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
          style={{
            background: '#fff', border: '1px solid #e4e9e4', borderRadius: 20,
            padding: '32px 32px 28px', marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
              background: partner.profileImageUrl ? undefined : 'linear-gradient(135deg,#3DD9B3,#2dba9a)',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, color: '#fff', fontWeight: 700,
            }}>
              {partner.profileImageUrl
                ? <img src={partner.profileImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : partner.displayName.charAt(0).toUpperCase()
              }
            </div>

            {/* Name + stats */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111a11', margin: '0 0 6px' }}>
                {partner.displayName}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <Stars rating={partner.averageRating} />
                <span style={{ fontSize: 13, color: '#6b7b6b' }}>
                  {t('partners.completedCount', { count: partner.completedCount })}
                </span>
                {partner.yearsOfExperience != null && (
                  <span style={{ fontSize: 13, color: '#6b7b6b' }}>
                    · {t('partners.years', { years: partner.yearsOfExperience })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {partner.bio && (
            <p style={{ fontSize: 14, color: '#4a5a4a', lineHeight: 1.7, margin: '20px 0 0' }}>
              {partner.bio}
            </p>
          )}

          {/* Specialties */}
          {specialties.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#9aaa9a', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
                {t('partners.specialties')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {specialties.map(s => (
                  <span key={s} style={{
                    fontSize: 12.5, padding: '4px 12px', borderRadius: 20,
                    background: '#f0faf6', color: '#0d6b50', border: '1px solid #c5e8dc',
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#9aaa9a', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
                {t('partners.skills')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {skills.map(s => (
                  <span key={s} style={{
                    fontSize: 12.5, padding: '4px 12px', borderRadius: 20,
                    background: '#f7f8f7', color: '#3a4a3a', border: '1px solid #e4e9e4',
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Portfolio */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.1 }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111a11', margin: '0 0 16px' }}>
            {t('partners.portfolio')}
          </h2>

          {partner.portfolioItems.length === 0 ? (
            <p style={{ color: '#9aaa9a', fontSize: 14 }}>{t('partners.noPortfolio')}</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 16,
            }}>
              {partner.portfolioItems.map(item => (
                <PortfolioCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
