var express = require('express');
var router = express.Router();
var db = require("../models/index");

const usersRouter = require('./users');
const amenitiesRouter = require('./amenities');
const postsRouter = require('./posts');

router.use('/loginpage', usersRouter);
router.use('/main', amenitiesRouter);
router.use('/forumpage', postsRouter);


/*
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});
*/

router.get('/', (req, res) => {
  try {
      res.json({
          message: 'Welcome to NodeJS App. You can now use tools like Postman or curl to test the following endpoints:',
          endpoints: [
              // amenities
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

              // posts
              {
                "method": "GET",
                "route": "/forumpage",
                "description": "post id에 따라 post 정보를 불러옴."
              },
              {
                "method": "POST",
                "route": "/forumpage/create",
                "description": "post를 추가함."
              },

              // users
              {
                "method": "POST",
                "route": "/loginpage/login",
                "description": "로그인 기능"
              },
              //{ method: 'POST', route: '/users', description: 'Create a new user.' },
              //{ method: 'GET', route: '/users', description: 'Get all users.' },
              //{ method: 'PUT', route: '/users/:id', description: 'Update a user by ID.' },
              //{ method: 'DELETE', route: '/users/:id', description: 'Delete a user by ID.' }
          ]
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
module.exports = router;