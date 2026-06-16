import axios from 'axios'
import i18n from '../i18n'
import type {
  IntakeRequest,
  IntakeResponse,
  TrackingResponse,
  AdminProject,
  AdminDeliverable,
  ProjectStatus,
} from '../types/api'

// ─── Base client ──────────────────────────────────────────────────────────────

const client = axios.create({ baseURL: '/api' })

// ─── Auth helper (Admin only — Basic auth, never stored in localStorage) ──────

function authHeader(username: string, password: string) {
  return { Authorization: 'Basic ' + btoa(`${username}:${password}`) }
}

// ─── Public endpoints ─────────────────────────────────────────────────────────

export async function submitBrief(data: IntakeRequest): Promise<IntakeResponse> {
  const res = await client.post<IntakeResponse>('/projects', data)
  return res.data
}

export async function getTracking(token: string): Promise<TrackingResponse> {
  const res = await client.get<TrackingResponse>(`/projects/track/${token}`)
  return res.data
}

// ─── Admin endpoints ──────────────────────────────────────────────────────────

export async function getAdminProjects(
  username: string,
  password: string,
): Promise<AdminProject[]> {
  const res = await client.get<AdminProject[]>('/admin/projects', {
    headers: authHeader(username, password),
  })
  return res.data
}

export async function updateProjectStatus(
  id: number,
  status: ProjectStatus,
  username: string,
  password: string,
): Promise<AdminProject> {
  const res = await client.patch<AdminProject>(
    `/admin/projects/${id}/status`,
    { status },
    { headers: authHeader(username, password) },
  )
  return res.data
}

export async function uploadDeliverable(
  id: number,
  file: File,
  note: string | undefined,
  username: string,
  password: string,
): Promise<AdminDeliverable> {
  const form = new FormData()
  form.append('file', file)
  if (note) form.append('note', note)
  const res = await client.post<AdminDeliverable>(
    `/admin/projects/${id}/deliverables`,
    form,
    { headers: authHeader(username, password) },
  )
  return res.data
}

// ─── Error helpers ────────────────────────────────────────────────────────────

export function getErrorMessage(err: unknown, fallbackKey = 'errors.somethingWentWrong'): string {
  const t = i18n.t.bind(i18n)
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 429) return t('errors.tooManyRequests')
    if (typeof err.response?.data === 'string' && err.response.data.length < 200) {
      return err.response.data
    }
    if (err.response?.status === 404) return t('errors.notFound')
    if (err.response?.status === 401) return t('errors.invalidCredentials')
  }
  return t(fallbackKey)
}
