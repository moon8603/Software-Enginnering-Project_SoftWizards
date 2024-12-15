var express = require('express');
var router = express.Router();
var db = require("../models/index");

/**
 * @swagger
 * /forumpage:
 *   get:
 *     summary: 게시글 목록 조회
 *     description: 모든 게시글을 조회하거나 특정 게시글과 해당 댓글을 조회합니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: id
 *         description: 특정 게시글을 조회하기 위한 게시글 ID
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 게시글과 댓글과 유저를 성공적으로 조회했습니다.
 *       404:
 *         description: 주어진 ID로 게시글을 찾을 수 없습니다.
 *       500:
 *         description: 게시글 조회 중 오류가 발생했습니다.
 */

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
    const commentsData = [];
    for (let comment of (comments || [])) {
      const author = await db.User.findOne({
        where: { id: comment.authorId },
        attributes: ['email'],
      });

      commentsData.push({
        ...comment.dataValues,
        // 작성날짜형식 0000-00-00
        createdAt: comment.createdAt.toISOString().split('T')[0],
        email: author.email,
      });
    }

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


/**
 * @swagger
 * /forumpage/create:
 *   post:
 *     summary: 게시글 생성
 *     description: 새로운 게시글을 생성합니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: formData
 *         name: author
 *         type: string
 *         description: 게시글 작성자
 *         required: true
 *       - in: formData
 *         name: title
 *         type: string
 *         description: 게시글 제목
 *         required: true
 *       - in: formData
 *         name: content
 *         type: string
 *         description: 게시글 내용
 *         required: true
 *     responses:
 *       201:
 *         description: 게시글이 성공적으로 생성되었습니다.
 *       400:
 *         description: 필수 필드(author, title, content)가 누락되었습니다.
 *       500:
 *         description: 게시글 생성 중 오류가 발생했습니다.
 */
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

// (admin 권한 추후 부여)
/**
 * @swagger
 * /forumpage/delete:
 *   delete:
 *     summary: 게시글 삭제
 *     description: 특정 ID의 게시글과 해당 댓글을 삭제합니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: id
 *         description: 삭제할 게시글의 ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 게시글과 댓글이 성공적으로 삭제되었습니다.
 *       400:
 *         description: 게시글 ID가 누락되었습니다.
 *       404:
 *         description: 주어진 ID로 게시글을 찾을 수 없습니다.
 *       500:
 *         description: 게시글 삭제 중 오류가 발생했습니다.
 */
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