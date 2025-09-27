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

### Frontend
<pre><code>cd web
pnpm install
pnpm dev   # → http://localhost:3000
</code></pre>

### Backend (Spring Boot)
<pre><code>cd api
./gradlew bootRun   # → http://localhost:8080
</code></pre>

<hr/>

## 📝 개발 로그
- 0화: 프로젝트 시작, 환경 세팅 & 첫 페이지 — (티스토리 링크 삽입)  
- 1화: (예정) Claim API & 프론트 연동  
- 2화: (예정) 피드 페이지 & 리스트 출력

<hr/>

## 📌 향후 계획
- 후보 정보 DB화 & 검색
- 포인트/평판 시스템
- 모바일 앱 (React Native)
- MSA 구조 실험
