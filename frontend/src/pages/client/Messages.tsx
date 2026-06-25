import DashboardLayout from '../../components/layout/DashboardLayout'

export default function ClientMessages() {
  return (
    <DashboardLayout title="메시지">
      <div className="client-section">
        <div className="client-empty" style={{ paddingTop: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
          <p className="client-empty-text" style={{ marginBottom: 8 }}>메시지 기능을 준비 중입니다.</p>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            파트너와의 실시간 커뮤니케이션 기능이 곧 출시됩니다.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
