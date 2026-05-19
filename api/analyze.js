import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'

const HOSPITAL_GUIDELINES = `
[병원 내부 대응 지침]
1. 응급(EMERGENCY): 산소포화도 90% 미만, 수축기 혈압 90mmHg 미만 또는 180mmHg 초과, 의식 저하, 경련, 청색증 → 즉시 119 신고 + 담당의 연락
2. 경고(WARNING): 체온 38.5℃ 이상, 산소포화도 91~94%, 혈압 160/100 이상, 맥박 120 이상 또는 50 미만 → 담당의 즉시 보고
3. 주의(CAUTION): 체온 37.5~38.4℃, 산소포화도 95~96%, 혈압 145~160mmHg → 담당 간호사 보고 및 모니터링 강화
4. 일반(NORMAL): 위 기준에 해당하지 않는 경우 → 지속 관찰

SBAR 작성 원칙:
- S(Situation): 현재 환자 상태와 주요 증상을 1-2문장으로 명확히
- B(Background): 기저질환, 알레르기 등 관련 배경 정보
- A(Assessment): 활력징후 분석 및 임상적 판단
- R(Recommendation): 구체적인 조치 사항 (검사, 처치, 보고 대상 등)
`

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    riskLevel: {
      type: SchemaType.STRING,
      enum: ['normal', 'caution', 'warning', 'emergency'],
      description: '위험도 분류',
    },
    sbar: {
      type: SchemaType.OBJECT,
      properties: {
        S: { type: SchemaType.STRING, description: 'Situation: 현재 상황' },
        B: { type: SchemaType.STRING, description: 'Background: 배경 정보' },
        A: { type: SchemaType.STRING, description: 'Assessment: 임상적 평가' },
        R: { type: SchemaType.STRING, description: 'Recommendation: 권고 조치' },
      },
      required: ['S', 'B', 'A', 'R'],
    },
    missingItems: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: '추가로 확인이 필요한 누락 정보 목록',
    },
    checklist: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: '즉시 수행해야 할 체크리스트 항목',
    },
  },
  required: ['riskLevel', 'sbar', 'missingItems', 'checklist'],
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST만 허용됩니다.' } })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: { code: 'MISSING_API_KEY', message: 'GEMINI_API_KEY가 설정되지 않았습니다.' } })
  }

  const { patient, symptoms, vitalSigns } = req.body

  if (!patient || !symptoms || !vitalSigns) {
    return res.status(400).json({ error: { code: 'MISSING_FIELDS', message: '필수 필드가 누락되었습니다.' } })
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: `당신은 요양병원 임상 보조 AI입니다. 간호사/요양보호사가 입력한 환자 정보, 증상, 활력징후를 분석하여 위험도를 분류하고 SBAR 보고문을 생성합니다.\n\n${HOSPITAL_GUIDELINES}\n\n반드시 JSON 스키마에 맞게 응답하세요. 한국어로 작성하세요.`,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema,
    },
  })

  const prompt = `
환자 정보:
- 이름: ${patient.name} (${patient.age}세)
- 병실: ${patient.ward} ${patient.room}
- 기저질환: ${patient.conditions.join(', ')}
- 알레르기: ${patient.allergies.length > 0 ? patient.allergies.join(', ') : '없음'}

보고된 증상: ${symptoms.join(', ')}

활력징후:
- 체온: ${vitalSigns.temperature}℃
- 혈압: ${vitalSigns.systolicBP}/${vitalSigns.diastolicBP} mmHg
- 맥박: ${vitalSigns.pulse}회/분
- 산소포화도: ${vitalSigns.oxygenSaturation}%

위 정보를 바탕으로 위험도를 분류하고 SBAR 보고문을 작성해 주세요.
`

  try {
    const result = await model.generateContent(prompt)
    const parsed = JSON.parse(result.response.text())
    res.json(parsed)
  } catch (err) {
    console.error('Gemini API error:', err)
    res.status(500).json({ error: { code: 'AI_ERROR', message: 'AI 분석 중 오류가 발생했습니다.' } })
  }
}
