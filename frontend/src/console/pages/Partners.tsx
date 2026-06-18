import PlaceholderPage from '../components/ui/PlaceholderPage'
import { IcPartners } from '../components/layout/Icons'

export default function Partners() {
  return (
    <PlaceholderPage
      title="파트너 관리"
      subtitle="외주 파트너 신청 승인/거절, 활성화 상태 및 성과를 관리합니다."
      icon={<IcPartners size={26} />}
      features={[
        '파트너 신청 목록 및 승인 / 거절',
        '파트너 상세 프로필 조회',
        '활성화 / 비활성화 토글',
        '담당 서비스 유형 관리',
        '진행 중 작업량 및 완료 프로젝트 수',
        '별점 및 성과 지표',
      ]}
    />
  )
}
