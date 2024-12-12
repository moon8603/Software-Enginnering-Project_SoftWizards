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

    // 로그인 테스트
    it("POST /loginpage/login - 로그인 성공하고 200을 반환", async () => {
        const res = await request(app).post("/loginpage/login").send({
            email: "test@gmail.com",
            password: "test0000",
        });
        expect(res.statusCode).toEqual(200);
        console.log("res는 다음과 같다.", res.body);
        //expect(res.body.token).toEqual("");
        //expect(res.body.message).toEqual("Login success");
        userToken = res.body.token;
    });
});