// routes/posts.js
const express = require('express');
const router = express.Router();
const db = require('../models/index');

// 게시글 목록 조회
router.get('/', async (req, res) => {
    try {
        const posts = await db.Post.findAll({
            attributes: ['id', 'author', 'title', 'content', 'createdAt'], // 비밀번호 제외
            order: [['createdAt', 'DESC']], // 최신순 정렬
        });
        res.json({ success: true, data: posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch posts' });
    }
});

// 게시글 생성
router.post('/', async (req, res) => {
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
