export interface SymptomCategory {
  category: string
  items: string[]
}

export const symptomCategories: SymptomCategory[] = [
  {
    category: '신경계',
    items: ['의식 저하', '혼돈/섬망', '두통', '어지러움', '경련', '편마비', '언어 장애'],
  },
  {
    category: '호흡기',
    items: ['호흡 곤란', '빠른 호흡', '기침', '객혈', '청색증', '흉통'],
  },
  {
    category: '순환기',
    items: ['가슴 두근거림', '부정맥', '흉부 압박감', '사지 부종', '저혈압 증상'],
  },
  {
    category: '소화기',
    items: ['구역/구토', '복통', '설사', '혈변', '식욕 부진', '연하 곤란'],
  },
  {
    category: '비뇨기',
    items: ['배뇨 곤란', '혈뇨', '소변량 감소', '실금'],
  },
  {
    category: '전신',
    items: ['고열(38.5℃ 이상)', '저체온', '오한', '전신 쇠약', '낙상', '출혈'],
  },
  {
    category: '피부',
    items: ['욕창 악화', '피부 발적/부종', '상처 감염 의심', '황달'],
  },
  {
    category: '통증',
    items: ['극심한 통증', '흉통', '복부 통증', '두통 (갑작스러운)'],
  },
]
