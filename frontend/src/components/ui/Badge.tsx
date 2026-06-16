import type { ProjectStatus } from '../../types/api'
import { PROJECT_STATUS_LABELS } from '../../types/api'

type BadgeVariant = 'neutral' | 'mint' | 'warning' | 'success'

const STATUS_VARIANT: Record<ProjectStatus, BadgeVariant> = {
  BRIEF_SUBMITTED: 'neutral',
  IN_PROGRESS:     'mint',
  REVIEW:          'warning',
  DELIVERED:       'success',
}

interface StatusBadgeProps {
  status: ProjectStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = STATUS_VARIANT[status]
  return (
    <span className={`badge badge-${variant}`} role="status">
      {PROJECT_STATUS_LABELS[status]}
    </span>
  )
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export default function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  )
}
