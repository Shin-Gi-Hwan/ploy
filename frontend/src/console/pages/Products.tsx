import PlaceholderPage from '../components/ui/PlaceholderPage'
import { IcProducts } from '../components/layout/Icons'

export default function Products() {
  return (
    <PlaceholderPage
      title="상품 관리"
      subtitle="전자책, 명함 등 실물 상품의 등록, 수정, 재고 및 노출 여부를 관리합니다."
      icon={<IcProducts size={26} />}
      features={[
        '상품 목록 (카드 뷰 / 테이블 뷰 전환)',
        '상품 등록 / 수정 / 삭제',
        '상품 이미지 업로드',
        '가격 및 재고 관리',
        '노출 여부 토글',
        '판매 상태 관리',
        '일괄 액션 (다중 선택)',
      ]}
    />
  )
}
