var express = require('express');
var router = express.Router();
var db = require("../models/index");

/**
 * @swagger
 * /forumpage/comment/create:
 *   post:
 *     summary: 댓글 생성
 *     description: 게시글에 새로운 댓글을 작성합니다.
 *     tags: [Comments]
 *     parameters:
 *       - in: formData
 *         name: postId
 *         type: integer
 *         description: 댓글을 작성할 게시글의 ID
 *         required: true
 *       - in: formData
 *         name: content
 *         type: string
 *         description: 댓글의 내용
 *         required: true
 *     responses:
 *       201:
 *         description: 댓글이 성공적으로 생성되었습니다.
 *       400:
 *         description: 필수 필드(postId, content)가 누락되었습니다.
 *       500:
 *         description: 댓글 생성 중 오류가 발생했습니다.
 */
router.post('/comment/create', async (req, res) => {
    try {
        // 현재 관리자 한 명뿐이므로 authorId는 임의로 1로 부여한다.
        const authorId = 1;
        
        // postId req말고 다른 방식으로 받아야
        const { postId, content } = req.body;
        if (!postId || !content) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const comment = await db.Comment.create({ authorId, postId, content });
        res.status(201).json({ success: true, data: comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create comment' });
    }
  });

// admin 권한 추후 부여
/**
 * @swagger
 * /forumpage/comment/delete:
 *   delete:
 *     summary: 댓글 삭제
 *     description: 특정 ID의 댓글을 삭제합니다.
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: id
 *         description: 삭제할 댓글의 ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 댓글이 성공적으로 삭제되었습니다.
 *       400:
 *         description: 댓글 ID가 누락되었습니다.
 *       404:
 *         description: 댓글을 찾을 수 없습니다.
 *       500:
 *         description: 댓글 삭제 중 오류가 발생했습니다.
 */
router.delete('/comment/delete', async (req, res) => {
    const { id } = req.query;
  
    // id X
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Comment ID is required',
      });
    }
  
    
    try {
        // id O, valid ID
        const result = await db.Comment.destroy({
          where: { id },
        });
    
        // id O, invalid ID
        if (result === 0) {
          return res.status(404).json({ error: 'Comment not found' });
        }
    
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
    
  });

module.exports = router;