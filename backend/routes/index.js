var express = require('express');
var router = express.Router();
var db = require("../models/index");

const usersRouter = require('./users');
const jwtRouter = require('./jwt');
const amenitiesRouter = require('./amenities');
const postsRouter = require('./posts');
const commentsRouter = require('./comments');

router.use('/loginpage', usersRouter, jwtRouter);
router.use('/main', amenitiesRouter);
router.use('/forumpage', postsRouter, commentsRouter);

router.get('/', (req, res) => {
  try {
      res.json({
          message: 'Welcome to NodeJS App. You can now use tools like Postman or curl to test the following endpoints:',
          endpoints: [
              // amenities
              {
                "method": "GET",
                "route": "/main/set",
                "description": "facility.json 파일에 있는 Amenity 정보를 DB에 저장함."
              },
              {
                "method": "GET",
                "route": "/main",
                "description": "Amenity id에 따라 amenity 정보를 불러옴."
              },
              {
                "method": "POST",
                "route": "/main/create",
                "description": "Amenity를 추가함."
              },
              {
                "method": "PUT",
                "route": "/main/update?id=",
                "description": "Amenity를 수정함."
              },
              {
                "method": "DELETE",
                "route": "/main/delete?id=",
                "description": "Amenity를 삭제함."
              },

              // posts
              {
                "method": "GET",
                "route": "/forumpage",
                "description": "post 정보를 모두 불러옴."
              },
              {
                "method": "POST",
                "route": "/forumpage/create",
                "description": "post를 추가함."
              },
              {
                "method": "DELETE",
                "route": "/forumpage/delete?id=",
                "description": "post id에 해당하는 post와 comments를 삭제함."
              },

              // comments
              {
                "method": "GET",
                "route": "/forumpage?id=",
                "description": "post id에 따라 post와 comment 정보들을 불러옴."
              },
              {
                "method": "POST",
                "route": "/forumpage/comment/create",
                "description": "comment를 추가함."
              },
              {
                "method": "DELETE",
                "route": "/forumpage/comment/delete?id=",
                "description": "comment id에 해당하는 comment를 삭제함."
              },

              // users
              {
                "method": "POST",
                "route": "/loginpage/login",
                "description": "로그인 기능"
              },
          ]
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
module.exports = router;