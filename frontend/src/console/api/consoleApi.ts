import axios from 'axios'

const client = axios.create({ baseURL: '/api' })

client.interceptors.request.use(config => {
  const token = localStorage.getItem('ploy_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  // Primary KPIs
  todayOrders: number
  todayInquiries: number
  activeProjects: number
  pendingApprovals: number
  newMembers: number
  todayRevenue: number
  // Day-over-day changes
  orderChange: number
  inquiryChange: number
  projectChange: number
  approvalChange: number
  memberChange: number
  revenueChange: number
  // Supplementary totals
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
  createdAt: string // ISO string
}

export interface RevenueDataPoint {
  date: string   // "YYYY-MM-DD"
  revenue: number
  orders: number
  inquiries: number
}

// ─── API calls ─────────────────────────────────────────────────────────────────

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
