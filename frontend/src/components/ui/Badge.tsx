import { useTranslation } from 'react-i18next'
import type { ProjectStatus } from '../../types/api'
import { PROJECT_STATUS_LABELS } from '../../types/api'

export type BadgeVariant = 'default' | 'mint' | 'info' | 'warning' | 'success' | 'error'

// Legacy alias used in some existing components
export type LegacyBadgeVariant = 'neutral'

const STATUS_VARIANT: Record<ProjectStatus, BadgeVariant> = {
  REQUESTED:      'default',
  REVIEWING:      'info',
  APPROVED:       'info',
  ASSIGNED:       'info',
  IN_PROGRESS:    'mint',
  REVIEW:         'warning',
  COMPLETED:      'success',
  REJECTED:       'error',
  // Legacy
  BRIEF_SUBMITTED: 'default',
  DELIVERED:       'success',
}

interface StatusBadgeProps {
  status: ProjectStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation()
  const variant = STATUS_VARIANT[status] ?? 'default'
  return (
    <span className={`badge badge-${variant}`} role="status">
      {t(PROJECT_STATUS_LABELS[status])}
    </span>
  )
}

interface BadgeProps {
  variant?: BadgeVariant | 'neutral'
  children: React.ReactNode
  className?: string
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  // Map legacy 'neutral' to 'default'
  const v = variant === 'neutral' ? 'default' : variant
  return (
    <span className={`badge badge-${v} ${className}`}>
      {children}
    </span>
  )
}
