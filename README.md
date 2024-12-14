## Project Title: 편의시설 안내 서비스

---

## Project Scope
서울시립대학교 컴퓨터과학부 2024년 소프트웨어공학 프로젝트로, Software Development Life-Cycle을 기반으로 객체지향 소프트웨어공학 방법론을 적용하여 **웹 기반 교내 편의시설 지도 정보 제공 플랫폼**을 개발한다.

---

## Project Duration
2024년 2학기

---

## Highlighted Features
- **지도 기반 시설 안내**:
  - OpenStreetMap API를 활용하여 교내 주요 건물 및 편의시설의 위치를 지도에 마커로 표시한다.
  - 운영 상태를 실시간으로 업데이트하여 사용자에게 제공한다.
- **카테고리 필터링**:
   - 시설을 (기본 편의 시설, 휴식 및 복지 편의 시설, 스포츠 편의 시설, 기타 편의 시설)분류하여 필터링 기능 제공한다.
- **게시판**:
  - 사용자 게시글 등록 및 관리자 댓글 기능 지원한다.
  - 사용자와 관리자가 소통하며 시설 정보 추가/수정 요청 가능하다.
- **관리자 기능**:
  - 관리자는 새로운 시설을 추가, 수정, 삭제 가능하다.
  - 게시판 댓글 작성 및 게시물 관리 기능 제공한다.
- **시설 상세 정보 팝업**:
  - 시설 아이콘 클릭 시 운영 시간, 설명 등을 팝업 형태로 제공한다

https://github.com/user-attachments/assets/5e0c130b-eb2f-4f2c-bbd9-92855ffce951




---

## Project Changes
- **삭제된 기능**: 운동 프로그램 안내, 실시간 QnA 채팅 기능, 일반 사용자의 로그인.
- **추가된 기능**: 게시판 기반 피드백, UI 최적화, MVP(Minimum Viable Product)에 집중한 간소화된 기능 제공한다.

---

## Project Constraints
1. **플랫폼 제약**:
   - 시간과 경험 부족으로 데스크톱 환경에서만 지원한다.

2. **기술적 제약**:
   - **Frontend와 Backend 연동**:
     - API 호출 및 데이터 처리가 예상보다 복잡해 많은 디버깅 필요하다.
   - **OpenStreetMap API**:
     - 지도 데이터를 커스터마이징하는 데 기술적 한계가 있어 기본 제공 기능에 의존한다.

3. **리소스 및 시간 제약**:
   - 학기 내 완성을 목표로 했기 때문에 일부 기능(모바일 지원, 일반 사용자의 로그인 기능, 채팅 기능, 운동 프로그램 안내 기능)은 제외된다.
   - 팀원들의 API 및 데이터베이스 관련 경험 부족으로 초기 학습 시간이 소요된다.

---

## High-Level Architecture
### Architecture Overview
이 프로젝트는 **MVC 아키텍처**와 **Layered Architecture**를 혼합하여 설계되었다.

#### 1. MVC Architecture
- **Model**:
  - MySQL 데이터베이스와 상호작용하며 시설 정보, 게시글, 댓글 데이터를 관리한다.
- **View**:
  - React 컴포넌트를 사용하여 사용자 인터페이스(UI)를 구현하고, API로부터 데이터를 가져와 시각화한다.
- **Controller**:
  - Node.js 기반의 Express.js로 구현하여 클라이언트 요청을 처리하고, 데이터를 JSON 형식으로 반환한다.

#### 2. Layered Architecture
- **Map Layer**:
  - OpenStreetMap 기반으로 지도를 표시하고 시설 아이콘과 상호작용한다.
- **Amenity Management Layer**:
  - 시설 정보를 데이터베이스에서 관리 및 수정한다.
- **User Interaction Layer**:
  - 사용자 및 관리자의 요청을 처리하고 인터페이스를 제공한다.
- **Forum Layer**:
  - 게시글과 댓글의 CRUD 작업을 지원한다.

**Archtecture diagram**

![architecture-diagram](https://github.com/user-attachments/assets/5b3e6a5a-f519-4d6c-90b7-e83066cf8129)


---

## Technology Stack
- **Frontend**: React (v19), Zustand (상태 관리), Mantine(스타일링)
- **Backend**: Node.js (v22.11), Express.js
- **Database**: MySQL (v8.0.40)
- **Authentication**: JWT (JSON Web Token)

---

## Installation Guide
1. **모든 코드를 다운로드한 상태에서 Terminal을 열고 interactive-map 디렉토리로 이동한다**
   ```bash
   cd interactive-map
2. **필요한 dependencies 설치한다**
  `npm install`
3. **개발 서버 시작한다**
  `npm run dev`
  - 터미널에서 `Local: http://localhost:5173/`과 같은 링크를 누르면 웹페이지로 리디렉션될 것이다.
  - 프로젝트는 기본적으로 `http://localhost:5173`에서 실행된다.

---

## Project Deliverables

1. **요구사항 분석 명세서 final version**: [SRS-final](https://example.com/requirements)

2. **Architecture 및 Design Documents**:
   - **Software Architecture**: [High level architecture](https://example.com/software-architecture)
   - **Software Design**: [Class Diagram](https://example.com/software-design), [Use case Diagram](https://example.com/software-design)
   - **UI Design**: [UI Design](https://example.com/ui-design)

3. **Coding Standard**:
   - [Coding Standard](https://example.com/coding-standard)

4. **Code: Branch Description 과 코드에 관한 Documentation**:
    - **Branch Description**
      1. **main**: 프로젝트의 최종 버전 코드가 저장된 브랜치이다. 제출 및 배포용으로 사용된다.
      2. **dev**: 개발 중인 코드를 관리하는 브랜치이다.
      (예시: `dev/backend/feature/login/IS-14-create-forum-API`, `dev/frontend/feature/overall-styling/IS-16-styling-all`).
5. **테스트 케이스 및 결과**:
   - [Test case and test result](https://example.com/test-cases)

---

## Repository Structure
  - **Frontend (`/interactive-map/src`)**:
    - **Root Files**:
      - `App.jsx`: 애플리케이션 최상위 컴포넌트
      - `index.css`: CSS 스타일 파일
      - `main.jsx`: React 애플리케이션 진입점
      - `Routes.jsx`: React Router 설정
    - **Directories**:
      - `/components`: 재사용 가능한 React UI 컴포넌트.
      - `/data`: 시설들의 정적 JSON 데이터
      - `/images`: 이미지 파일
      - `/mock`: 게시판의 테스트 Mock API 응답 데이터
      - `/pages`: 주요 페이지 컴포넌트.
      - `/store`: Zustand 글로벌 상태 관리

  - **Backend (`/backend`)**:
    - **Root Files**:
      - `app.js`: Express 애플리케이션 초기화 및 서버 설정.
      - `.env`: 환경 변수 파일.
      - `swaggerDef.js`: Swagger를 통한 API 문서 자동 생성 설정.

    - **Directories**:
      - `bin/`: 서버 실행 스크립트 (예: `www`).
      - `config/`: 애플리케이션 전역 설정 (예: 데이터베이스 연결 설정).
      - `migrations/`: 데이터베이스 마이그레이션 파일 관리.
      - `models/`: MySQL 데이터베이스 모델 정의.
      - `public/`: 정적 파일(CSS, JS 등)을 저장.
      - `routes/`: API 라우트 정의 (예: `auth.js`, `amenities.js`).
      - `test/`: API 및 기능 단위 테스트 스크립트.
      - `node_modules/`: npm 설치 패키지.

---

## Project Team Name and Members

### **SoftWizards**

| 이름 | 학번 | 역할 |
| --- | --- | --- |
| 2020920036 | 유원호 | UI/UX Designer |
| 2022280075 | 조우현 | UI/UX Designer |
| 2020920045 | 이운영 | Frontend Developer |
| 2022920035 | 부김은 | Frontend Developer |
| 2020920011 | 김영진 | Backend Developer |
| 2021920057 | 조아영 | Backend Developer |
