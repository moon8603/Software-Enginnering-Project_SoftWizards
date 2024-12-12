# 🚀 backend 서버 실행 방법
  
  - 241207 db - posts table에서 password column 삭제
  - 241211 db - amenities table에 link column 추가
  **npx sequelize-cli db:migrate로 DB 연산 적용시킨 후 실행하시길 바랍니다.**

1. **config/config.json - development에서 자신의 mysql에 맞게 설정한다.**
  `테이블 구조는 models/seproject_241211.sql에 있다.`

2. **모든 코드를 다운로드한 상태에서 Terminal을 열기**

3. **프로젝트 디렉토리로 이동**
  `cd backend`

4. **필요한 dependencies 설치**
  `npm install`

5. **개발 서버 시작**
  `npm run dev`  

- npm run dev 하고 나서 http://localhost:5173/main에서 DB 연동 확인 가능
`API 문서 (swagger): http://localhost:3000/docs`