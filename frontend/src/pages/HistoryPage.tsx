import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import RiskBadge from '../components/RiskBadge'
import { historyRecords } from '../data/history'
import type { HistoryRecord, RiskLevel } from '../types'

export default function HistoryPage() {
  const navigate = useNavigate()
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null)
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all')

  const filtered = historyRecords.filter((r) => filterRisk === 'all' || r.riskLevel === filterRisk)
  const sorted = [...filtered].sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())

  const riskLabels: Record<RiskLevel, string> = { normal: '일반', caution: '주의', warning: '경고', emergency: '응급' }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  return (
    <Layout title="대응 이력">
      {selectedRecord ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedRecord(null)}
            className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-800"
          >
            ← 목록으로
          </button>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <RiskBadge level={selectedRecord.riskLevel} large />
              <div>
                <p className="font-bold text-slate-800">{selectedRecord.patientName}</p>
                <p className="text-slate-500 text-xs">{selectedRecord.ward} {selectedRecord.room} · {formatDate(selectedRecord.reportedAt)} · {selectedRecord.reportedBy}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xs text-slate-400 mb-1">보고 증상</p>
              <div className="flex flex-wrap gap-1">
                {selectedRecord.symptoms.map((s) => (
                  <span key={s} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4 text-sm bg-slate-50 rounded-lg p-3">
              <div><span className="text-slate-400">체온</span> <span className="font-semibold">{selectedRecord.vitalSigns.temperature}℃</span></div>
              <div><span className="text-slate-400">혈압</span> <span className="font-semibold">{selectedRecord.vitalSigns.systolicBP}/{selectedRecord.vitalSigns.diastolicBP}</span></div>
              <div><span className="text-slate-400">맥박</span> <span className="font-semibold">{selectedRecord.vitalSigns.pulse}회/분</span></div>
              <div><span className="text-slate-400">산소</span> <span className="font-semibold">{selectedRecord.vitalSigns.oxygenSaturation}%</span></div>
            </div>
            <div className="space-y-3">
              {(['S', 'B', 'A', 'R'] as const).map((key) => {
                const labels = { S: 'Situation', B: 'Background', A: 'Assessment', R: 'Recommendation' }
                const colors = { S: 'bg-blue-600', B: 'bg-slate-500', A: 'bg-orange-500', R: 'bg-green-600' }
                return (
                  <div key={key} className="flex gap-3">
                    <div className={`${colors[key]} text-white w-6 h-6 rounded flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5`}>{key}</div>
                    <div>
                      <p className="text-xs text-slate-400">{labels[key]}</p>
                      <p className="text-slate-700 text-sm">{selectedRecord.sbar[key]}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">대응 이력</h2>
            <button
              onClick={() => navigate('/patients')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              + 새 보고
            </button>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {(['all', 'emergency', 'warning', 'caution', 'normal'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFilterRisk(level)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filterRisk === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                }`}
              >
                {level === 'all' ? '전체' : riskLabels[level]}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {sorted.map((record) => (
              <button
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className="w-full bg-white rounded-xl border border-slate-200 p-4 text-left hover:border-blue-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <RiskBadge level={record.riskLevel} />
                    <span className="font-bold text-slate-800">{record.patientName}</span>
                    <span className="text-slate-400 text-sm">{record.ward} {record.room}</span>
                  </div>
                  <span className="text-slate-400 text-xs whitespace-nowrap">{formatDate(record.reportedAt)}</span>
                </div>
                <p className="text-slate-500 text-sm mt-2 line-clamp-1">{record.sbar.S}</p>
                <p className="text-slate-400 text-xs mt-1">보고자: {record.reportedBy}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}
