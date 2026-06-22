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

// ── Social login buttons ──────────────────────────────────────────────────────

const OAUTH_BASE = '/api/auth/oauth2/authorization'

function SocialButton({
  href, bg, color, border, children,
}: {
  href: string; bg: string; color: string; border?: string; children: React.ReactNode
}) {
  return (
    <motion.a
      href={href}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
        width: '100%', padding: '10px 0', borderRadius: 12, textDecoration: 'none',
        background: bg, color, fontSize: 13.5, fontWeight: 600,
        border: border ?? 'none', boxSizing: 'border-box', cursor: 'pointer',
      }}
      whileHover={{ scale: 1.012, opacity: 0.92 }}
      whileTap={{ scale: 0.988 }}
      transition={{ duration: 0.13 }}
    >
      {children}
    </motion.a>
  )
}

// Google 'G' mark
function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

// Naver 'N' mark
function NaverN() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
    </svg>
  )
}

// Kakao mark
function KakaoMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#3C1E1E">
      <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.544 1.456 4.786 3.657 6.18L4.5 21l4.762-2.938A11.7 11.7 0 0012 18.3c5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
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
      user?.role === 'ADMIN' ? '/admin' : user?.role === 'OUTSOURCING_PARTNER' ? '/freelancer' : '/',
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
          <span style={{ fontSize: 11, color: '#9aaa9a' }}>소셜 로그인</span>
          <div style={{ flex: 1, height: 1, background: '#e8ece8' }} />
        </div>

        {/* ── Social login buttons ── */}
        <SocialButton
          href={`${OAUTH_BASE}/google`}
          bg="#fff"
          color="#3c4043"
          border="1.5px solid #dadce0"
        >
          <GoogleG />
          Google로 계속하기
        </SocialButton>

        <SocialButton
          href={`${OAUTH_BASE}/naver`}
          bg="#03C75A"
          color="#fff"
        >
          <NaverN />
          네이버로 계속하기
        </SocialButton>

        <SocialButton
          href={`${OAUTH_BASE}/kakao`}
          bg="#FEE500"
          color="#3C1E1E"
        >
          <KakaoMark />
          카카오로 계속하기
        </SocialButton>

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
