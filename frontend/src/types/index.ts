export type UserRole = 'nurse' | 'admin'

export interface User {
  id: string
  name: string
  role: UserRole
  ward: string
}

export interface Patient {
  id: string
  name: string
  age: number
  ward: string
  room: string
  conditions: string[]
  allergies: string[]
}

export type RiskLevel = 'normal' | 'caution' | 'warning' | 'emergency'

export interface VitalSigns {
  temperature: string
  systolicBP: string
  diastolicBP: string
  pulse: string
  oxygenSaturation: string
}

export interface SbarReport {
  S: string
  B: string
  A: string
  R: string
}

export interface AnalysisResult {
  riskLevel: RiskLevel
  sbar: SbarReport
  missingItems: string[]
  checklist: string[]
}

export interface HistoryRecord {
  id: string
  patientId: string
  patientName: string
  ward: string
  room: string
  reportedBy: string
  reportedAt: string
  symptoms: string[]
  vitalSigns: VitalSigns
  riskLevel: RiskLevel
  sbar: SbarReport
}
