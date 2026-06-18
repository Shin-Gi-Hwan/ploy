import PlaceholderPage from '../components/ui/PlaceholderPage'
import { IcOrders } from '../components/layout/Icons'

export default function Orders() {
  return (
    <PlaceholderPage
      title="주문 관리"
      subtitle="상품 구매 주문의 결제 상태, 환불, 취소를 관리합니다."
      icon={<IcOrders size={26} />}
      features={[
        '주문 목록 (상태 필터 포함)',
        '주문 상세 페이지',
        '결제 상태 변경 (PENDING → PAID → SHIPPED → DELIVERED)',
        '환불 처리',
        '주문 취소',
        '배송 상태 업데이트',
      ]}
    />
  )
}
