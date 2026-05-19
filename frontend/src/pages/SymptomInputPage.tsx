import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAnalysisStore } from '../store/analysisStore'
import { symptomCategories } from '../data/symptoms'

export default function SymptomInputPage() {
  const navigate = useNavigate()
  const { selectedPatient, selectedSymptoms, toggleSymptom } = useAnalysisStore()

  if (!selectedPatient) {
    navigate('/patients')
    return null
  }

  return (
    <Layout title="증상 입력" showBack>
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {selectedPatient.name[0]}
            </div>
            <div>
              <p className="font-bold text-slate-800">{selectedPatient.name} <span className="font-normal text-slate-500">{selectedPatient.age}세 · {selectedPatient.ward} {selectedPatient.room}</span></p>
              <p className="text-slate-500 text-xs">{selectedPatient.conditions.join(' · ')}</p>
            </div>
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800">증상을 선택하세요</h2>
        <p className="text-slate-500 text-sm mt-1">해당하는 증상을 모두 선택해 주세요 ({selectedSymptoms.length}개 선택됨)</p>
      </div>

      <div className="space-y-4">
        {symptomCategories.map((cat) => (
          <div key={cat.category} className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-700 mb-3 text-sm">{cat.category}</h3>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((symptom) => {
                const selected = selectedSymptoms.includes(symptom)
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                      selected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {symptom}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 mt-6">
        <button
          onClick={() => navigate('/vitals')}
          disabled={selectedSymptoms.length === 0}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-base transition-colors shadow-lg"
        >
          다음: 활력징후 입력 ({selectedSymptoms.length}개 선택)
        </button>
      </div>
    </Layout>
  )
}
