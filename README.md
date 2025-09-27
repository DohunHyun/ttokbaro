앗 그건 내 잘못이야—아까는 README 전체를 코드블록으로 감싸서(…) 그 안에 또 코드블록이 들어가다 보니 중첩이 깨지며 “모노레포 구조”에서 잘렸어. 이번엔 중첩 없이 깔끔한 버전으로 준비했고, 아예 파일로도 만들어뒀어.

바로 내려받기: README.md 다운로드

아래는 같은 내용의 복사-붙여넣기 안전 버전(바깥에 코드블록 없음)이라 GitHub에 그대로 붙이면 정상 표시돼.

똑바로해라 (ttokbaro)

팩트체크 + 편향 검증 커뮤니티

아이디어 → 기획 → 개발 → 블로그 기록까지 전부 AI와 함께 만들어가는 실험 프로젝트

⸻

📌 프로젝트 목표
	•	기사, 발언, 게시글을 Claim 카드로 등록
	•	각 Claim에 대해 진위 여부 / 편향 정도 / 근거를 확인
	•	커뮤니티가 함께 검증하고 토론
	•	정치·사회 이슈에서 갈라치기와 선동을 줄이고, 시민의 판단력을 높이는 게 목적

⸻

🚀 기술 스택
	•	Frontend: Next.js (TypeScript, Tailwind CSS, React Query)
	•	Backend: Spring Boot (Java 21, JPA, PostgreSQL)
	•	Infra: pnpm workspace (모노레포), Vercel (예정), Render/AWS (예정)
	•	Tools: Warp, Codex CLI, VS Code
	•	AI 활용:
	•	Codex CLI로 코드 생성/수정/실행
	•	ChatGPT로 설계/문서화/블로그 기록

⸻

📂 모노레포 구조

ttokbaro/
 ├─ web/        # Next.js 프론트엔드
 ├─ api/        # Spring Boot 백엔드
 ├─ packages/   # 공용 타입/유틸
 ├─ pnpm-workspace.yaml
 └─ README.md


⸻

🛠 실행 방법

Frontend

cd web
pnpm install
pnpm dev
# → http://localhost:3000

Backend (Spring Boot)

cd api
./gradlew bootRun
# → http://localhost:8080


⸻

📝 개발 로그
	•	0화: 프로젝트 시작, 환경 세팅 & 첫 페이지
	•	1화: (예정) Claim API & 프론트 연동
	•	2화: (예정) 피드 페이지 & 리스트 출력

⸻

📌 향후 계획
	•	후보 정보 DB화 & 검색
	•	포인트/평판 시스템
	•	모바일 앱 (React Native)
	•	MSA 구조 실험

필요하면 README_EN.md(영문)도 바로 만들어줄게. 그리고 다음은 API(/claims) 만들고 /submit 연동 들어가자—준비됐지?