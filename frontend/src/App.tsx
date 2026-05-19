import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import PatientSelectPage from './pages/PatientSelectPage'
import SymptomInputPage from './pages/SymptomInputPage'
import VitalSignsPage from './pages/VitalSignsPage'
import AnalysisResultPage from './pages/AnalysisResultPage'
import HistoryPage from './pages/HistoryPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminGuidelinesPage from './pages/AdminGuidelinesPage'

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'nurse' | 'admin' }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const user = useAuthStore((s) => s.user)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/patients" replace />}
            </ProtectedRoute>
          }
        />
        <Route path="/patients" element={<ProtectedRoute requiredRole="nurse"><PatientSelectPage /></ProtectedRoute>} />
        <Route path="/symptoms" element={<ProtectedRoute requiredRole="nurse"><SymptomInputPage /></ProtectedRoute>} />
        <Route path="/vitals" element={<ProtectedRoute requiredRole="nurse"><VitalSignsPage /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute requiredRole="nurse"><AnalysisResultPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute requiredRole="nurse"><HistoryPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/guidelines" element={<ProtectedRoute requiredRole="admin"><AdminGuidelinesPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
