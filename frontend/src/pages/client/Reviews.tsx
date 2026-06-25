import DashboardLayout from '../../components/layout/DashboardLayout'

export default function ClientReviews() {
  return (
    <DashboardLayout title="리뷰">
      <div className="client-section">
        <div className="client-empty" style={{ paddingTop: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
          <p className="client-empty-text" style={{ marginBottom: 8 }}>작성한 리뷰가 없습니다.</p>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            프로젝트가 완료된 후 파트너에게 리뷰를 남길 수 있습니다.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
