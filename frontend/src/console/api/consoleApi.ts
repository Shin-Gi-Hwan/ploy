import axios from 'axios'

// Reuses the same base URL + JWT interceptor logic as the main api.ts
const client = axios.create({ baseURL: '/api' })

client.interceptors.request.use(config => {
  const token = localStorage.getItem('ploy_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalMembers: number
  newMembersToday: number
  totalPartners: number
  pendingPartnerApplications: number
  totalProjects: number
  activeProjects: number
  newProjectsToday: number
  pendingApprovals: number
  projectsByStatus: Record<string, number>
}

export interface ActivityItem {
  type: 'project' | 'member' | 'partner'
  description: string
  timestamp: string // ISO string from backend
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
