# Ploy

> 명함, 발표자료, 웹사이트 제작을 위한 **Done-for-you 크리에이티브 서비스 플랫폼**  
> Built with **Spring Boot + React + TypeScript**

---

## 프로젝트 소개

Ploy는 소상공인, 프리랜서, 개인 사업자를 대상으로  
디자인 제작 요청부터 결과물 전달까지 관리할 수 있는 플랫폼입니다.

제작 가능한 서비스:

- Business Card (명함)
- Presentation (발표자료 / PPT)
- E-book 디자인
- Logo 디자인
- Website / Landing Page (웹사이트)

**클라이언트 요청 → 작업 진행 → 결과물 전달** 흐름에 집중한 서비스입니다.

### 주요 흐름

1. 클라이언트가 디자인 요청서(Brief) 작성
2. 관리자가 요청 확인 및 작업 진행
3. 클라이언트는 Magic Link로 진행 상황 확인
4. 완성된 결과물 다운로드

---

## 기술 스택

### Backend
- Java 17 · Spring Boot 4.1
- Spring Security + JWT
- Spring Data JPA + Hibernate
- MySQL 8.4 (prod) · H2 (test)
- Bucket4j (Rate Limiting)
- Spring Mail + Resend SMTP

### Frontend
- React 19 · TypeScript · Vite
- TailwindCSS v4 · Framer Motion
- React Router · Axios · react-i18next (한국어/영어)

### Infrastructure
- Docker + Docker Compose
- Nginx (reverse proxy + SPA)
- Linux VPS (Ubuntu)

---

## 프로젝트 구조

```text
ploy/
├── backend/
│   └── src/main/
│       ├── java/com/prod/ploy/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── model/
│       │   ├── repository/
│       │   └── service/
│       └── resources/
│           ├── application.yaml        ← 공통 설정
│           ├── application-dev.yaml    ← 개발 환경
│           └── application-prod.yaml   ← 운영 환경
│
├── frontend/
│   └── src/
│
├── .run/
│   ├── Ploy Backend (dev).run.xml      ← IntelliJ 개발 실행 구성
│   └── Ploy Backend (prod).run.xml     ← IntelliJ 운영 실행 구성
│
├── .env.example                        ← 환경변수 템플릿 (git 추적)
├── .env.dev                            ← 개발 환경변수 (git 제외)
├── .env.prod                           ← 운영 환경변수 (git 제외, 서버에만 존재)
│
├── docker-compose.dev.yml              ← 개발용 Docker Compose
├── docker-compose.prod.yml             ← 운영용 Docker Compose
│
└── deploy.sh                           ← VPS 배포 스크립트
```

---

## 환경 분리 구조

| 항목 | 개발 (dev) | 운영 (prod) |
|------|-----------|------------|
| Spring Profile | `dev` | `prod` |
| DB ddl-auto | `update` | `validate` |
| SQL 로그 | `true` | `false` |
| DB 포트 노출 | 3306 (외부 접근 가능) | 내부만 |
| 백엔드 포트 노출 | 8080 (외부 접근 가능) | nginx 경유만 |
| 프론트엔드 포트 | 3000 | 80 (443 예정) |
| HikariCP | 기본값 | pool-size=10, idle/max tuning |
| 로그 레벨 | DEBUG | INFO (ploy), WARN (root) |

---

## 로컬 개발 (Docker)

### 1. 환경변수 파일 생성

```bash
cp .env.example .env.dev
# .env.dev 에서 필요한 값 수정 (DB 비밀번호, API 키 등)
```

### 2. 개발 스택 실행

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml up -d
```

- MySQL: `localhost:3306` (DBeaver / TablePlus 로 접속 가능)
- Backend API: `http://localhost:8080`
- Frontend: `http://localhost:3000`

### 3. 프론트엔드 핫리로드 (권장)

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

### 4. 스택 종료

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml down
```

---

## 로컬 개발 (IntelliJ 네이티브)

`.run/` 폴더의 Run Configuration이 IntelliJ에 자동 인식됩니다.

1. **Ploy Backend (dev)** — 개발 프로필, `localhost` MySQL 연결
2. **Ploy Backend (prod)** — 운영 프로필 (실제 운영 DB 연결 전 값 변경 필수)

Run Configuration 선택 후 `▶ Run` 또는 `⇧F10`으로 실행합니다.

MySQL이 로컬에 없는 경우 아래 명령으로 MySQL만 단독 실행:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml up -d mysql
```

---

## 운영 배포 (VPS)

### 최초 서버 설정 (1회만)

```bash
# 서버에서 실행
apt update && apt install -y docker.io git
systemctl enable --now docker
```

### .env.prod 파일 서버에 복사

```bash
# .env.prod 를 먼저 로컬에서 채운 후
scp .env.prod user@server:/opt/ploy/.env.prod
ssh user@server chmod 600 /opt/ploy/.env.prod
```

### 배포

```bash
./deploy.sh user@server-ip
```

### 수동 배포 (스크립트 없이)

```bash
# 서버에서 실행
cd /opt/ploy
git pull
docker compose --env-file .env.prod -f docker-compose.prod.yml up --build -d
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
```

### 로그 확인

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f backend
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f mysql
```

---

## Spring 프로필 수동 전환

```bash
# 환경변수로 (Docker / Linux)
SPRING_PROFILES_ACTIVE=prod java -jar app.jar

# VM 옵션으로 (IntelliJ / jar 직접 실행)
java -Dspring.profiles.active=prod -jar app.jar
```

---

## 보안 설계

### JWT 인증
- `CLIENT` / `FREELANCER` 역할은 JWT Bearer 토큰으로 인증
- 토큰 만료: 7일 (`.env`의 `JWT_EXPIRY_MS`로 조정 가능)

### 관리자 인증
- `/api/admin/**` 경로는 Spring Security HTTP Basic 인증
- ADMIN_USERNAME / ADMIN_PASSWORD 환경변수로 설정

### CORS
- 개발: `http://localhost:5173` 허용
- 운영: `FRONTEND_URL` 환경변수 값만 허용

### Rate Limiting (Bucket4j)
- IP당 1시간 5회 요청 제한 (서비스 신청 API)

### 파일 다운로드 보안
- Magic Token + Deliverable ID 이중 검증
- 실제 파일 경로 외부 비노출 (`/api/files/{token}/{id}`)

---

## 데이터 모델

```
Client  1 ──── N  Project
               │
        1 ──── 1  Brief
               │
        1 ──── N  Deliverable
```

| 엔티티 | 주요 필드 |
|--------|---------|
| Client | id, name, email |
| Project | id, type, status, magicToken, note |
| Brief | vision, colorPreferences, styleReferences |
| Deliverable | version, fileUrl (internal), note, uploadedAt |

---

## API 엔드포인트

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| POST | `/api/auth/register` | 회원가입 | 없음 |
| POST | `/api/auth/login` | 로그인 (JWT 발급) | 없음 |
| POST | `/api/projects` | 서비스 신청 | JWT |
| GET | `/api/projects/track/{token}` | 진행 상황 조회 | 없음 (Magic Link) |
| GET | `/api/client/projects` | 내 프로젝트 목록 | JWT (CLIENT) |
| GET | `/api/admin/projects` | 전체 프로젝트 조회 | Basic Auth |
| PATCH | `/api/admin/projects/{id}/status` | 상태 변경 | Basic Auth |
| POST | `/api/admin/projects/{id}/deliverables` | 결과물 업로드 | Basic Auth |
| GET | `/api/files/{token}/{deliverableId}` | 결과물 다운로드 | Magic Token |

---

## 페이지 구성

| Route | 설명 |
|-------|------|
| `/` | 랜딩 페이지 |
| `/login` | 로그인 |
| `/register` | 회원가입 |
| `/client` | 클라이언트 대시보드 |
| `/client/request` | 서비스 신청 |
| `/client/projects` | 프로젝트 목록 |
| `/freelancer` | 프리랜서 대시보드 |
| `/admin` | 관리자 대시보드 |
| `/track/:token` | 진행 상황 조회 (Magic Link) |

---

## 향후 개선 사항

- [ ] Cloudflare R2 / MinIO 파일 저장소 (로컬 파일시스템 대체)
- [ ] Magic Token 만료 처리
- [ ] 이메일 알림 (신청 접수, 상태 변경)
- [ ] Nginx SSL/TLS (Let's Encrypt + Certbot)
- [ ] Redis (세션 캐시 / Rate Limiting)
- [ ] RabbitMQ (이메일 큐)
- [ ] 프리랜서 프로젝트 관리 UI
- [ ] CI/CD (GitHub Actions)

---

## 개발자 정보

**신기환**  
Java Backend Developer  
GitHub: https://github.com/Shin-Gi-Hwan
