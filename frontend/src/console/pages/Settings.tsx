import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getSettings, updateSetting, type SystemSettingItem } from '../api/consoleApi'
import { IcSettings } from '../components/layout/Icons'
import { formatDateTime } from '../components/ui/TablePage'

function SettingRow({ item, onSaved }: { item: SystemSettingItem; onSaved: (updated: SystemSettingItem) => void }) {
  const [value, setValue] = useState(item.settingValue ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const isDirty = value !== (item.settingValue ?? '')

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await updateSetting(item.settingKey, value)
      onSaved(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally { setSaving(false) }
  }

  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid var(--cs-border)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cs-text-1)', marginBottom: 2, fontFamily: 'monospace' }}>
          {item.settingKey}
        </div>
        {item.description && (
          <div style={{ fontSize: 12, color: 'var(--cs-text-3)', marginBottom: 6 }}>{item.description}</div>
        )}
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box', padding: '7px 10px',
            border: '1px solid var(--cs-border)', borderRadius: 'var(--cs-radius-sm)',
            fontSize: 13, fontFamily: 'monospace', outline: 'none', background: 'var(--cs-bg)',
            color: 'var(--cs-text-1)',
          }}
          placeholder="값 없음"
        />
        {item.updatedAt && (
          <div style={{ fontSize: 11, color: 'var(--cs-text-3)', marginTop: 4 }}>
            마지막 수정: {formatDateTime(item.updatedAt)}
          </div>
        )}
      </div>
      <button
        className={`cs-btn ${saved ? 'cs-btn-secondary' : 'cs-btn-primary'}`}
        disabled={!isDirty || saving}
        onClick={handleSave}
        style={{ marginTop: 22, flexShrink: 0, minWidth: 56 }}
      >
        {saving ? '...' : saved ? '저장됨' : '저장'}
      </button>
    </div>
  )
}

export default function Settings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<SystemSettingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings().then(setSettings).finally(() => setLoading(false))
  }, [])

  const handleSaved = (updated: SystemSettingItem) => {
    setSettings(prev => prev.map(s => s.id === updated.id ? updated : s))
  }

  return (
    <div>
      <div className="cs-page-header">
        <div className="cs-page-title-group">
          <h1 className="cs-page-title">설정</h1>
          <p className="cs-page-subtitle">관리자 계정 정보 및 시스템 설정을 관리합니다.</p>
        </div>
      </div>

      {/* Admin Profile Card */}
      <div className="cs-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg, #3DD9B3, #2dba9a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: '#0F172A', flexShrink: 0,
          }}>
            {user?.name?.slice(0, 2).toUpperCase() ?? 'AD'}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--cs-text-1)' }}>{user?.name ?? '관리자'}</div>
            <div style={{ fontSize: 13.5, color: 'var(--cs-text-2)', marginTop: 2 }}>{user?.email}</div>
            <span className="cs-badge cs-badge-mint" style={{ marginTop: 6, fontSize: 11 }}>ADMIN</span>
          </div>
        </div>
        <div style={{ padding: '14px 16px', background: 'var(--cs-bg)', borderRadius: 'var(--cs-radius-sm)', border: '1px solid var(--cs-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--cs-text-3)', flexShrink: 0, display: 'flex' }}><IcSettings size={16} /></span>
          <span style={{ fontSize: 13.5, color: 'var(--cs-text-2)' }}>
            프로필 수정, 비밀번호 변경 등의 계정 관리 기능은 추후 추가될 예정입니다.
          </span>
        </div>
      </div>

      {/* System Settings */}
      <div className="cs-card">
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--cs-text-1)', margin: '0 0 4px' }}>시스템 설정</h3>
        <p style={{ fontSize: 12, color: 'var(--cs-text-3)', margin: '0 0 4px' }}>키-값 형태의 시스템 설정을 수정합니다. 변경 즉시 적용됩니다.</p>
        {loading ? (
          <div className="cs-loading">불러오는 중...</div>
        ) : settings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--cs-text-3)', fontSize: 13 }}>
            등록된 시스템 설정이 없습니다.
          </div>
        ) : (
          <div>
            {settings.map(s => (
              <SettingRow key={s.id} item={s} onSaved={handleSaved} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
