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

// ─── Project API ─────────────────────────────────────────────────────────────────

export type ProjectStatus =
  | 'BRIEF_SUBMITTED' | 'IN_PROGRESS' | 'REVIEW' | 'DELIVERED'
  | 'REQUESTED' | 'REVIEWING' | 'APPROVED' | 'ASSIGNED' | 'COMPLETED' | 'REJECTED'

export type ProjectType = 'BUSINESS_CARD' | 'PRESENTATION' | 'WEBSITE' | 'LOGO' | 'DETAIL_PAGE' | 'MOBILE_APP'

export interface ConsoleProjectListItem {
  id: number
  title: string
  type: ProjectType
  status: ProjectStatus
  ownerName: string
  ownerEmail: string | null
  freelancerName: string | null
  hasDeliverable: boolean
  createdAt: string
  updatedAt: string | null
}

export interface DeliverableItem {
  id: number
  fileUrl: string
  version: number
  note: string | null
  uploadedAt: string
}

export interface ConsoleProjectDetail extends ConsoleProjectListItem {
  adminNote: string | null
  rejectionReason: string | null
  ownerId: number | null
  isGuest: boolean
  freelancerId: number | null
  freelancerEmail: string | null
  deliverables: DeliverableItem[]
}

export async function getProjects(page = 0, size = 20, status?: string, q?: string): Promise<PageResponse<ConsoleProjectListItem>> {
  const res = await client.get<PageResponse<ConsoleProjectListItem>>('/console/projects', {
    params: { page, size, status: status || undefined, q: q || undefined },
  })
  return res.data
}

export async function getProjectDetail(id: number): Promise<ConsoleProjectDetail> {
  const res = await client.get<ConsoleProjectDetail>(`/console/projects/${id}`)
  return res.data
}

export async function updateProjectStatus(id: number, status: string): Promise<ConsoleProjectListItem> {
  const res = await client.patch<ConsoleProjectListItem>(`/console/projects/${id}/status`, { status })
  return res.data
}

export async function addProjectNote(id: number, note: string): Promise<ConsoleProjectListItem> {
  const res = await client.post<ConsoleProjectListItem>(`/console/projects/${id}/notes`, { note })
  return res.data
}

export async function assignProjectPartner(id: number, freelancerId: number | null): Promise<ConsoleProjectListItem> {
  const res = await client.patch<ConsoleProjectListItem>(`/console/projects/${id}/assign`, { freelancerId })
  return res.data
}

// ─── Inquiry API ──────────────────────────────────────────────────────────────────

export async function getInquiries(page = 0, size = 20, status?: string, q?: string): Promise<PageResponse<ConsoleProjectListItem>> {
  const res = await client.get<PageResponse<ConsoleProjectListItem>>('/console/inquiries', {
    params: { page, size, status: status || undefined, q: q || undefined },
  })
  return res.data
}

export async function getInquiryDetail(id: number): Promise<ConsoleProjectDetail> {
  const res = await client.get<ConsoleProjectDetail>(`/console/inquiries/${id}`)
  return res.data
}

export async function approveInquiry(id: number): Promise<ConsoleProjectListItem> {
  const res = await client.post<ConsoleProjectListItem>(`/console/inquiries/${id}/approve`)
  return res.data
}

export async function rejectInquiry(id: number, reason: string): Promise<ConsoleProjectListItem> {
  const res = await client.post<ConsoleProjectListItem>(`/console/inquiries/${id}/reject`, { reason })
  return res.data
}

export async function assignInquiryPartner(id: number, freelancerId: number): Promise<ConsoleProjectListItem> {
  const res = await client.patch<ConsoleProjectListItem>(`/console/inquiries/${id}/assign`, { freelancerId })
  return res.data
}

// ─── Product API ──────────────────────────────────────────────────────────────────

export type ProductType = 'EBOOK' | 'BUSINESS_CARD' | 'OFFICE_SUPPLY' | 'DESIGN_TEMPLATE'

export interface ConsoleProductListItem {
  id: number
  name: string
  description: string | null
  productType: ProductType
  price: number
  stock: number
  imageUrl: string | null
  visible: boolean
  createdAt: string
}

export interface ProductUpsertRequest {
  name: string
  description?: string
  productType: string
  price: number
  stock: number
  imageUrl?: string
  visible: boolean
}

export async function getProducts(page = 0, size = 20, type?: string, visible?: string, q?: string): Promise<PageResponse<ConsoleProductListItem>> {
  const res = await client.get<PageResponse<ConsoleProductListItem>>('/console/products', {
    params: { page, size, type: type || undefined, visible: visible || undefined, q: q || undefined },
  })
  return res.data
}

export async function createProduct(req: ProductUpsertRequest): Promise<ConsoleProductListItem> {
  const res = await client.post<ConsoleProductListItem>('/console/products', req)
  return res.data
}

export async function updateProduct(id: number, req: ProductUpsertRequest): Promise<ConsoleProductListItem> {
  const res = await client.put<ConsoleProductListItem>(`/console/products/${id}`, req)
  return res.data
}

export async function updateProductVisibility(id: number, visible: boolean): Promise<ConsoleProductListItem> {
  const res = await client.patch<ConsoleProductListItem>(`/console/products/${id}/visibility`, { visible })
  return res.data
}

export async function deleteProduct(id: number): Promise<void> {
  await client.delete(`/console/products/${id}`)
}

// ─── Review API ───────────────────────────────────────────────────────────────────

export interface ConsoleReviewListItem {
  id: number
  reviewerName: string
  reviewerEmail: string | null
  projectTitle: string | null
  projectId: number | null
  rating: number
  contentPreview: string | null
  visible: boolean
  createdAt: string
}

export async function getReviews(page = 0, size = 20, visible?: string, q?: string): Promise<PageResponse<ConsoleReviewListItem>> {
  const res = await client.get<PageResponse<ConsoleReviewListItem>>('/console/reviews', {
    params: { page, size, visible: visible || undefined, q: q || undefined },
  })
  return res.data
}

export async function updateReviewVisibility(id: number, visible: boolean): Promise<ConsoleReviewListItem> {
  const res = await client.patch<ConsoleReviewListItem>(`/console/reviews/${id}/visible`, { visible })
  return res.data
}

export async function deleteReview(id: number): Promise<void> {
  await client.delete(`/console/reviews/${id}`)
}

// ─── Chat API ─────────────────────────────────────────────────────────────────────

export interface ConsoleChatRoomListItem {
  id: number
  projectId: number | null
  projectTitle: string
  ownerName: string
  ownerEmail: string | null
  messageCount: number
  createdAt: string
}

export interface ConsoleChatMessageItem {
  id: number
  senderId: number | null
  senderName: string
  content: string | null
  attachmentUrl: string | null
  createdAt: string
}

export async function getChatRooms(page = 0, size = 20, q?: string): Promise<PageResponse<ConsoleChatRoomListItem>> {
  const res = await client.get<PageResponse<ConsoleChatRoomListItem>>('/console/chat/rooms', {
    params: { page, size, q: q || undefined },
  })
  return res.data
}

export async function getChatMessages(roomId: number, page = 0, size = 50): Promise<PageResponse<ConsoleChatMessageItem>> {
  const res = await client.get<PageResponse<ConsoleChatMessageItem>>(`/console/chat/rooms/${roomId}/messages`, {
    params: { page, size },
  })
  return res.data
}

// ─── Notification API ─────────────────────────────────────────────────────────────

export interface ConsoleNotificationListItem {
  id: number
  eventType: string
  status: string
  recipientEmail: string
  recipientName: string | null
  subject: string | null
  errorMessage: string | null
  retryCount: number
  createdAt: string
  sentAt: string | null
}

export async function getNotifications(page = 0, size = 20, type?: string, status?: string): Promise<PageResponse<ConsoleNotificationListItem>> {
  const res = await client.get<PageResponse<ConsoleNotificationListItem>>('/console/notifications', {
    params: { page, size, type: type || undefined, status: status || undefined },
  })
  return res.data
}

export async function retryNotification(id: number): Promise<ConsoleNotificationListItem> {
  const res = await client.post<ConsoleNotificationListItem>(`/console/notifications/${id}/retry`)
  return res.data
}

// ─── Audit Log API ────────────────────────────────────────────────────────────────

export interface ConsoleAuditLogListItem {
  id: number
  adminId: number | null
  adminEmail: string | null
  actionType: string
  targetType: string | null
  targetId: number | null
  beforeValue: string | null
  afterValue: string | null
  ipAddress: string | null
  createdAt: string
}

export async function getAuditLogs(
  page = 0, size = 20,
  adminEmail?: string, action?: string, targetType?: string,
  from?: string, to?: string
): Promise<PageResponse<ConsoleAuditLogListItem>> {
  const res = await client.get<PageResponse<ConsoleAuditLogListItem>>('/console/audit-logs', {
    params: { page, size, adminEmail: adminEmail || undefined, action: action || undefined, targetType: targetType || undefined, from: from || undefined, to: to || undefined },
  })
  return res.data
}

// ─── Settings API ─────────────────────────────────────────────────────────────────

export interface SystemSettingItem {
  id: number
  settingKey: string
  settingValue: string | null
  description: string | null
  updatedAt: string | null
}

export async function getSettings(): Promise<SystemSettingItem[]> {
  const res = await client.get<SystemSettingItem[]>('/console/settings')
  return res.data
}

export async function updateSetting(key: string, value: string): Promise<SystemSettingItem> {
  const res = await client.put<SystemSettingItem>(`/console/settings/${key}`, { value })
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

// ─── Login Audit API ─────────────────────────────────────────────────────────────

export interface ConsoleLoginAuditListItem {
  id: number
  memberId: number | null
  memberEmail: string | null
  memberName: string | null
  provider: string          // google | kakao | naver | email
  ipAddress: string | null
  userAgent: string | null
  success: boolean
  failureReason: string | null
  createdAt: string
}

export async function getLoginAudits(
  page = 0, size = 20,
  provider?: string, success?: boolean,
  from?: string, to?: string
): Promise<PageResponse<ConsoleLoginAuditListItem>> {
  const res = await client.get<PageResponse<ConsoleLoginAuditListItem>>('/console/login-audits', {
    params: {
      page, size,
      provider: provider || undefined,
      success: success !== undefined ? success : undefined,
      from: from || undefined,
      to: to || undefined,
    },
  })
  return res.data
}
