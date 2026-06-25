import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'

export default function ClientSettings() {
  const { user, logout } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [saved, setSaved] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  // Name update is local only (no endpoint yet — saved to localStorage via auth context)
  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    // TODO: wire to PUT /api/client/profile when backend ready
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <DashboardLayout title="설정">
      <div className="client-section" style={{ maxWidth: 480 }}>

        {/* Profile */}
        <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 16px' }}>프로필</h3>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--mint-100)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'var(--mint-700)',
            }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{user?.email}</div>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>이름</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border-default)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>이메일</label>
              <input
                value={user?.email ?? ''}
                disabled
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border-default)', fontSize: 14, background: '#f9fafb', color: 'var(--text-tertiary)', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-md"
              disabled={!name.trim() || name === user?.name}
            >
              {saved ? '저장됨 ✓' : '저장하기'}
            </button>
          </form>
        </div>

        {/* Password change — placeholder */}
        <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 4px' }}>비밀번호 변경</h3>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: '0 0 12px' }}>비밀번호 변경 기능은 곧 제공될 예정입니다.</p>
          <button
            disabled
            style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid var(--border-default)', background: '#fff', fontSize: 13, color: 'var(--text-tertiary)', cursor: 'not-allowed' }}
          >
            비밀번호 변경 (준비 중)
          </button>
        </div>

        {/* Danger zone */}
        <div style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 12, padding: '20px 24px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#dc2626', margin: '0 0 12px' }}>계정</h3>
          {!showLogout ? (
            <button
              onClick={() => setShowLogout(true)}
              style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #fecaca', background: '#fff', fontSize: 13, color: '#dc2626', cursor: 'pointer' }}
            >
              로그아웃
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>정말 로그아웃 하시겠습니까?</span>
              <button
                onClick={logout}
                style={{ padding: '7px 14px', borderRadius: 8, background: '#dc2626', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                로그아웃
              </button>
              <button
                onClick={() => setShowLogout(false)}
                style={{ padding: '7px 14px', borderRadius: 8, border: '1.5px solid var(--border-default)', background: '#fff', fontSize: 13, cursor: 'pointer' }}
              >
                취소
              </button>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  )
}
