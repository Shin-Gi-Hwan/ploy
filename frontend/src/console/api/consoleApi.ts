import axios from 'axios'

const client = axios.create({ baseURL: '/api' })

client.interceptors.request.use(config => {
  const token = localStorage.getItem('ploy_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Generic ────────────────────────────────────────────────────────────────────

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number   // 0-indexed current page
  size: number
  first: boolean
  last: boolean
}

// ─── Dashboard Types ────────────────────────────────────────────────────────────

export interface DashboardStats {
  todayOrders: number
  todayInquiries: number
  activeProjects: number
  pendingApprovals: number
  newMembers: number
  todayRevenue: number
  orderChange: number
  inquiryChange: number
  projectChange: number
  approvalChange: number
  memberChange: number
  revenueChange: number
  totalMembers: number
  totalProjects: number
  totalPartners: number
  pendingPartnerApplications: number
  projectsByStatus: Record<string, number>
}

export type ActivityType =
  | 'INQUIRY_SUBMITTED'
  | 'INQUIRY_REVIEWING'
  | 'INQUIRY_APPROVED'
  | 'INQUIRY_REJECTED'
  | 'PROJECT_ASSIGNED'
  | 'PROJECT_STARTED'
  | 'DRAFT_UPLOADED'
  | 'ORDER_COMPLETED'
  | 'MEMBER_REGISTERED'
  | 'PARTNER_APPLIED'
  | 'PARTNER_APPROVED'
  | 'PARTNER_REJECTED'

export interface ActivityItem {
  id: number
  type: ActivityType
  message: string
  targetId: number
  createdAt: string
}

export interface RevenueDataPoint {
  date: string
  revenue: number
  orders: number
  inquiries: number
}

// ─── User Types ─────────────────────────────────────────────────────────────────

export type UserRole = 'USER' | 'OUTSOURCING_PARTNER' | 'ADMIN'

export interface MemberListItem {
  id: number
  name: string
  email: string
  role: UserRole
  active: boolean
  createdAt: string
  updatedAt: string | null
}

export interface RecentProjectItem {
  id: number
  title: string
  type: string
  status: string
  createdAt: string
}

export interface MemberDetail extends MemberListItem {
  recentProjects: RecentProjectItem[]
}

// ─── Partner Types ───────────────────────────────────────────────────────────────

export type PartnerStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISABLED'

export interface ConsolePartnerListItem {
  id: number
  memberId: number
  name: string
  email: string
  status: PartnerStatus
  visible: boolean | null
  specialties: string | null
  averageRating: number | null
  completedCount: number | null
  appliedAt: string
  reviewedAt: string | null
}

export interface PortfolioItem {
  id: number
  title: string
  description: string | null
  category: string
  thumbnailUrl: string | null
  fileUrl: string | null
  createdAt: string
}

export interface ConsolePartnerDetail {
  applicationId: number
  memberId: number
  name: string
  email: string
  status: PartnerStatus
  introduction: string | null
  portfolioUrl: string | null
  rejectionReason: string | null
  appliedAt: string
  reviewedAt: string | null
  displayName: string | null
  bio: string | null
  profileImageUrl: string | null
  specialties: string | null
  skills: string | null
  yearsOfExperience: number | null
  averageRating: number | null
  completedCount: number | null
  visible: boolean | null
  portfolioItems: PortfolioItem[]
}

// ─── Order Types ─────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING' | 'PAID' | 'PREPARING' | 'SHIPPED' | 'DELIVERED'
  | 'COMPLETED' | 'CANCELLED' | 'REFUND_REQUESTED' | 'REFUNDED' | 'FAILED'

export interface ConsoleOrderListItem {
  id: number
  orderNo: string
  buyerName: string | null
  buyerEmail: string | null
  orderType: string
  status: OrderStatus
  totalPaymentAmount: number
  createdAt: string
}

export interface OrderItemDto {
  id: number
  itemName: string
  itemType: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface PaymentDto {
  id: number
  provider: string
  method: string | null
  status: string
  requestedAmount: number
  approvedAmount: number | null
  cancelledAmount: number | null
  approvedAt: string | null
}

export interface ConsoleOrderDetail {
  id: number
  orderNo: string
  buyerName: string | null
  buyerEmail: string | null
  buyerPhone: string | null
  isGuest: boolean
  orderType: string
  status: OrderStatus
  totalProductAmount: number
  deliveryFee: number
  discountAmount: number
  totalPaymentAmount: number
  receiverName: string | null
  receiverPhone: string | null
  postalCode: string | null
  address1: string | null
  address2: string | null
  deliveryMemo: string | null
  createdAt: string
  updatedAt: string | null
  items: OrderItemDto[]
  payments: PaymentDto[]
}

// ─── Dashboard API ───────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await client.get<DashboardStats>('/console/dashboard/stats')
  return res.data
}

export async function getDashboardActivity(): Promise<ActivityItem[]> {
  const res = await client.get<ActivityItem[]>('/console/dashboard/activity')
  return res.data
}

export async function getDashboardRevenue(): Promise<RevenueDataPoint[]> {
  const res = await client.get<RevenueDataPoint[]>('/console/dashboard/revenue')
  return res.data
}

// ─── User API ────────────────────────────────────────────────────────────────────

export async function getUsers(
  page = 0, size = 20, role?: string, active?: string, q?: string
): Promise<PageResponse<MemberListItem>> {
  const res = await client.get<PageResponse<MemberListItem>>('/console/users', {
    params: { page, size, role: role || undefined, active: active || undefined, q: q || undefined },
  })
  return res.data
}

export async function getUserDetail(id: number): Promise<MemberDetail> {
  const res = await client.get<MemberDetail>(`/console/users/${id}`)
  return res.data
}

export async function updateUserRole(id: number, role: UserRole): Promise<MemberListItem> {
  const res = await client.patch<MemberListItem>(`/console/users/${id}/role`, { role })
  return res.data
}

export async function updateUserStatus(id: number, active: boolean): Promise<MemberListItem> {
  const res = await client.patch<MemberListItem>(`/console/users/${id}/status`, { active })
  return res.data
}

// ─── Partner API ─────────────────────────────────────────────────────────────────

export async function getPartners(
  page = 0, size = 20, status?: string, q?: string
): Promise<PageResponse<ConsolePartnerListItem>> {
  const res = await client.get<PageResponse<ConsolePartnerListItem>>('/console/partners', {
    params: { page, size, status: status || undefined, q: q || undefined },
  })
  return res.data
}

export async function getPartnerDetail(id: number): Promise<ConsolePartnerDetail> {
  const res = await client.get<ConsolePartnerDetail>(`/console/partners/${id}`)
  return res.data
}

export async function approvePartner(id: number): Promise<ConsolePartnerListItem> {
  const res = await client.post<ConsolePartnerListItem>(`/console/partners/${id}/approve`)
  return res.data
}

export async function rejectPartner(id: number, reason: string): Promise<ConsolePartnerListItem> {
  const res = await client.post<ConsolePartnerListItem>(`/console/partners/${id}/reject`, { reason })
  return res.data
}

export async function updatePartnerActive(id: number, active: boolean): Promise<ConsolePartnerListItem> {
  const res = await client.patch<ConsolePartnerListItem>(`/console/partners/${id}/active`, { active })
  return res.data
}

// ─── Order API ───────────────────────────────────────────────────────────────────

export async function getOrders(
  page = 0, size = 20, status?: string, q?: string
): Promise<PageResponse<ConsoleOrderListItem>> {
  const res = await client.get<PageResponse<ConsoleOrderListItem>>('/console/orders', {
    params: { page, size, status: status || undefined, q: q || undefined },
  })
  return res.data
}

export async function getOrderDetail(id: number): Promise<ConsoleOrderDetail> {
  const res = await client.get<ConsoleOrderDetail>(`/console/orders/${id}`)
  return res.data
}
