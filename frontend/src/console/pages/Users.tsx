import PlaceholderPage from '../components/ui/PlaceholderPage'
import { IcUsers } from '../components/layout/Icons'

export default function Users() {
  return (
    <PlaceholderPage
      title="회원 관리"
      subtitle="전체 회원 목록 조회, 역할 변경, 계정 활성화/비활성화를 관리합니다."
      icon={<IcUsers size={26} />}
      features={[
        '회원 목록 (테이블 + 페이지네이션)',
        '역할 필터 (USER / OUTSOURCING_PARTNER / ADMIN)',
        '계정 활성화 / 비활성화',
        '역할 변경 (드롭다운)',
        '회원 상세 Drawer (주문 및 외주 이력 포함)',
        '이름/이메일 검색',
      ]}
    />
  )
}
