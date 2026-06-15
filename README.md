# Ploy

> 명함, 발표자료, 웹사이트 제작을 위한 **Done-for-you 크리에이티브 서비스 플랫폼**  
> Built with **Spring Boot + React + TypeScript**

---

## 프로젝트 소개

Ploy는 소상공인, 프리랜서, 개인 사업자를 대상으로  
디자인 제작 요청부터 결과물 전달까지 관리할 수 있는 플랫폼입니다.

제작 가능한 서비스 예시:

- Business Card (명함)
- Presentation (발표자료)
- Website / Landing Page (웹사이트)

기존 SaaS처럼 사용자가 직접 디자인하는 방식이 아니라,  
**클라이언트 요청 → 작업 진행 → 결과물 전달** 흐름에 집중한 서비스입니다.

### 주요 흐름

1. 클라이언트가 디자인 요청서(Brief) 작성
2. 관리자가 요청 확인 및 작업 진행
3. 클라이언트는 Magic Link로 진행 상황 확인
4. 완성된 결과물 다운로드

이 프로젝트는 단순 CRUD 구현이 아닌, 실제 서비스 수준의 아래 요소를 고려하여 설계했습니다.

- 보안 (Security)
- 파일 업로드 / 다운로드
- 상태 관리 (State Management)
- 이메일 알림
- Rate Limiting
- 성능 최적화

---

## 기술 스택

### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL
- H2 (Test)
- Bucket4j
- Spring Mail

### Frontend
- React
- TypeScript
- Vite
- React Router
- Axios

### Dev Tools
- Gradle
- Git / GitHub
- IntelliJ IDEA

---

## 프로젝트 구조

```text
ploy/
├── backend/
│   ├── src/main/java/com/prod/ploy
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   └── src/main/resources/
│
└── frontend/
    └── src/
        └── pages/
```

레이어드 아키텍처 기반으로 구성했으며,  
역할별 책임 분리를 통해 유지보수성과 확장성을 고려했습니다.

---

# 주요 기능

## 1. 클라이언트 요청 접수

API:

```http
POST /api/projects
```

클라이언트 입력 정보:

- 이름
- 이메일
- 프로젝트 종류
- 요구사항 / 비전
- 선호 색상
- 참고 스타일

특징:

- Client / Project / Brief를 하나의 트랜잭션으로 저장
- 요청 성공 시 Magic Link 생성
- 이메일 발송 실패 여부와 관계없이 요청 저장
- IP당 시간당 5회 요청 제한

---

## 2. Magic Link 기반 진행 상황 조회

API:

```http
GET /api/projects/track/{token}
```

회원가입 없이 토큰 기반 링크만으로 조회 가능합니다.

조회 가능 정보:

- 현재 진행 상태
- 관리자 메모
- 최신 결과물 다운로드

상태 흐름:

```text
BRIEF_SUBMITTED
→ IN_PROGRESS
→ REVIEW
→ DELIVERED
```

---

## 3. 관리자(Admin) 대시보드

관리자 API:

```http
GET   /api/admin/projects
PATCH /api/admin/projects/{id}/status
POST  /api/admin/projects/{id}/deliverables
```

기능:

- 전체 프로젝트 조회
- 상태 변경
- 결과물 업로드
- 메모 작성
- 버전 관리

업로드 지원 형식:

- PDF
- PNG
- JPG
- ZIP

최대 파일 크기:

```text
20MB
```

---

## 4. 안전한 파일 다운로드

API:

```http
GET /api/files/{token}/{deliverableId}
```

보안 정책:

- Token이 해당 Project 소유인지 검증
- Deliverable이 해당 Project 소속인지 검증
- 실제 저장 경로(fileUrl)는 외부에 노출하지 않음
- 잘못된 접근 시 403
- 파일 없음 404

직접 URL 공유로 인한 파일 유출을 방지하도록 설계했습니다.

---

# 보안 설계

## 관리자 인증

관리자 영역:

```text
/api/admin/**
```

Spring Security 기반 HTTP Basic 인증 적용

선택 이유:

- MVP 단계에서 빠른 구현 가능
- Stateless REST 구조와 적합
- React와 연동이 간단

향후 개선 예정:

- JWT 인증
- Refresh Token
- Role 기반 권한 관리

---

## CORS 처리

Spring Security 환경에서 단순 `@CrossOrigin`만으로는  
Preflight OPTIONS 요청이 차단될 수 있습니다.

따라서 다음 방식 사용:

```java
CorsConfigurationSource
```

개발 환경 허용 Origin:

```text
http://localhost:5173
```

---

## Rate Limiting

Bucket4j 사용

정책:

```text
IP당 1시간 5회 요청 제한
```

방지 목적:

- 스팸 요청
- SMTP 악용
- DB 과부하

---

# 데이터 모델

## Client
클라이언트 정보

- id
- name
- email

---

## Project
핵심 엔티티

- id
- type
- status
- magicToken
- note

관계:

```text
Client 1 : N Project
Project 1 : 1 Brief
Project 1 : N Deliverable
```

---

## Brief
클라이언트 요구사항

- vision
- colorPreferences
- styleReferences

---

## Deliverable
결과물 파일

- version
- fileUrl (internal only)
- note
- uploadedAt

---

# 성능 고려 사항

관리자 프로젝트 목록 조회 시 N+1 문제 방지를 위해:

```java
@EntityGraph
```

적용

개선 전:
- Project 조회 1회
- Client 조회 N회
- Deliverable 조회 N회

개선 후:
- 단일 Fetch Query

---

# 로컬 실행 방법

## Backend

환경 변수 설정:

```bash
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
export DB_NAME=ploy

export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=secret

export RESEND_API_KEY=re_xxx
export ADMIN_EMAIL=admin@example.com
```

실행:

```bash
cd backend
./gradlew bootRun
```

---

## Frontend

설치:

```bash
cd frontend
npm install
```

실행:

```bash
npm run dev
```

접속:

```text
http://localhost:5173
```

---

# 페이지 구성

| Route | 설명 |
|---|---|
| / | 포트폴리오 페이지 |
| /start | 요청 접수 |
| /track/:token | 진행 상황 조회 |
| /admin | 관리자 페이지 |

---

# 테스트

Backend 테스트 환경:

- H2 In-memory DB
- Mail Mock 설정

실행:

```bash
cd backend
./gradlew test
```

---

# 향후 개선 사항

- Cloudflare R2 / S3 파일 저장소
- JWT 인증
- Magic Token 만료 처리
- Revision History
- 이메일 템플릿 고도화
- CI/CD 구축

---

# 프로젝트를 만든 이유

Ploy는 단순 CRUD 프로젝트를 넘어,  
실제 서비스 운영을 고려한 풀스택 시스템을 설계하고 싶어서 만들었습니다.

특히 아래 문제들을 직접 고민하고 해결했습니다.

- 파일 접근 제어
- Spring Security + CORS
- N+1 Query 문제
- 이메일 실패 복구
- Rate Limiting 기반 악용 방지

이 프로젝트를 통해  
**비즈니스 흐름을 이해하고, 이를 안정적인 시스템으로 설계하는 능력**을 보여주고자 했습니다.

---

# Author

**신기환**  
Java Backend Developer

GitHub: https://github.com/Shin-Gi-Hwan
