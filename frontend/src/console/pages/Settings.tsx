import { useAuth } from '../../context/AuthContext'
import { IcSettings } from '../components/layout/Icons'

export default function Settings() {
  const { user } = useAuth()

  return (
    <div>
      <div className="cs-page-header">
        <div className="cs-page-title-group">
          <h1 className="cs-page-title">설정</h1>
          <p className="cs-page-subtitle">관리자 콘솔 설정 및 계정 정보를 관리합니다.</p>
        </div>
      </div>

      {/* Admin Profile Card */}
      <div className="cs-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg, #3DD9B3, #2dba9a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: '#0F172A',
            flexShrink: 0,
          }}>
            {user?.name?.slice(0, 2).toUpperCase() ?? 'AD'}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--cs-text-1)' }}>
              {user?.name ?? '관리자'}
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--cs-text-2)', marginTop: 2 }}>
              {user?.email}
            </div>
            <span className="cs-badge cs-badge-mint" style={{ marginTop: 6, fontSize: 11 }}>
              ADMIN
            </span>
          </div>
        </div>
        <div style={{
          padding: '16px',
          background: 'var(--cs-bg)',
          borderRadius: 'var(--cs-radius-sm)',
          border: '1px solid var(--cs-border)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ color: 'var(--cs-text-3)', flexShrink: 0, display: 'flex' }}><IcSettings size={16} /></span>
          <span style={{ fontSize: 13.5, color: 'var(--cs-text-2)' }}>
            Phase 2에서 프로필 수정, 비밀번호 변경, 알림 설정 등이 추가됩니다.
          </span>
        </div>
      </div>

      {/* Phase 2 Features */}
      <div className="cs-card">
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--cs-text-1)', margin: '0 0 16px' }}>
          구현 예정 기능
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            '관리자 프로필 수정 (이름, 이메일)',
            '비밀번호 변경',
            '이메일 알림 설정',
            '콘솔 언어 및 시간대 설정',
            '보안 설정 (2FA, 세션 관리)',
            '시스템 공지 설정',
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cs-accent)', flexShrink: 0 }} />
              <span style={{ fontSize: 13.5, color: 'var(--cs-text-2)' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
