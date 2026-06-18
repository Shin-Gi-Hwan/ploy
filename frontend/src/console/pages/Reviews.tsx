import PlaceholderPage from '../components/ui/PlaceholderPage'
import { IcReviews } from '../components/layout/Icons'

export default function Reviews() {
  return (
    <PlaceholderPage
      title="리뷰 / 포트폴리오"
      subtitle="고객 리뷰 관리 및 랜딩 페이지 포트폴리오 이미지를 관리합니다."
      icon={<IcReviews size={26} />}
      features={[
        '리뷰 목록 (이름 마스킹 처리 — 김*수, 박*영)',
        '리뷰 노출 여부 토글',
        '부적절한 리뷰 삭제',
        '포트폴리오 이미지 업로드',
        '포트폴리오 순서 조정 (드래그)',
        '대표 포트폴리오 선정',
      ]}
    />
  )
}
