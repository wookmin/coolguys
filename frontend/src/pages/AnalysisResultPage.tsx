import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import RiskBadge from '../components/RiskBadge'
import { useAnalysisStore } from '../store/analysisStore'
import type { RiskLevel } from '../types'

const riskConfig: Record<RiskLevel, { title: string; bg: string; border: string; action: string }> = {
  normal: {
    title: '정상 범위',
    bg: 'bg-green-50',
    border: 'border-green-200',
    action: '지속적인 모니터링을 유지하세요.',
  },
  caution: {
    title: '주의 요망',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    action: '담당 간호사에게 보고하고 상태를 주의 깊게 관찰하세요.',
  },
  warning: {
    title: '경고 — 즉시 보고 필요',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    action: '담당의에게 즉시 연락하고 처방에 따라 조치하세요.',
  },
  emergency: {
    title: '응급 — 즉각 조치 필요',
    bg: 'bg-red-50',
    border: 'border-red-200',
    action: '119 신고 및 담당의에게 즉시 연락하고 응급 처치를 시작하세요.',
  },
}

export default function AnalysisResultPage() {
  const navigate = useNavigate()
  const { selectedPatient, selectedSymptoms, vitalSigns, result, isLoading, reset } = useAnalysisStore()

  if (!selectedPatient) {
    navigate('/patients')
    return null
  }

  const config = result ? riskConfig[result.riskLevel] : null

  return (
    <Layout title="AI 분석 결과" showBack>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6" />
          <p className="text-slate-600 font-semibold text-lg">AI가 분석 중입니다...</p>
          <p className="text-slate-400 text-sm mt-2">증상과 활력징후를 종합 분석하고 있습니다</p>
        </div>
      ) : result && config ? (
        <div className="space-y-4">
          {/* 위험도 카드 */}
          <div className={`${config.bg} border-2 ${config.border} rounded-2xl p-5`}>
            <div className="flex items-center gap-3 mb-2">
              <RiskBadge level={result.riskLevel} large />
              <h2 className="text-xl font-bold text-slate-800">{config.title}</h2>
            </div>
            <p className="text-slate-700 font-medium">{config.action}</p>
          </div>

          {/* 환자 / 증상 요약 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-700 mb-3 text-sm">분석 정보</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-400 text-xs">환자</p>
                <p className="font-semibold text-slate-800">{selectedPatient.name} ({selectedPatient.age}세)</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">병실</p>
                <p className="font-semibold text-slate-800">{selectedPatient.ward} {selectedPatient.room}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">체온 / 산소포화도</p>
                <p className="font-semibold text-slate-800">{vitalSigns.temperature}℃ / {vitalSigns.oxygenSaturation}%</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">혈압 / 맥박</p>
                <p className="font-semibold text-slate-800">{vitalSigns.systolicBP}/{vitalSigns.diastolicBP} mmHg / {vitalSigns.pulse}회</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-slate-400 text-xs mb-1">보고된 증상</p>
              <div className="flex flex-wrap gap-1">
                {selectedSymptoms.map((s) => (
                  <span key={s} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* SBAR 보고문 */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-4">SBAR 보고문</h3>
            {(['S', 'B', 'A', 'R'] as const).map((key) => {
              const labels = { S: 'Situation (상황)', B: 'Background (배경)', A: 'Assessment (평가)', R: 'Recommendation (권고)' }
              const colors = { S: 'bg-blue-600', B: 'bg-slate-500', A: 'bg-orange-500', R: 'bg-green-600' }
              return (
                <div key={key} className="flex gap-3 mb-4 last:mb-0">
                  <div className={`${colors[key]} text-white w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5`}>
                    {key}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-1">{labels[key]}</p>
                    <p className="text-slate-700 text-sm leading-relaxed">{result.sbar[key]}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 누락 항목 */}
          {result.missingItems.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="font-semibold text-amber-800 mb-2 text-sm">추가 확인 필요 항목</h3>
              <ul className="space-y-1">
                {result.missingItems.map((item, i) => (
                  <li key={i} className="text-amber-700 text-sm flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 체크리스트 */}
          {result.checklist.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-700 mb-3 text-sm">즉시 확인 체크리스트</h3>
              <ul className="space-y-2">
                {result.checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-blue-500 font-bold mt-0.5">☐</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
