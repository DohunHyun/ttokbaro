<h1 align="center">똑바로해라 (ttokbaro)</h1>
<p align="center">팩트체크 + 편향 검증 커뮤니티</p>

<p align="center">
  <b>아이디어 → 기획 → 개발 → 블로그 기록까지 전부 AI와 함께</b><br/>
  만들어가는 실험 프로젝트
</p>

<hr/>

## 📌 프로젝트 목표
- 기사, 발언, 게시글을 <b>Claim 카드</b>로 등록  
- 각 Claim에 대해 <b>진위 여부 / 편향 정도 / 근거</b>를 확인  
- 커뮤니티가 함께 검증하고 토론  
- 정치·사회 이슈에서 갈라치기와 선동을 줄이고, 시민의 판단력을 높이는 게 목적

<hr/>

## 🚀 기술 스택

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?logo=spring&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white" />
  <img src="https://img.shields.io/badge/Warp-01A4FF?logo=warp&logoColor=white" />
  <img src="https://img.shields.io/badge/VS%20Code-007ACC?logo=visualstudiocode&logoColor=white" />
</p>

- <b>Frontend</b>: Next.js (TypeScript, Tailwind CSS, React Query)  
- <b>Backend</b>: Spring Boot (Java 21, JPA, PostgreSQL)  
- <b>Infra</b>: pnpm workspace (모노레포), Vercel(예정), Render/AWS(예정)  
- <b>Tools</b>: Warp, Codex CLI, VS Code  
- <b>AI 활용</b>: Codex CLI(코드 생성/수정/실행), ChatGPT(설계/문서화/블로그)

<hr/>

## 📂 모노레포 구조
<pre><code>ttokbaro/
 ├─ web/        # Next.js 프론트엔드
 ├─ api/        # Spring Boot 백엔드
 ├─ packages/   # 공용 타입/유틸
 ├─ pnpm-workspace.yaml
 └─ README.md
</code></pre>

<hr/>

## 🛠 실행 방법

### 1) Backend (Spring Boot)
<pre><code>cd api
./gradlew clean test
./gradlew bootRun   # → http://localhost:8080
</code></pre>

✅ 동작 확인
<pre><code>curl -s "http://localhost:8080/claims?limit=5"
</code></pre>

<hr/>

### 2) Frontend
<pre><code>cd web
pnpm install
pnpm dev   # → http://localhost:3000
</code></pre>

✅ 환경변수 설정 (web/.env.local)
<pre><code>NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
</code></pre>

✅ 제출 화면
- http://localhost:3000/submit

<hr/>

### 3) Quick Test (E2E)
<pre><code># Claim 생성
curl -X POST http://localhost:8080/claims \
  -H "Content-Type: application/json" \
  -d '{"sourceUrl":"https://example.com/abc","text":"웹에서 첫 제출 테스트"}'

# 최신 Claim 조회
curl -s "http://localhost:8080/claims?limit=5"
</code></pre>

## 🔌 API (현재 구현)
- `POST /claims` : Claim 생성 (sourceUrl/text 중 하나 필수)
- `GET /claims?limit=N` : 최신 Claim N개 조회

### data.go.kr 로컬 프로브 노트
- NEC 공통 선거코드 조회 기준, 현재 최신 선거일 코드는 `sgId=20260603` 확인.
- 로컬 프로필에서 후보 조회 테스트:
<pre><code>curl "http://localhost:8080/admin/datago/candidates/seoul?sgTypecode=3"
</code></pre>

<hr/>

## 📝 개발 로그
- Day0: 프로젝트 시작, 환경 세팅 & 로컬 구동 — https://hundoblog.tistory.com/35
- Day1: Claim API + Submit/Feed UI + 상세 페이지 — (https://hundoblog.tistory.com/36
- Day2: Evidence(근거) 추가/조회 + 삭제 기능 — https://hundoblog.tistory.com/37

<hr/>

## 📌 향후 계획
- 후보 정보 DB화 & 검색
- 포인트/평판 시스템
- 모바일 앱 (React Native)
- MSA 구조 실험
