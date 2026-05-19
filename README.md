# 요양병원 AI 환자 증상 초기대응 서비스

Vite + React + Gemini API 프로토타입

## 실행 방법

### 1. 백엔드 설정
```bash
cd backend
cp .env.example .env
# .env에 GEMINI_API_KEY 입력
npm run dev
```

### 2. 프론트엔드 실행
```bash
cd frontend
npm run dev
```

프론트엔드: http://localhost:5173  
백엔드: http://localhost:3001

## 계정

| 이름 | 역할 | 병동 |
|------|------|------|
| 이간호 | 간호사 | A동 |
| 박요양 | 요양보호사 | B동 |
| 김간호 | 간호사 | C동 |
| 최관리 | 관리자 | 전체 |
