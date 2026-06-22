import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types/api'

/**
 * Landing page after a successful OAuth2 social login.
 *
 * The backend (OAuthSuccessHandler) redirects here with:
 *   /oauth2/success?token=JWT&id=123&name=홍길동&email=user@email.com&role=USER
 *
 * We store the token + user in localStorage via loginWithToken(), then
 * redirect to the appropriate dashboard.
 */
export default function OAuthCallback() {
  const { loginWithToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const token = p.get('token')
    const id    = p.get('id')
    const name  = p.get('name')
    const email = p.get('email')
    const role  = p.get('role') as UserRole | null

    if (token && id && name && email && role) {
      loginWithToken(token, { id: Number(id), name, email, role })

      const dest = role === 'ADMIN' ? '/console'
                 : role === 'OUTSOURCING_PARTNER' ? '/freelancer'
                 : '/'
      navigate(dest, { replace: true })
    } else {
      // Missing params — something went wrong on the backend side
      navigate('/login?error=oauth_failed', { replace: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 12, background: '#f8faf8',
    }}>
      <div style={{
        width: 36, height: 36, border: '3px solid #3DD9B3', borderTopColor: 'transparent',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ fontSize: 14, color: '#6b7b6b', margin: 0 }}>로그인 처리 중...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
