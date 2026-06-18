import PlaceholderPage from '../components/ui/PlaceholderPage'
import { IcChat } from '../components/layout/Icons'

export default function ChatMonitor() {
  return (
    <PlaceholderPage
      title="채팅 모니터"
      subtitle="프로젝트별 채팅 내역을 읽기 전용으로 모니터링합니다. (직접 참여 불가)"
      icon={<IcChat size={26} />}
      features={[
        '프로젝트별 채팅방 목록',
        '메시지 히스토리 조회 (읽기 전용)',
        '파일 업로드 내역 및 미리보기',
        '키워드 메시지 검색',
        '참여자 (클라이언트 / 파트너) 정보 확인',
      ]}
    />
  )
}
