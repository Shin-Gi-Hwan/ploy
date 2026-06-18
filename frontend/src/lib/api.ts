import axios from 'axios'
import i18n from '../i18n'
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  IntakeRequest,
  IntakeResponse,
  TrackingResponse,
  AdminProject,
  AdminDeliverable,
  ProjectStatus,
  ServiceRequestPayload,
  ServiceRequestResponse,
  Project,
} from '../types/api'

// ─── Base client ──────────────────────────────────────────────────────────────

const client = axios.create({ baseURL: '/api' })

// Attach JWT on every request if present
client.interceptors.request.use(config => {
  const token = localStorage.getItem('ploy_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Auth helper (Admin only — Basic auth, never stored in localStorage) ──────

function authHeader(username: string, password: string) {
  return { Authorization: 'Basic ' + btoa(`${username}:${password}`) }
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>('/auth/login', data)
  return res.data
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>('/auth/register', data)
  return res.data
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

// ─── Client endpoints ─────────────────────────────────────────────────────────

export async function submitServiceRequest(
  data: ServiceRequestPayload,
): Promise<ServiceRequestResponse> {
  const res = await client.post<ServiceRequestResponse>('/service-requests', data)
  return res.data
}

export async function getMyProjects(): Promise<Project[]> {
  const res = await client.get<Project[]>('/client/projects')
  return res.data
}

export async function getMyProject(id: number): Promise<Project> {
  const res = await client.get<Project>(`/client/projects/${id}`)
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
    if (err.response?.status === 401) return t('errors.invalidCredentials')
    if (err.response?.status === 404) return t('errors.notFound')
    if (err.response?.status === 409) return t('errors.emailTaken')
    if (typeof err.response?.data === 'string' && err.response.data.length < 200) {
      return err.response.data
    }
  }
  return t(fallbackKey)
}
