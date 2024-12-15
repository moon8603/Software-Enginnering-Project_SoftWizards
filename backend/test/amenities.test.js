const request = require('supertest');
const app = require('../app');  // app.js 경로에 맞게 수정
const db = require("../models");  // DB 연결 경로에 맞게 수정

// 테스트 데이터
let testAmenityId;

// 시설 데이터를 삽입하는 테스트용 함수
const createTestAmenity = async () => {
  const randomNumber = Math.floor(Math.random() * 10000);

  const res = await request(app)
    .post('/main/create')
    .send({
        name: `New Amenity${randomNumber}`,
        coordinates: [37.5665, 126.978],
        description: "New Amenity Description",
        workingHour: "00:00 ~ 23:59",
        type: ["기본 편의 시설", "도서관"]
    });

  console.log("응답입니다.", res.body);
  testAmenityId = res.body.data.id;  // 생성된 Amenity의 id 저장
  return res.body.data;
};

describe('Amenity API tests', () => {

  // 1. GET /main - 전체 시설 목록 조회
  it('GET /main - 모든 시설 조회', async () => {
    const res = await request(app).get('/main');

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // 2. GET /main?id=ID - 특정 시설 조회
  it('GET /main?id=ID - 특정 시설 조회', async () => {
    const amenity = await createTestAmenity();
    
    const res = await request(app).get(`/main?id=${amenity.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data[0].id).toBe(amenity.id);
    expect(res.body.data[0].name).toBe(amenity.name);
  });

  // 3. GET /main?id=9999 - 시설이 없을 때 404 반환
  it('GET /main?id=9999 - 시설 조회 시 404 반환', async () => {
    const res = await request(app).get('/main?id=9999');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Amenity with id 9999 not found');
  });

  // 4. POST /main/create - 시설 생성
  it('POST /main/create - 새로운 시설 추가', async () => {
    const randomNumber = Math.floor(Math.random() * 10000);

    const res = await request(app)
      .post('/main/create')
      .send({
        name: `New Amenity${randomNumber}`,
        coordinates: [37.5665, 126.978],
        description: "New Amenity Description",
        workingHour: "00:00 ~ 23:59",
        type: ["기본 편의 시설", "도서관"]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
  });

  // 5. PUT /main/update?id=ID - 시설 정보 수정
  it('PUT /main/update?id=ID - 시설 정보 수정', async () => {
    const amenity = await createTestAmenity();

    const res = await request(app)
      .put(`/main/update?id=${amenity.id}`)
      .send({
        name: "Updated Amenity",
        coordinates: [37.5665, 126.979],
        description: "Updated Description",
        workingHour: "8 AM - 8 PM",
        type: ["updatedType1", "updatedType2"]
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Amenity");
  });

  // 6. DELETE /main/delete?id=ID - 시설 삭제
  it('DELETE /main/delete?id=ID - 시설 삭제', async () => {
    const amenity = await createTestAmenity();

    const res = await request(app)
      .delete(`/main/delete?id=${amenity.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('시설이 삭제되었습니다.');

    // 삭제된 시설이 DB에 존재하지 않는지 확인
    const deletedAmenity = await db.Amenity.findByPk(amenity.id);
    expect(deletedAmenity).toBeNull();
  });

  // 7. GET /main/set - 초기 데이터 설정
  it('GET /main/set - 초기 시설 데이터 DB에 삽입', async () => {
    const res = await request(app).get('/main/set');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('DB SETTING 완료');
  });
});