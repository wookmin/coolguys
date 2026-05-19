import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAnalysisStore } from '../store/analysisStore'
import { patients } from '../data/patients'
import type { Patient } from '../types'

export default function PatientSelectPage() {
  const navigate = useNavigate()
  const setPatient = useAnalysisStore((s) => s.setPatient)

  const handleSelect = (patient: Patient) => {
    setPatient(patient)
    navigate('/symptoms')
  }

  const wards = [...new Set(patients.map((p) => p.ward))].sort()

  return (
    <Layout title="환자 선택">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">환자를 선택하세요</h2>
        <p className="text-slate-500 text-sm mt-1">증상을 보고할 환자를 선택합니다</p>
      </div>

      {wards.map((ward) => (
        <div key={ward} className="mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">{ward}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {patients
              .filter((p) => p.ward === ward)
              .map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handleSelect(patient)}
                  className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:border-blue-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                      {patient.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{patient.name}</span>
                        <span className="text-slate-400 text-sm">{patient.age}세</span>
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5">{patient.room}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {patient.conditions.map((c) => (
                          <span key={c} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                            {c}
                          </span>
                        ))}
                      </div>
                      {patient.allergies.length > 0 && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <span className="text-red-500 text-xs font-medium">⚠ 알레르기:</span>
                          <span className="text-red-600 text-xs">{patient.allergies.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}
    </Layout>
  )
}
