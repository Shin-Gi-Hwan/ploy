import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Spinner from '../../components/ui/Spinner'
import { getMyProjects } from '../../lib/api'
import type { Project, ProjectDeliverable } from '../../types/api'

interface FileItem extends ProjectDeliverable {
  projectId: number
  projectTitle: string
}

export default function ClientFiles() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyProjects()
      .then((projects: Project[]) => {
        const all: FileItem[] = []
        for (const p of projects) {
          for (const d of p.deliverables) {
            all.push({ ...d, projectId: p.id, projectTitle: p.title })
          }
        }
        all.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        setFiles(all)
      })
      .catch(() => setError('파일 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout title="파일">
      <div className="client-section">
        <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--text-tertiary)' }}>
          총 {files.length}개 파일
        </div>

        {loading && <div className="client-loading"><Spinner /></div>}
        {error && <div className="client-error">{error}</div>}

        {!loading && !error && files.length === 0 && (
          <div className="client-empty">
            <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
            <p className="client-empty-text">납품된 파일이 없습니다.</p>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
              프로젝트가 완료되면 이곳에서 파일을 다운로드할 수 있습니다.
            </p>
          </div>
        )}

        {!loading && !error && files.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {files.map(file => (
              <a
                key={file.id}
                href={file.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none', color: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: '#fff', border: '1px solid var(--border-default)',
                  borderRadius: 10, padding: '14px 18px',
                  transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                  background: 'var(--mint-50)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 20,
                }}>
                  📄
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                    {file.projectTitle} — v{file.version} 납품본
                  </div>
                  {file.note && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.note}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                    {new Date(file.uploadedAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
                <span style={{ fontSize: 13, color: 'var(--mint-600)', fontWeight: 600, flexShrink: 0 }}>
                  다운로드 ↓
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
