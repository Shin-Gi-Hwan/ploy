import Button from '../ui/Button'

interface AdminLayoutProps {
  children: React.ReactNode
  onRefresh?: () => void
  refreshing?: boolean
}

export default function AdminLayout({ children, onRefresh, refreshing }: AdminLayoutProps) {
  return (
    <div className="admin-layout">
      <header className="admin-topbar">
        <a href="/" className="admin-logo" aria-label="Ploy home">
          Ploy
          <span style={{ color: 'var(--gray-400)', fontWeight: 400, fontSize: 13, marginLeft: 8 }}>
            Admin
          </span>
        </a>
        {onRefresh && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            loading={refreshing}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </Button>
        )}
      </header>
      <div className="admin-main">
        {children}
      </div>
    </div>
  )
}
