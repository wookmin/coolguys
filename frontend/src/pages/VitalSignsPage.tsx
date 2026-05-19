import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAnalysisStore } from '../store/analysisStore'
import { useAuthStore } from '../store/authStore'
import { useHistoryStore } from '../store/historyStore'
import type { VitalSigns } from '../types'
import axios from 'axios'

export default function VitalSignsPage() {
  const navigate = useNavigate()
  const { selectedPatient, selectedSymptoms, vitalSigns, setVitalSigns, setResult, setLoading } = useAnalysisStore()
  const user = useAuthStore((s) => s.user)
  const addRecord = useHistoryStore((s) => s.addRecord)

  if (!selectedPatient) {
    navigate('/patients')
    return null
  }

  const handleChange = (field: keyof VitalSigns, value: string) => {
    setVitalSigns({ ...vitalSigns, [field]: value })
  }

  const isValid = vitalSigns.temperature && vitalSigns.systolicBP && vitalSigns.pulse && vitalSigns.oxygenSaturation

  const handleAnalyze = async () => {
    setLoading(true)
    navigate('/result')
    try {
      const res = await axios.post('/api/analyze', {
        patient: selectedPatient,
        symptoms: selectedSymptoms,
        vitalSigns,
      })
      setResult(res.data)
      addRecord({
        id: `h${Date.now()}`,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        ward: selectedPatient.ward,
        room: selectedPatient.room,
        reportedBy: user?.name ?? '미상',
        reportedAt: new Date().toISOString(),
        symptoms: selectedSymptoms,
        vitalSigns,
        riskLevel: res.data.riskLevel,
        sbar: res.data.sbar,
      })
    } catch {
      setResult({
        riskLevel: 'caution',
        sbar: {
          S: '분석 중 오류가 발생했습니다.',
          B: '환자 기저질환 정보를 확인하세요.',
          A: 'AI 분석을 재시도해 주세요.',
          R: '담당의에게 직접 보고해 주세요.',
        },
        missingItems: [],
        checklist: [],
      })
    } finally {
      setLoading(false)
    }
  }

  const fields: { key: keyof VitalSigns; label: string; unit: string; placeholder: string; normal: string }[] = [
    { key: 'temperature', label: '체온', unit: '℃', placeholder: '36.5', normal: '정상: 36.0~37.4℃' },
    { key: 'systolicBP', label: '수축기 혈압', unit: 'mmHg', placeholder: '120', normal: '정상: 90~130mmHg' },
    { key: 'diastolicBP', label: '이완기 혈압', unit: 'mmHg', placeholder: '80', normal: '정상: 60~85mmHg' },
    { key: 'pulse', label: '맥박', unit: '회/분', placeholder: '80', normal: '정상: 60~100회/분' },
    { key: 'oxygenSaturation', label: '산소포화도', unit: '%', placeholder: '98', normal: '정상: 95% 이상' },
  ]

  return (
    <Layout title="활력징후 입력" showBack>
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{selectedPatient.name}</span>
            <span className="text-slate-500 text-sm">선택된 증상: {selectedSymptoms.length}개</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedSymptoms.map((s) => (
              <span key={s} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800">활력징후를 입력하세요</h2>
        <p className="text-slate-500 text-sm mt-1">정확한 측정값을 입력해 주세요</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        {fields.map(({ key, label, unit, placeholder, normal }) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {label} <span className="text-slate-400 font-normal">({unit})</span>
              {key === 'diastolicBP' ? null : <span className="text-red-400 ml-1">*</span>}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={vitalSigns[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <span className="text-slate-500 text-sm w-14 text-right">{unit}</span>
            </div>
            <p className="text-slate-400 text-xs mt-1">{normal}</p>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 mt-6">
        <button
          onClick={handleAnalyze}
          disabled={!isValid}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-base transition-colors shadow-lg"
        >
          AI 분석 시작
        </button>
      </div>
    </Layout>
  )
}
