import PlaceholderPage from '../components/ui/PlaceholderPage'
import { IcAudit } from '../components/layout/Icons'

export default function AuditLogs() {
  return (
    <PlaceholderPage
      title="감사 로그"
      subtitle="관리자의 모든 액션 이력을 기록하고 조회합니다. (누가, 언제, 무엇을 변경했는지)"
      icon={<IcAudit size={26} />}
      features={[
        '관리자 액션 전체 목록',
        '액션 유형 필터 (역할 변경, 삭제, 승인 등)',
        '관리자 / 대상 / 기간 검색',
        '변경 전 / 후 값 비교',
        'IP 주소 및 User-Agent 기록',
        'CSV 내보내기',
      ]}
    />
  )
}
