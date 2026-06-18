import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { applyAsPartner, getMyPartnerApplication, getErrorMessage } from '../lib/api'
import type { PartnerApplicationResponse } from '../types/api'
import AuthLayout from '../components/auth/AuthLayout'
import { PloyMark } from './Login'

// ── Status badge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation()
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    PENDING:  { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
    APPROVED: { bg: '#f0faf6', color: '#065f46', border: '#6ee7b7' },
    REJECTED: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  }
  const style = colors[status] ?? colors.PENDING
  return (
    <span style={{
      display: 'inline-block', fontSize: 12.5, fontWeight: 600,
      padding: '4px 12px', borderRadius: 20,
      background: style.bg, color: style.color, border: `1px solid ${style.border}`,
    }}>
      {t(`partnerApply.status.${status}`, status)}
    </span>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PartnerApply() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  const [introduction, setIntroduction] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  const [existing, setExisting] = useState<PartnerApplicationResponse | null>(null)
  const [success, setSuccess] = useState(false)

  // Check if already applied
  useEffect(() => {
    if (!isAuthenticated) { setChecking(false); return }
    getMyPartnerApplication()
      .then(setExisting)
      .catch(() => {/* no application yet */})
      .finally(() => setChecking(false))
  }, [isAuthenticated])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (introduction.trim().length < 50) {
      setError(t('partnerApply.introductionPlaceholder'))
      return
    }
    setError('')
    setLoading(true)
    try {
      const result = await applyAsPartner({
        introduction: introduction.trim(),
        portfolioUrl: portfolioUrl.trim() || undefined,
      })
      setExisting(result)
      setSuccess(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  // Not logged in
  if (!isAuthenticated && !checking) {
    return (
      <AuthLayout>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '8px 0' }}>
          <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <PloyMark size={40} />
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: '#111a11' }}>PLOY</span>
          </Link>
          <p style={{ fontSize: 14, color: '#6b7b6b', textAlign: 'center', margin: 0 }}>
            {t('partnerApply.loginRequired')}
          </p>
          <Link to="/login" style={{
            display: 'block', width: '100%', padding: '11px 0', borderRadius: 12,
            background: '#3DD9B3', color: '#0d2a1e', fontSize: 14, fontWeight: 600,
            textDecoration: 'none', textAlign: 'center',
          }}>
            {t('partnerApply.loginBtn')}
          </Link>
        </div>
      </AuthLayout>
    )
  }

  // Loading / checking
  if (checking) return null

  // Already applied — show status
  if (existing) {
    return (
      <AuthLayout>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <PloyMark size={40} />
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: '#111a11' }}>PLOY</span>
          </Link>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111a11', marginBottom: 16 }}>
            {success ? t('partnerApply.successTitle') : t('partnerApply.checkStatus')}
          </h2>
          {success && (
            <p style={{ fontSize: 13.5, color: '#6b7b6b', marginBottom: 20, lineHeight: 1.6 }}>
              {t('partnerApply.successDesc')}
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <StatusBadge status={existing.status} />
            <p style={{ fontSize: 12.5, color: '#9aaa9a', margin: 0 }}>
              {new Date(existing.appliedAt).toLocaleDateString()}
            </p>
            {existing.rejectionReason && (
              <div style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: 13,
              }}>
                {existing.rejectionReason}
              </div>
            )}
          </div>
          <div style={{ marginTop: 24 }}>
            <Link to="/partners" style={{ fontSize: 13, color: '#3DD9B3', textDecoration: 'none' }}>
              {t('partners.backToList')}
            </Link>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      {/* Brand */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
        <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <PloyMark size={40} />
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: '#111a11' }}>PLOY</span>
        </Link>
        <p style={{ marginTop: 8, fontSize: 13, color: '#6b7b6b', textAlign: 'center', lineHeight: 1.5 }}>
          {t('partnerApply.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              role="alert"
              style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 12, padding: '10px 14px', fontSize: 13 }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Introduction */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#3a4a3a' }}>
            {t('partnerApply.introduction')}
          </label>
          <textarea
            value={introduction}
            onChange={e => setIntroduction(e.target.value)}
            placeholder={t('partnerApply.introductionPlaceholder')}
            required
            rows={5}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 12,
              border: '1.5px solid #d0d8d0', fontSize: 13.5, color: '#111a11',
              background: '#fff', resize: 'vertical', fontFamily: 'inherit',
              outline: 'none', boxSizing: 'border-box', lineHeight: 1.6,
            }}
            onFocus={e => (e.target.style.borderColor = '#3DD9B3')}
            onBlur={e => (e.target.style.borderColor = '#d0d8d0')}
          />
          <span style={{ fontSize: 11.5, color: introduction.length >= 50 ? '#3DD9B3' : '#9aaa9a' }}>
            {introduction.length} / 50자 이상
          </span>
        </div>

        {/* Portfolio URL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#3a4a3a' }}>
            {t('partnerApply.portfolioUrl')}
          </label>
          <input
            type="url"
            value={portfolioUrl}
            onChange={e => setPortfolioUrl(e.target.value)}
            placeholder={t('partnerApply.portfolioUrlPlaceholder')}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 12,
              border: '1.5px solid #d0d8d0', fontSize: 13.5, color: '#111a11',
              background: '#fff', outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => (e.target.style.borderColor = '#3DD9B3')}
            onBlur={e => (e.target.style.borderColor = '#d0d8d0')}
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 4, width: '100%', padding: '11px 0', borderRadius: 12,
            border: 'none', background: '#3DD9B3', color: '#0d2a1e',
            fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
          whileHover={{ scale: loading ? 1 : 1.012 }}
          whileTap={{ scale: loading ? 1 : 0.988 }}
          transition={{ duration: 0.14 }}
        >
          {loading ? t('partnerApply.submitting') : t('partnerApply.submit')}
        </motion.button>

        <Link to="/partners" style={{ textAlign: 'center', fontSize: 13, color: '#9aaa9a', textDecoration: 'none' }}>
          {t('partners.backToList')}
        </Link>
      </form>
    </AuthLayout>
  )
}
