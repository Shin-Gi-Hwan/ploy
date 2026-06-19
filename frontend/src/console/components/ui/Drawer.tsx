import { useEffect } from 'react'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  width?: number
}

export default function Drawer({ open, onClose, title, children, width = 480 }: DrawerProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cs-drawer-backdrop${open ? ' open' : ''}`}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`cs-drawer-panel${open ? ' open' : ''}`}
        style={{ width }}
        role="dialog"
        aria-modal="true"
      >
        <div className="cs-drawer-header">
          <span className="cs-drawer-title">{title}</span>
          <button className="cs-drawer-close" onClick={onClose} aria-label="닫기">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="cs-drawer-body">{children}</div>
      </div>
    </>
  )
}
