import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../lib/api'
import Input from '../components/ui/Input'
import AuthLayout from '../components/auth/AuthLayout'

// ── PloyMark logo ─────────────────────────────────────────────────────────────

export function PloyMark({ size = 32 }: { size?: number }) {
  const w = 20; const h = 15; const gap = 5; const rx = 2.8
  const vw = w + gap * 2; const vh = h + gap * 2
  return (
    <svg
      width={size}
      height={Math.round(size * (vh / vw))}
      viewBox={`0 0 ${vw} ${vh}`}
      fill="none"
      aria-hidden="true"
    >
      <rect x={gap * 2} y={gap * 2} width={w} height={h} rx={rx} fill="#1b3d2a" />
      <rect x={gap}     y={gap}     width={w} height={h} rx={rx} fill="#2dba9a" />
      <rect x={0}       y={0}       width={w} height={h} rx={rx} fill="#3DD9B3" />
    </svg>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconEmail() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M2 3h12a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1z"
        stroke="#9ca3af" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M1.5 4.5l6.5 4.5 6.5-4.5" stroke="#9ca3af" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="#9ca3af" strokeWidth="1.2"/>
      <path d="M5 7V5a3 3 0 016 0v2" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

// ── Login page ────────────────────────────────────────────────────────────────

export default function Login() {
  const { t, i18n } = useTranslation()
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    const from = (location.state as { from?: string })?.from
    if (from) { navigate(from, { replace: true }); return }
    navigate(
      user?.role === 'ADMIN' ? '/admin' : user?.role === 'FREELANCER' ? '/freelancer' : '/',
      { replace: true },
    )
  }, [isAuthenticated, user, navigate, location])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email: email.trim(), password })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const isKo = i18n.language.startsWith('ko')

  return (
    <AuthLayout>
      {/* ── Brand ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
        <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <PloyMark size={40} />
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: '#111a11' }}>
            PLOY
          </span>
        </Link>
        <p style={{ marginTop: 6, fontSize: 12.5, color: '#6b7b6b', textAlign: 'center', lineHeight: 1.4 }}>
          {isKo ? '크리에이티브 작업, 전문적으로 진행합니다.' : 'Creative Work, Professionally Delivered.'}
        </p>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

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

        <Input
          id="email"
          type="email"
          placeholder={t('auth.emailPlaceholder')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
          leftIcon={<IconEmail />}
        />

        <Input
          id="password"
          type="password"
          placeholder={t('auth.passwordPlaceholder')}
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          leftIcon={<IconLock />}
        />

        {/* Remember me + Forgot */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              style={{ width: 14, height: 14, accentColor: '#3DD9B3', cursor: 'pointer' }}
            />
            <span style={{ fontSize: 12, color: '#7a8a7a' }}>
              {t('auth.rememberMe', '로그인 상태 유지')}
            </span>
          </label>
          <Link to="#" style={{ fontSize: 12, color: '#7a8a7a', textDecoration: 'none' }}>
            {t('auth.forgotPassword', '비밀번호 찾기')}
          </Link>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 4,
            width: '100%',
            padding: '11px 0',
            borderRadius: 12,
            border: 'none',
            background: '#3DD9B3',
            color: '#0d2a1e',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.01em',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
          whileHover={{ scale: loading ? 1 : 1.012 }}
          whileTap={{ scale: loading ? 1 : 0.988 }}
          transition={{ duration: 0.14 }}
        >
          {loading ? '···' : t('auth.loginSubmit')}
        </motion.button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '2px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#e8ece8' }} />
          <span style={{ fontSize: 11, color: '#9aaa9a' }}>{t('auth.or', '또는')}</span>
          <div style={{ flex: 1, height: 1, background: '#e8ece8' }} />
        </div>

        {/* Register link */}
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <motion.div
            style={{
              width: '100%',
              padding: '11px 0',
              borderRadius: 12,
              border: '1.5px solid #d0d8d0',
              color: '#3a4a3a',
              fontSize: 14,
              fontWeight: 500,
              textAlign: 'center',
              letterSpacing: '0.01em',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
            whileHover={{ borderColor: '#3DD9B3', color: '#0d6b50', scale: 1.008 }}
            whileTap={{ scale: 0.988 }}
            transition={{ duration: 0.14 }}
          >
            {t('auth.registerLink')}
          </motion.div>
        </Link>
      </form>

      {/* ── Language switcher ── */}
      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 11.5, color: '#9aaa9a' }}>
        <button
          onClick={() => i18n.changeLanguage('ko')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11.5, color: isKo ? '#3DD9B3' : '#9aaa9a', fontWeight: isKo ? 600 : 400, padding: 0 }}
        >
          한국어
        </button>
        <span>·</span>
        <button
          onClick={() => i18n.changeLanguage('en')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11.5, color: !isKo ? '#3DD9B3' : '#9aaa9a', fontWeight: !isKo ? 600 : 400, padding: 0 }}
        >
          English
        </button>
      </div>
    </AuthLayout>
  )
}
