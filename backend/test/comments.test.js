const request = require('supertest');
const app = require('../app');  // app.js 경로에 맞게 수정
const db = require('../models'); // DB 연결 경로에 맞게 수정

// 테스트 데이터
let testCommentId = 0;
let testPostId = 1;  // 테스트용 게시글 ID (필요에 따라 수정)

describe('Forum Comment API tests', () => {

  // 1. POST /forumpage/comment/create - 댓글 생성
  it('POST /forumpage/comment/create - 댓글 생성', async () => {
    const res = await request(app)
      .post('/forumpage/comment/create')
      .send({
        postId: testPostId,
        content: "This is a test comment"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    testCommentId = res.body.data.id;  // 생성된 댓글의 ID 저장
  });

  // 2. POST /forumpage/comment/create - 필수 필드 누락시 오류
  it('POST /forumpage/comment/create - 필수 필드 누락 시 오류 발생', async () => {
    const res = await request(app)
      .post('/forumpage/comment/create')
      .send({
        postId: testPostId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('All fields are required');
  });

  // 3. DELETE /forumpage/comment/delete?id=ID - 댓글 삭제
  it('DELETE /forumpage/comment/delete?id=ID - 댓글 삭제', async () => {
    const res = await request(app)
      .delete(`/forumpage/comment/delete?id=${testCommentId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Comment deleted successfully');
  });

  // 4. DELETE /forumpage/comment/delete?id=INVALID_ID - 유효하지 않은 댓글 ID 삭제
  it('DELETE /forumpage/comment/delete?id=INVALID_ID - 유효하지 않은 댓글 ID 삭제 시 오류', async () => {
    const res = await request(app)
      .delete('/forumpage/comment/delete?id=9999'); // 존재하지 않는 ID

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Comment not found');
  });

  // 5. DELETE /forumpage/comment/delete - 댓글 ID 누락 시 오류
  it('DELETE /forumpage/comment/delete - 댓글 ID 누락 시 오류 발생', async () => {
    const res = await request(app).delete('/forumpage/comment/delete');

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Comment ID is required');
  });
});