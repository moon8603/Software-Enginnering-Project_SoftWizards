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

// 댓글 삭제 API

module.exports = router;