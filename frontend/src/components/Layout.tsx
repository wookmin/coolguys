import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  showBack?: boolean
}

export default function Layout({ children, title, showBack }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const nurseNavItems = [
    { path: '/patients', label: '환자 선택' },
    { path: '/history', label: '대응 이력' },
  ]

  const adminNavItems = [
    { path: '/admin', label: '대시보드' },
    { path: '/admin/guidelines', label: '지침 관리' },
  ]

  const navItems = user?.role === 'admin' ? adminNavItems : nurseNavItems

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <button onClick={() => navigate(-1)} className="p-1 hover:bg-blue-600 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-base font-bold leading-tight">요양병원 AI 증상 초기대응</h1>
              {title && <p className="text-blue-200 text-xs">{title}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex gap-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-white text-blue-700'
                      : 'hover:bg-blue-600 text-blue-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-200">{user?.name} ({user?.ward})</span>
              <button
                onClick={() => { logout(); navigate('/login') }}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
