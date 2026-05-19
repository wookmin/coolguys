import { create } from 'zustand'
import type { Patient, VitalSigns, AnalysisResult } from '../types'

interface AnalysisState {
  selectedPatient: Patient | null
  selectedSymptoms: string[]
  vitalSigns: VitalSigns
  result: AnalysisResult | null
  isLoading: boolean

  setPatient: (patient: Patient) => void
  toggleSymptom: (symptom: string) => void
  setVitalSigns: (vs: VitalSigns) => void
  setResult: (result: AnalysisResult) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

const defaultVitalSigns: VitalSigns = {
  temperature: '',
  systolicBP: '',
  diastolicBP: '',
  pulse: '',
  oxygenSaturation: '',
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  selectedPatient: null,
  selectedSymptoms: [],
  vitalSigns: defaultVitalSigns,
  result: null,
  isLoading: false,

  setPatient: (patient) => set({ selectedPatient: patient, selectedSymptoms: [], vitalSigns: defaultVitalSigns, result: null }),
  toggleSymptom: (symptom) =>
    set((state) => ({
      selectedSymptoms: state.selectedSymptoms.includes(symptom)
        ? state.selectedSymptoms.filter((s) => s !== symptom)
        : [...state.selectedSymptoms, symptom],
    })),
  setVitalSigns: (vs) => set({ vitalSigns: vs }),
  setResult: (result) => set({ result }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ selectedPatient: null, selectedSymptoms: [], vitalSigns: defaultVitalSigns, result: null }),
}))
