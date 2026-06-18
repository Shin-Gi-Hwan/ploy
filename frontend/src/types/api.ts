// ─── User & Auth ──────────────────────────────────────────────────────────────

export type UserRole = 'USER' | 'OUTSOURCING_PARTNER' | 'ADMIN'

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

// ─── Partner & Portfolio ──────────────────────────────────────────────────────

export type PortfolioCategory = 'PPT' | 'LOGO' | 'BUSINESS_CARD' | 'WEBSITE' | 'DETAIL_PAGE' | 'OTHER'

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface PortfolioItem {
  id: number
  title: string
  description: string | null
  category: PortfolioCategory
  thumbnailUrl: string | null
  fileUrl: string | null
  createdAt: string
}

export interface PartnerSummary {
  id: number
  displayName: string
  bio: string | null
  profileImageUrl: string | null
  specialties: string | null
  yearsOfExperience: number | null
  averageRating: number
  completedCount: number
}

export interface PartnerDetail extends PartnerSummary {
  skills: string | null
  portfolioItems: PortfolioItem[]
}

export interface PartnerApplicationRequest {
  introduction: string
  portfolioUrl?: string
  displayName?: string
  specialties?: string
  yearsOfExperience?: number
}

export interface PartnerApplicationResponse {
  id: number
  memberId: number
  memberName: string
  memberEmail: string
  status: ApplicationStatus
  introduction: string
  portfolioUrl: string | null
  rejectionReason: string | null
  appliedAt: string
  reviewedAt: string | null
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
