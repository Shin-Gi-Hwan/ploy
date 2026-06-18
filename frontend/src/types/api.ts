// ─── User & Auth ──────────────────────────────────────────────────────────────

export type UserRole = 'CLIENT' | 'FREELANCER' | 'ADMIN'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// ─── Service Types ────────────────────────────────────────────────────────────

export type ServiceType =
  | 'BUSINESS_CARD'
  | 'PRESENTATION'
  | 'WEBSITE'
  | 'LOGO'
  | 'DETAIL_PAGE'
  | 'MOBILE_APP'

/** @deprecated use ServiceType — kept for backward compat with old pages */
export type ProjectType = ServiceType

// ─── Project Status ───────────────────────────────────────────────────────────

export type ProjectStatus =
  | 'REQUESTED'
  | 'REVIEWING'
  | 'APPROVED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'REVIEW'
  | 'COMPLETED'
  | 'REJECTED'
  // Legacy statuses (kept for Tracking page backward compat)
  | 'BRIEF_SUBMITTED'
  | 'DELIVERED'

// ─── Service Request (Client → Platform) ──────────────────────────────────────

export interface ServiceRequestPayload {
  serviceType: ServiceType
  title: string
  description: string
  colorPreferences?: string
  styleRefs?: string
  additionalNotes?: string
  deadline?: string
}

export interface ServiceRequestResponse {
  projectId: number
  status: ProjectStatus
  trackingUrl?: string
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface ProjectDeliverable {
  id: number
  version: number
  note: string | null
  downloadUrl: string
  uploadedAt: string
}

export interface ProjectMember {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface Project {
  id: number
  title: string
  serviceType: ServiceType
  status: ProjectStatus
  createdAt: string
  updatedAt: string
  client: ProjectMember
  freelancer: ProjectMember | null
  deliverables: ProjectDeliverable[]
}

// ─── Legacy Public API (Tracking page) ───────────────────────────────────────

/** @deprecated use Project — kept for Tracking page */
export interface IntakeRequest {
  name: string
  email: string
  phone?: string
  type: ProjectType
  visionText: string
  colorPreferences?: string
  styleRefs?: string
  additionalNotes?: string
}

/** @deprecated */
export interface IntakeResponse {
  projectId: number
  magicToken: string
  trackingUrl: string
}

/** @deprecated */
export interface TrackingDeliverable {
  id: number
  version: number
  note: string | null
  downloadUrl: string
}

/** @deprecated */
export interface TrackingResponse {
  projectId: number
  type: ProjectType
  status: ProjectStatus
  clientName: string
  latestDeliverable: TrackingDeliverable | null
}

// ─── Admin API ────────────────────────────────────────────────────────────────

export interface AdminClient {
  id: number
  name: string
  email: string
  phone: string | null
}

export interface AdminDeliverable {
  id: number
  version: number
  note: string | null
  downloadUrl: string
  uploadedAt: string
}

export interface AdminProject {
  id: number
  type: ProjectType
  status: ProjectStatus
  magicToken: string
  createdAt: string
  updatedAt: string
  client: AdminClient
  deliverables: AdminDeliverable[]
}

export interface DeliverableUploadResponse {
  id: number
  version: number
  downloadUrl: string
}

export interface StatusUpdateRequest {
  status: ProjectStatus
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  BUSINESS_CARD: 'type.BUSINESS_CARD',
  PRESENTATION:  'type.PRESENTATION',
  WEBSITE:       'type.WEBSITE',
  LOGO:          'type.LOGO',
  DETAIL_PAGE:   'type.DETAIL_PAGE',
  MOBILE_APP:    'type.MOBILE_APP',
}

/** @deprecated use SERVICE_TYPE_LABELS */
export const PROJECT_TYPE_LABELS = SERVICE_TYPE_LABELS

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  REQUESTED:      'status.REQUESTED',
  REVIEWING:      'status.REVIEWING',
  APPROVED:       'status.APPROVED',
  ASSIGNED:       'status.ASSIGNED',
  IN_PROGRESS:    'status.IN_PROGRESS',
  REVIEW:         'status.REVIEW',
  COMPLETED:      'status.COMPLETED',
  REJECTED:       'status.REJECTED',
  // Legacy
  BRIEF_SUBMITTED: 'status.BRIEF_SUBMITTED',
  DELIVERED:       'status.DELIVERED',
}

export const PROJECT_STATUS_ORDER: ProjectStatus[] = [
  'REQUESTED',
  'REVIEWING',
  'APPROVED',
  'ASSIGNED',
  'IN_PROGRESS',
  'REVIEW',
  'COMPLETED',
]
