import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import '../../console.css'

export default function ConsoleLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="console-root">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setCollapsed(v => !v)}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className={`cs-main${collapsed ? ' collapsed' : ''}`}>
        <TopBar onMobileMenuClick={() => setMobileOpen(v => !v)} />
        <main className="cs-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
