var express = require('express');
var router = express.Router();
var db = require("../models/index");

/* GET comments listing. */
router.get('/', async(req, res, next) => {
  try {
    let comments;
    const { postId } = req.query;

    // PostId 있는 경우
    if (postId) {
      // 유효한 PostId
      comments = await db.Comment.findAll({
        where: { postId },
        attributes: { exclude: ['updatedAt'] },
        order: [['id', 'DESC']],
      });

      // PostId 없거나 유효하지 않음.
      // 빈 comments를 보낼 경우와 잘못된 comments를 보낼 경우 구분해서
      // front단에서의 조작 필요
      if (!comments) {
        comments = ' ';
      }

      comments = [comments];
    }
    
    // 가공된 데이터
    const commentsData = (comments || []).map(item => {
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
      data: commentsData,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);

    // 에러 발생 시 JSON 응답
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
});


// 댓글 작성 API

module.exports = router;