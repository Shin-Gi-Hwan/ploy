import PlaceholderPage from '../components/ui/PlaceholderPage'
import { IcInquiries } from '../components/layout/Icons'

export default function Inquiries() {
  return (
    <PlaceholderPage
      title="문의 관리"
      subtitle="외주 서비스 문의 접수, 승인/거절, 파트너 배정을 처리합니다."
      icon={<IcInquiries size={26} />}
      features={[
        '문의 목록 (테이블 / 칸반 뷰)',
        '문의 상세 보기',
        '승인 / 거절 (거절 사유 입력)',
        '파트너 수동 배정',
        '상태 필터 (INQUIRY_SUBMITTED / APPROVED / REJECTED / PROJECT_CREATED)',
        '고객 및 요청 정보 확인',
      ]}
    />
  )
}
