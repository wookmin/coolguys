import Layout from '../components/Layout'
import RiskBadge from '../components/RiskBadge'
import { useHistoryStore } from '../store/historyStore'
import type { RiskLevel } from '../types'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const RISK_COLORS: Record<RiskLevel, string> = {
  emergency: '#ef4444',
  warning: '#f97316',
  caution: '#eab308',
  normal: '#22c55e',
}

const RISK_LABELS: Record<RiskLevel, string> = {
  emergency: '응급',
  warning: '경고',
  caution: '주의',
  normal: '일반',
}

export default function AdminDashboardPage() {
  const historyRecords = useHistoryStore((s) => s.records)

  const riskCounts = historyRecords.reduce(
    (acc, r) => { acc[r.riskLevel] = (acc[r.riskLevel] || 0) + 1; return acc },
    {} as Record<RiskLevel, number>
  )

  const pieData = (['emergency', 'warning', 'caution', 'normal'] as RiskLevel[])
    .filter((k) => riskCounts[k])
    .map((k) => ({ name: RISK_LABELS[k], value: riskCounts[k], color: RISK_COLORS[k] }))

  const wardCounts = historyRecords.reduce(
    (acc, r) => { acc[r.ward] = (acc[r.ward] || 0) + 1; return acc },
    {} as Record<string, number>
  )
  const barData = Object.entries(wardCounts).map(([ward, count]) => ({ ward, 건수: count }))

  const sorted = [...historyRecords].sort(
    (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  )

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  const stats = [
    { label: '전체 보고', value: historyRecords.length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '응급', value: riskCounts.emergency || 0, color: 'text-red-600', bg: 'bg-red-50' },
    { label: '경고', value: riskCounts.warning || 0, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: '주의', value: riskCounts.caution || 0, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ]

  return (
    <Layout title="관리자 대시보드">
      <h2 className="text-xl font-bold text-slate-800 mb-6">대시보드</h2>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4`}>
            <p className="text-slate-500 text-xs font-medium">{label}</p>
            <p className={`text-3xl font-bold ${color} mt-1`}>{value}</p>
          </div>
        ))}
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4 text-sm">위험도별 분포</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name} ${value}`} labelLine={false}>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4 text-sm">병동별 보고 건수</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="ward" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="건수" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 최근 이력 테이블 */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-700">최근 대응 이력</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs">시간</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs">환자</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs">병실</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs">위험도</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs">주요 증상</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs">보고자</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sorted.slice(0, 10).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(r.reportedAt)}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{r.patientName}</td>
                  <td className="px-4 py-3 text-slate-500">{r.ward} {r.room}</td>
                  <td className="px-4 py-3"><RiskBadge level={r.riskLevel} /></td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{r.symptoms.join(', ')}</td>
                  <td className="px-4 py-3 text-slate-500">{r.reportedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
