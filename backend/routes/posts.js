var express = require('express');
var router = express.Router();
var db = require("../models/index");

/* GET posts listing. */
router.get('/', async(req, res, next) => {
  try {
    let posts;
    const { id } = req.query;

    // Post id 있는 경우
    if (id) {
      // 유효한 Post id
      posts = await db.Post.findOne({
        where: { id },
        attributes: { exclude: ['updatedAt'] }
      });

      // 유효하지 않은 Post id
      if (!posts) {
        return res.status(404).json({
          success: false,
          message: `Post with id ${id} not found`,
        });
      }

      posts = [posts];
    } else {
      // Post id 없는 경우
      posts = await db.Post.findAll({
        attributes: { exclude: ['password', 'updatedAt'] },
        order: [['id', 'DESC']],
      });
    }
    
    // 가공된 데이터
    const postsData = (posts || []).map(item => {
      console.log(item.createdAt);
      return {
        ...item.dataValues,
        // 작성날짜형식 0000-00-00
        createdAt: item.createdAt.toISOString().split('T')[0],
      };
    });

    // JSON 형식으로 응답
    res.json({
      // success: true,
      data: postsData,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);

    // 에러 발생 시 JSON 응답
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
});


// 게시글 생성
router.post('/create', async (req, res) => {
  try {
      const { author, title, content, password } = req.body;
      if (!author || !title || !content || !password) {
          return res.status(400).json({ success: false, message: 'All fields are required' });
      }
      const post = await db.Post.create({ author, title, content, password });
      res.status(201).json({ success: true, data: post });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to create post' });
  }
});

module.exports = router;