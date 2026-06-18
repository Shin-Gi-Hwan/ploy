/* Inline SVG icons for the console — Feather/Lucide style (MIT) */

interface IconProps {
  size?: number
  className?: string
}

const props = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export function IcDashboard({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  )
}

export function IcProjects({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
      <line x1="9" y1="14" x2="15" y2="14"/>
      <line x1="12" y1="11" x2="12" y2="17"/>
    </svg>
  )
}

export function IcInquiries({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  )
}

export function IcUsers({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )
}

export function IcPartners({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3z"/>
      <path d="M8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z"/>
      <path d="M8 13c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      <path d="M16 13c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2c0-2.66-5.33-4-7-4z"/>
    </svg>
  )
}

export function IcProducts({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}

export function IcOrders({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  )
}

export function IcReviews({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

export function IcChat({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

export function IcNotifications({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  )
}

export function IcAudit({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

export function IcSettings({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  )
}

export function IcChevronLeft({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}

export function IcChevronRight({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}

export function IcMenu({ size = 20 }: IconProps) {
  return (
    <svg {...props(size)}>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6"  x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

export function IcSearch({ size = 16 }: IconProps) {
  return (
    <svg {...props(size)}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

export function IcBell({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  )
}

export function IcLogout({ size = 18 }: IconProps) {
  return (
    <svg {...props(size)}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}

// Icon resolver
export function NavIcon({ icon, size = 18 }: { icon: string; size?: number }) {
  switch (icon) {
    case 'dashboard':      return <IcDashboard size={size} />
    case 'projects':       return <IcProjects size={size} />
    case 'inquiries':      return <IcInquiries size={size} />
    case 'users':          return <IcUsers size={size} />
    case 'partners':       return <IcPartners size={size} />
    case 'products':       return <IcProducts size={size} />
    case 'orders':         return <IcOrders size={size} />
    case 'reviews':        return <IcReviews size={size} />
    case 'chat':           return <IcChat size={size} />
    case 'notifications':  return <IcNotifications size={size} />
    case 'audit':          return <IcAudit size={size} />
    case 'settings':       return <IcSettings size={size} />
    default:               return null
  }
}
