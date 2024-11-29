var express = require('express');
var router = express.Router();
var db = require("../models/index");

/* GET users listing. */
router.get('/list', async(req, res, next) => {
  const users = await db.User.findAll();
  res.render('user', { users });
});

module.exports = router;
