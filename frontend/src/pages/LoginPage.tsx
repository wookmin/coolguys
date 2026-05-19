import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, mockUsers } from '../store/authStore'

export default function LoginPage() {
  const [selectedId, setSelectedId] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = () => {
    const user = mockUsers.find((u) => u.id === selectedId)
    if (!user) return
    login(user)
    navigate(user.role === 'admin' ? '/admin' : '/patients')
  }

  const nurses = mockUsers.filter((u) => u.role === 'nurse')
  const admins = mockUsers.filter((u) => u.role === 'admin')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-9 h-9 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">요양병원 AI 증상 초기대응</h1>
          <p className="text-slate-500 text-sm mt-1">로그인하여 서비스를 이용하세요</p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">간호사 / 요양보호사</p>
            <div className="grid grid-cols-1 gap-2">
              {nurses.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSelectedId(u.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    selectedId === u.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                    {u.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{u.name}</p>
                    <p className="text-slate-400 text-xs">{u.ward} 담당</p>
                  </div>
                  {selectedId === u.id && (
                    <svg className="w-4 h-4 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">관리자</p>
            <div className="grid grid-cols-1 gap-2">
              {admins.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSelectedId(u.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    selectedId === u.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm flex-shrink-0">
                    {u.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{u.name}</p>
                    <p className="text-slate-400 text-xs">관리자</p>
                  </div>
                  {selectedId === u.id && (
                    <svg className="w-4 h-4 text-purple-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={!selectedId}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors mt-2"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  )
}
