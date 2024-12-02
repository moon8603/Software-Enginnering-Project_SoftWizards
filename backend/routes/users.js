var express = require('express');
var router = express.Router();
var db = require("../models/index");

/* GET users listing.
router.get('/:id', async(req, res, next) => {
  const users = await db.User.findAll();
  res.render('user', { users });
}); */

router.get('/:id', async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/*
router.post('/login', async(req, res, next) => {
  
});
*/

module.exports = router;
