var express = require('express');
var router = express.Router();
var db = require("../models/index");

/* GET posts listing. */
router.get('/', async(req, res, next) => {
  try {
    let posts, comments;
    const { id } = req.query;

    // Post id 있는 경우
    if (id) {
      // 유효한 Post id - post
      posts = await db.Post.findOne({
        where: { id },
        attributes: { exclude: ['updatedAt'] }
      });

      // 유효한 Post id - comments
      comments = await db.Comment.findAll({
        where: { postId: id },
        attributes: { exclude: ['updatedAt'] },
        order: [['id', 'DESC']],
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
        attributes: { exclude: ['updatedAt'] },
        order: [['id', 'DESC']],
      });
    }
    
    // 가공된 posts 데이터
    const postsData = (posts || []).map(item => {
      //console.log(item.createdAt);
      return {
        ...item.dataValues,
        // 작성날짜형식 0000-00-00
        createdAt: item.createdAt.toISOString().split('T')[0],
      };
    });

    // 가공된 comments 데이터
    const commentsData = (comments || []).map(item => {
      return {
        ...item.dataValues,
        // 작성날짜형식 0000-00-00
        createdAt: item.createdAt.toISOString().split('T')[0],
      };
    });

    // JSON 형식으로 응답
    res.json({
      // success: true,
      data: { postsData, commentsData },
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
      const { author, title, content } = req.body;
      if (!author || !title || !content) {
          return res.status(400).json({ success: false, message: 'All fields are required' });
      }
      const post = await db.Post.create({ author, title, content });
      res.status(201).json({ success: true, data: post });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to create post' });
  }
});

// 게시글 삭제 (admin 권한 추후 부여)
router.delete('/delete', async (req, res) => {
  const { id } = req.query;

  // id X
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Post ID is required',
    });
  }

  try {
    // 트랜잭션 시작
    const transaction = await db.sequelize.transaction();

    try {
      const post = await db.Post.findOne({ where: { id } });
      
      // id O, invalid id
      if (!post) {
        return res.status(404).json({
          success: false,
          message: `Post with id ${id} not found`,
        });
      }

      // id O, valid id - comment 삭제
      await db.Comment.destroy({ where: { postId: id }, transaction });

      // id O, valid id - post 삭제
      await db.Post.destroy({ where: { id }, transaction });

      // 트랜잭션 커밋
      await transaction.commit();

      res.status(200).json({
        success: true,
        message: `Post with id ${id} and its comments have been deleted successfully`,
      });
    } catch (error) {
      // 트랜잭션 롤백
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error deleting post and comments:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete post and its comments",
      error: error.message,
    });
  }
});

module.exports = router;