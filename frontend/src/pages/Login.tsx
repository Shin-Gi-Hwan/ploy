import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../lib/api'
import Input from '../components/ui/Input'
import AuthLayout from '../components/auth/AuthLayout'

// ── P + Layer logo mark ───────────────────────────────────────────────────────
// Three stacked rectangles offset diagonally — representing layered design files
// (slides, business cards, e-books). Mint front, darker layers behind.

export function PloyMark({ size = 32 }: { size?: number }) {
  const w = 20          // width of each layer
  const h = 15          // height of each layer
  const gap = 5         // diagonal offset per layer
  const rx = 2.8        // corner radius
  const vw = w + gap * 2
  const vh = h + gap * 2

  return (
    <svg
      width={size}
      height={Math.round(size * (vh / vw))}
      viewBox={`0 0 ${vw} ${vh}`}
      fill="none"
      aria-hidden="true"
    >
      {/* Back layer — dark forest green */}
      <rect x={gap * 2} y={gap * 2} width={w} height={h} rx={rx} fill="#1b3d2a" />
      {/* Mid layer — medium mint */}
      <rect x={gap}     y={gap}     width={w} height={h} rx={rx} fill="#2dba9a" />
      {/* Front layer — brand mint */}
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
      user?.role === 'ADMIN' ? '/admin' : user?.role === 'FREELANCER' ? '/freelancer' : '/client',
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
      <div className="flex flex-col items-center mb-8">
        <Link to="/" className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity">
          <PloyMark size={38} />
          <span
            className="text-[22px] font-bold tracking-[0.14em] dark:text-white"
            style={{ color: '#111a11', letterSpacing: '0.14em' }}
          >
            PLOY
          </span>
        </Link>
        <p
          className="mt-1.5 text-[12.5px] text-center leading-snug dark:text-[#8a9e8a]"
          style={{ color: '#6b7b6b' }}
        >
          {isKo ? '크리에이티브 작업, 전문적으로 진행합니다.' : 'Creative Work, Professionally Delivered.'}
        </p>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              role="alert"
              className="rounded-xl px-4 py-3 text-[13px]"
              style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}
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

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded cursor-pointer"
              style={{ accentColor: '#3DD9B3' }}
            />
            <span className="text-[12px]" style={{ color: '#8a9a8a' }}>
              {t('auth.rememberMe', '로그인 상태 유지')}
            </span>
          </label>
          <Link
            to="#"
            className="text-[12px] hover:opacity-70 transition-opacity"
            style={{ color: '#8a9a8a' }}
          >
            {t('auth.forgotPassword', '비밀번호 찾기')}
          </Link>
        </div>

        {/* Sign in — mint CTA */}
        <motion.button
          type="submit"
          disabled={loading}
          className="mt-1 w-full rounded-xl py-[11px] text-[14px] font-semibold disabled:opacity-50"
          style={{
            background: loading ? '#3DD9B3' : '#3DD9B3',
            color: '#0d2a1e',
            letterSpacing: '0.01em',
          }}
          whileHover={{ scale: loading ? 1 : 1.012 }}
          whileTap={{ scale: loading ? 1 : 0.988 }}
          transition={{ duration: 0.14 }}
        >
          {loading ? '···' : t('auth.loginSubmit')}
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-0.5">
          <div className="flex-1 h-px bg-[#e8ece8] dark:bg-[#252e25]" />
          <span className="text-[11px]" style={{ color: '#9aaa9a' }}>
            {t('auth.or', '또는')}
          </span>
          <div className="flex-1 h-px bg-[#e8ece8] dark:bg-[#252e25]" />
        </div>

        {/* Register link */}
        <Link to="/register">
          <motion.div
            className="w-full rounded-xl py-[11px] text-[14px] font-medium text-center cursor-pointer"
            style={{
              border: '1.5px solid #d0d8d0',
              color: '#3a4a3a',
              letterSpacing: '0.01em',
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
      <div className="mt-7 flex items-center justify-center gap-2 text-[11.5px]" style={{ color: '#9aaa9a' }}>
        <button
          onClick={() => i18n.changeLanguage('ko')}
          className={`transition-colors hover:text-[#3DD9B3] ${isKo ? 'font-semibold text-[#3DD9B3]' : ''}`}
        >
          한국어
        </button>
        <span>·</span>
        <button
          onClick={() => i18n.changeLanguage('en')}
          className={`transition-colors hover:text-[#3DD9B3] ${!isKo ? 'font-semibold text-[#3DD9B3]' : ''}`}
        >
          English
        </button>
      </div>
    </AuthLayout>
  )
}
