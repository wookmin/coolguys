import { useMemo } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import AnalysisReportContent from '../components/AnalysisReportContent'
import { patients } from '../data/patients'
import { useHistoryStore } from '../store/historyStore'

export default function AdminHistoryReportPage() {
  const navigate = useNavigate()
  const { recordId } = useParams()
  const historyRecords = useHistoryStore((state) => state.records)

  const record = historyRecords.find((item) => item.id === recordId)
  const patient = useMemo(
    () => patients.find((item) => item.id === record?.patientId),
    [record?.patientId]
  )

  if (!recordId) {
    return <Navigate to="/admin" replace />
  }

  if (!record) {
    return (
      <Layout title="AI 리포트 상세" showBack>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">이력을 찾을 수 없습니다</h2>
          <p className="text-slate-500 text-sm mb-5">선택한 최근 대응 이력이 없거나 삭제되었습니다.</p>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="AI 리포트 상세" showBack>
      <AnalysisReportContent
        patientName={record.patientName}
        patientAge={patient?.age}
        ward={record.ward}
        room={record.room}
        symptoms={record.symptoms}
        vitalSigns={record.vitalSigns}
        riskLevel={record.riskLevel}
        sbar={record.sbar}
        reportedAt={record.reportedAt}
        reportedBy={record.reportedBy}
      />
    </Layout>
  )
}
