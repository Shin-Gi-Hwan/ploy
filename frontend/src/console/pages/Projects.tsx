import PlaceholderPage from '../components/ui/PlaceholderPage'
import { IcProjects } from '../components/layout/Icons'

export default function Projects() {
  return (
    <PlaceholderPage
      title="프로젝트 관리"
      subtitle="디자인 외주 프로젝트의 전체 진행 상황, 파일, 메모를 관리합니다."
      icon={<IcProjects size={26} />}
      features={[
        '프로젝트 목록 (상태/파트너/기간 필터)',
        '프로젝트 상세 Drawer (클라이언트 + 파트너 정보)',
        '10단계 상태 타임라인 (문의 접수 → 프로젝트 종료)',
        '진행률 바 및 스텝 인디케이터',
        '업로드된 초안 및 최종 납품물 목록',
        '수정 요청 이력',
        '어드민 메모 등록',
        '파트너 수동 배정',
      ]}
    />
  )
}
