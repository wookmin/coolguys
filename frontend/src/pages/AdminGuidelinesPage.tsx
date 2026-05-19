import { useState } from 'react'
import Layout from '../components/Layout'

interface Guideline {
  id: string
  title: string
  category: string
  content: string
  updatedAt: string
}

const initialGuidelines: Guideline[] = [
  {
    id: 'g001',
    title: '응급 상황 대응 절차',
    category: '응급',
    content: '1. 즉시 119 신고\n2. 담당의 연락\n3. 응급 카트 준비\n4. 활력징후 지속 모니터링\n5. 보호자 연락',
    updatedAt: '2026-05-01',
  },
  {
    id: 'g002',
    title: '낙상 사고 처리 지침',
    category: '안전',
    content: '1. 환자 상태 즉시 확인\n2. 의식, 활력징후 측정\n3. 골절 의심 시 이동 금지\n4. 담당의 즉시 보고\n5. 사고 일지 작성',
    updatedAt: '2026-04-15',
  },
  {
    id: 'g003',
    title: '감염 예방 지침',
    category: '감염관리',
    content: '1. 손 위생 철저 (5 Moments)\n2. PPE 착용 기준 준수\n3. 격리 환자 접촉 시 Level 2 이상 PPE\n4. 의심 증상 즉시 보고',
    updatedAt: '2026-03-20',
  },
  {
    id: 'g004',
    title: '욕창 예방 및 관리',
    category: '간호',
    content: '1. 2시간마다 체위 변경\n2. Braden Scale 주 1회 평가\n3. 욕창 발생 시 즉시 담당의 보고\n4. 영양 상태 평가 병행',
    updatedAt: '2026-05-10',
  },
  {
    id: 'g005',
    title: '투약 오류 예방 지침',
    category: '투약',
    content: '1. 5 Rights 확인 (환자, 약, 용량, 경로, 시간)\n2. 알레르기 확인 필수\n3. 투약 전후 활력징후 확인\n4. 오류 발생 시 즉시 보고',
    updatedAt: '2026-04-28',
  },
]

const categoryColors: Record<string, string> = {
  응급: 'bg-red-100 text-red-700',
  안전: 'bg-orange-100 text-orange-700',
  감염관리: 'bg-purple-100 text-purple-700',
  간호: 'bg-blue-100 text-blue-700',
  투약: 'bg-green-100 text-green-700',
}

export default function AdminGuidelinesPage() {
  const [guidelines, setGuidelines] = useState(initialGuidelines)
  const [selected, setSelected] = useState<Guideline | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', category: '', content: '' })

  const handleEdit = (g: Guideline) => {
    setSelected(g)
    setEditForm({ title: g.title, category: g.category, content: g.content })
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!selected) return
    setGuidelines((prev) =>
      prev.map((g) =>
        g.id === selected.id ? { ...g, ...editForm, updatedAt: new Date().toISOString().slice(0, 10) } : g
      )
    )
    setIsEditing(false)
    setSelected(null)
  }

  return (
    <Layout title="내부 지침 관리">
      {isEditing && selected ? (
        <div>
          <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-800 mb-4">
            ← 목록으로
          </button>
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">지침 수정</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">제목</label>
              <input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">분류</label>
              <input
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">내용</label>
              <textarea
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                rows={8}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>
            <button onClick={handleSave} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
              저장
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">내부 지침 관리</h2>
            <span className="text-slate-400 text-sm">{guidelines.length}개 지침</span>
          </div>
          <div className="space-y-3">
            {guidelines.map((g) => (
              <div key={g.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${categoryColors[g.category] || 'bg-slate-100 text-slate-600'}`}>
                      {g.category}
                    </span>
                    <h3 className="font-bold text-slate-800">{g.title}</h3>
                  </div>
                  <button
                    onClick={() => handleEdit(g)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors flex-shrink-0"
                  >
                    수정
                  </button>
                </div>
                <pre className="text-slate-600 text-sm mt-3 whitespace-pre-wrap font-sans leading-relaxed">{g.content}</pre>
                <p className="text-slate-400 text-xs mt-3">최종 수정: {g.updatedAt}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}
