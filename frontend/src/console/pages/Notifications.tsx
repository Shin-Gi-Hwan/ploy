import PlaceholderPage from '../components/ui/PlaceholderPage'
import { IcNotifications } from '../components/layout/Icons'

export default function Notifications() {
  return (
    <PlaceholderPage
      title="알림 관리"
      subtitle="시스템 알림 발송 이력, 실패 재시도, 공지 발송을 관리합니다."
      icon={<IcNotifications size={26} />}
      features={[
        '알림 발송 이력 목록',
        '이메일 발송 이력',
        '실패 알림 재시도',
        '공지사항 생성 및 발송',
        '발송 트리거별 필터 (문의 접수, 납품 완료 등)',
        '발송 대상 (전체 / 특정 회원)',
      ]}
    />
  )
}
