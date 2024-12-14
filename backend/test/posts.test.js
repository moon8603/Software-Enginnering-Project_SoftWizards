const request = require('supertest');
const app = require('../app');
const db = require("../models");

describe('POST API', () => {
    let testPostId;
    let testCommentId;

    // 데이터베이스 연결 설정
    beforeAll(async () => {
        // 테스트용 DB 연결 설정
        await db.sequelize.authenticate();
        await db.sequelize.sync();

        // 테스트용 게시글 생성
        const post = await db.Post.create({
        author: "testAuthor",
        title: "Test Post Title",
        content: "This is a test post content"
        });

        //console.log("post결과", post);

        testPostId = post.id;

        // 테스트용 댓글 생성
        const comment = await db.Comment.create({
        postId: testPostId,
        authorId: 1, // admin이라 가정
        content: "This is a test comment"
        });
  
        //console.log("comment결과", comment);

        testCommentId = comment.id;
    });

    //jest.setTimeout(100000);

    

    // 1. 게시글 목록 조회
  it("GET /forumpage - 모든 게시글을 조회", async () => {
    const res = await request(app).get("/forumpage");

    //console.log("res body: ", res);
    //console.log("res status: ", res.statusCode);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.postsData).toBeInstanceOf(Array);
    expect(res.body.data.postsData.length).toBeGreaterThan(0);
  });

  it("GET /forumpage - 특정 게시글 조회 (댓글 포함)", async () => {
    const res = await request(app).get(`/forumpage?id=${testPostId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.postsData[0].id).toEqual(testPostId);
    expect(res.body.data.commentsData).toBeInstanceOf(Array);
    expect(res.body.data.commentsData.length).toBeGreaterThan(0);
  });

  it("GET /forumpage - 게시글을 찾을 수 없을 때 404 반환", async () => {
    const res = await request(app).get("/forumpage?id=9999");

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Post with id 9999 not found");
  });

  // 2. 게시글 생성
  it("POST /forumpage/create - 게시글 생성 성공", async () => {
    const newPost = {
      author: "newuser@example.com",
      title: "New Post Title",
      content: "New post content"
    };

    const res = await request(app)
      .post("/forumpage/create")
      .send(newPost);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toEqual(true);
    expect(res.body.data).toHaveProperty("id");
  });

  it("POST /forumpage/create - 필수 필드 누락 시 400 반환", async () => {
    const res = await request(app).post("/forumpage/create").send({
      author: "newuser@example.com",
      title: "Incomplete Post"
      // content 누락
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("All fields are required");
  });

  // 3. 게시글 삭제
  it("DELETE /forumpage/delete - 게시글 삭제 성공", async () => {
    const res = await request(app).delete(`/forumpage/delete?id=${testPostId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual(`Post with id ${testPostId} and its comments have been deleted successfully`);
  });

  it("DELETE /forumpage/delete - 게시글 ID 누락 시 400 반환", async () => {
    const res = await request(app).delete("/forumpage/delete");

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Post ID is required');
  });

  it("DELETE /forumpage/delete - 존재하지 않는 게시글 삭제 시 404 반환", async () => {
    const res = await request(app).delete("/forumpage/delete?id=9999");

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Post with id 9999 not found");
  });
    

  // 데이터베이스 연결 종료
  afterAll(async () => {
    // 테스트 후 DB 연결 종료
    await db.sequelize.close();
});
});