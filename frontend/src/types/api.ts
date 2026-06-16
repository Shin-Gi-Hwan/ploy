// ─── Enums ────────────────────────────────────────────────────────────────────

export type ProjectType = 'BUSINESS_CARD' | 'PRESENTATION' | 'WEBSITE'

export type ProjectStatus =
  | 'BRIEF_SUBMITTED'
  | 'IN_PROGRESS'
  | 'REVIEW'
  | 'DELIVERED'

// ─── Public API ───────────────────────────────────────────────────────────────

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

export interface IntakeResponse {
  projectId: number
  magicToken: string
  trackingUrl: string
}

export interface TrackingDeliverable {
  id: number
  version: number
  note: string | null
  downloadUrl: string
}

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

// These values are i18n keys — use t(PROJECT_TYPE_LABELS[type]) in components
export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  BUSINESS_CARD: 'type.BUSINESS_CARD',
  PRESENTATION:  'type.PRESENTATION',
  WEBSITE:       'type.WEBSITE',
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  BRIEF_SUBMITTED: 'status.BRIEF_SUBMITTED',
  IN_PROGRESS:     'status.IN_PROGRESS',
  REVIEW:          'status.REVIEW',
  DELIVERED:       'status.DELIVERED',
}

export const PROJECT_STATUS_ORDER: ProjectStatus[] = [
  'BRIEF_SUBMITTED',
  'IN_PROGRESS',
  'REVIEW',
  'DELIVERED',
]
