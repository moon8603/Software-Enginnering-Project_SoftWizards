var express = require('express');
var router = express.Router();
var db = require("../models/index");

// 댓글 작성 API
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

// 댓글 삭제 API (admin 권한 추후 부여)
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