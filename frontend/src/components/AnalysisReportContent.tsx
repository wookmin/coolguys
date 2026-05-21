import RiskBadge from './RiskBadge'
import type { RiskLevel, SbarReport, VitalSigns } from '../types'

export const riskConfig: Record<RiskLevel, { title: string; bg: string; border: string; action: string }> = {
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

interface AnalysisReportContentProps {
  patientName: string
  patientAge?: number
  ward: string
  room: string
  symptoms: string[]
  vitalSigns: VitalSigns
  riskLevel: RiskLevel
  sbar: SbarReport
  reportedAt?: string
  reportedBy?: string
  missingItems?: string[]
  checklist?: string[]
}

const sbarLabels = {
  S: 'Situation (상황)',
  B: 'Background (배경)',
  A: 'Assessment (평가)',
  R: 'Recommendation (권고)',
} as const

const sbarColors = {
  S: 'bg-blue-600',
  B: 'bg-slate-500',
  A: 'bg-orange-500',
  R: 'bg-green-600',
} as const

const formatDate = (iso: string) => {
  const date = new Date(iso)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export default function AnalysisReportContent({
  patientName,
  patientAge,
  ward,
  room,
  symptoms,
  vitalSigns,
  riskLevel,
  sbar,
  reportedAt,
  reportedBy,
  missingItems = [],
  checklist = [],
}: AnalysisReportContentProps) {
  const config = riskConfig[riskLevel]

  return (
    <div className="space-y-4">
      <div className={`${config.bg} border-2 ${config.border} rounded-2xl p-5`}>
        <div className="flex items-center gap-3 mb-2">
          <RiskBadge level={riskLevel} large />
          <h2 className="text-xl font-bold text-slate-800">{config.title}</h2>
        </div>
        <p className="text-slate-700 font-medium">{config.action}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-700 mb-3 text-sm">분석 정보</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-400 text-xs">환자</p>
            <p className="font-semibold text-slate-800">
              {patientName}
              {typeof patientAge === 'number' ? ` (${patientAge}세)` : ''}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">병실</p>
            <p className="font-semibold text-slate-800">{ward} {room}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">체온 / 산소포화도</p>
            <p className="font-semibold text-slate-800">{vitalSigns.temperature}℃ / {vitalSigns.oxygenSaturation}%</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">혈압 / 맥박</p>
            <p className="font-semibold text-slate-800">{vitalSigns.systolicBP}/{vitalSigns.diastolicBP} mmHg / {vitalSigns.pulse}회</p>
          </div>
          {(reportedAt || reportedBy) && (
            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
              {reportedAt && (
                <div>
                  <p className="text-slate-400 text-xs">보고 시각</p>
                  <p className="font-semibold text-slate-800">{formatDate(reportedAt)}</p>
                </div>
              )}
              {reportedBy && (
                <div>
                  <p className="text-slate-400 text-xs">보고자</p>
                  <p className="font-semibold text-slate-800">{reportedBy}</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="text-slate-400 text-xs mb-1">보고된 증상</p>
          <div className="flex flex-wrap gap-1">
            {symptoms.map((symptom) => (
              <span key={symptom} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{symptom}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800 mb-4">SBAR 보고문</h3>
        {(['S', 'B', 'A', 'R'] as const).map((key) => (
          <div key={key} className="flex gap-3 mb-4 last:mb-0">
            <div className={`${sbarColors[key]} text-white w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5`}>
              {key}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">{sbarLabels[key]}</p>
              <p className="text-slate-700 text-sm leading-relaxed">{sbar[key]}</p>
            </div>
          </div>
        ))}
      </div>

      {missingItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-semibold text-amber-800 mb-2 text-sm">추가 확인 필요 항목</h3>
          <ul className="space-y-1">
            {missingItems.map((item, index) => (
              <li key={index} className="text-amber-700 text-sm flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {checklist.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-700 mb-3 text-sm">즉시 확인 체크리스트</h3>
          <ul className="space-y-2">
            {checklist.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-blue-500 font-bold mt-0.5">☐</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
