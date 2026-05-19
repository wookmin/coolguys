import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'auth-storage' }
  )
)

export const mockUsers: User[] = [
  { id: 'u001', name: '이간호', role: 'nurse', ward: 'A동' },
  { id: 'u002', name: '박요양', role: 'nurse', ward: 'B동' },
  { id: 'u003', name: '김간호', role: 'nurse', ward: 'C동' },
  { id: 'u004', name: '최관리', role: 'admin', ward: '전체' },
]
