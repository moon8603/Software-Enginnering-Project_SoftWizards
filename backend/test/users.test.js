const request = require('supertest');
const app = require('../app');
const db = require("../models");

describe('LOGIN API', () => {
    let userToken;

    // 데이터베이스 연결 설정
    beforeAll(async () => {
        // 테스트용 DB 연결 설정
        await db.sequelize.authenticate();

        // DB 동기화 대기
        await db.sequelize.sync();
    });

    // 데이터베이스 연결 종료
    afterAll(async () => {
        // 테스트 후 DB 연결 종료
        await db.sequelize.close();
    });

    // 로그인 성공
    it("POST /loginpage/login - 로그인 성공하고 200을 반환", async () => {
        const res = await request(app).post("/loginpage/login").send({
            email: "test@gmail.com",
            password: "test0000",
        });
        expect(res.statusCode).toEqual(200);
        
        console.log("res는 다음과 같다.", res.body);
        expect(res.body.token).toBeDefined();
        expect(res.body.message).toEqual("Login success");
        //userToken = res.body.token;
    });

    // 이메일 or 비밀번호 X
    it("POST /loginpage/login - 이메일과 비밀번호가 누락되었을 때 400을 반환", async () => {
        const res = await request(app).post("/loginpage/login").send({
            email: "",
            password: "",
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("Email and password are required");
    });


    // 이메일 오류
    it("POST /loginpage/login - 존재하지 않는 이메일로 로그인 시 404를 반환", async () => {
        const res = await request(app).post("/loginpage/login").send({
            email: "nonexistent@gmail.com",
            password: "test0000",
        });

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual("없는 email입니다.");
    });

    // 비밀번호 오류
    it("POST /loginpage/login - 잘못된 비밀번호로 로그인 시 401을 반환", async () => {
        const res = await request(app).post("/loginpage/login").send({
            email: "test@gmail.com",
            password: "wrongpassword",
        });

        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual("비밀번호가 틀렸습니다.");
    });

    // 서버 오류 처리
    it("POST /loginpage/login - 서버 오류 시 500을 반환", async () => {
        // 가상의 DB 접근 실패 상황, 500을 반환한다.
        jest.spyOn(db.User, 'findOne').mockRejectedValueOnce(new Error('DB error'));

        const res = await request(app).post("/loginpage/login").send({
            email: "test@gmail.com",
            password: "test0000",
        });

        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual("Server error. Please try again.");
    });
});