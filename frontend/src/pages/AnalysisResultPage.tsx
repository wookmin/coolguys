import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import AnalysisReportContent from '../components/AnalysisReportContent'
import { useAnalysisStore } from '../store/analysisStore'

export default function AnalysisResultPage() {
  const navigate = useNavigate()
  const { selectedPatient, selectedSymptoms, vitalSigns, result, isLoading, reset } = useAnalysisStore()

  if (!selectedPatient) {
    navigate('/patients')
    return null
  }

  return (
    <Layout title="AI 분석 결과" showBack>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6" />
          <p className="text-slate-600 font-semibold text-lg">AI가 분석 중입니다...</p>
          <p className="text-slate-400 text-sm mt-2">증상과 활력징후를 종합 분석하고 있습니다</p>
        </div>
      ) : result ? (
        <div className="space-y-4">
          <AnalysisReportContent
            patientName={selectedPatient.name}
            patientAge={selectedPatient.age}
            ward={selectedPatient.ward}
            room={selectedPatient.room}
            symptoms={selectedSymptoms}
            vitalSigns={vitalSigns}
            riskLevel={result.riskLevel}
            sbar={result.sbar}
            missingItems={result.missingItems}
            checklist={result.checklist}
          />

          {/* 액션 버튼 */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => { reset(); navigate('/patients') }}
              className="py-3 bg-white border-2 border-slate-200 hover:border-blue-400 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              새 보고 작성
            </button>
            <button
              onClick={() => navigate('/history')}
              className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
            >
              이력 보기
            </button>
          </div>
        </div>
      ) : null}
    </Layout>
  )
}
