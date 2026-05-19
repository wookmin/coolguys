import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { historyRecords as initialHistoryRecords } from '../data/history'
import type { HistoryRecord } from '../types'

interface HistoryState {
  records: HistoryRecord[]
  addRecord: (record: HistoryRecord) => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      records: initialHistoryRecords,
      addRecord: (record) =>
        set((state) => ({
          records: [record, ...state.records],
        })),
    }),
    { name: 'history-storage' }
  )
)
