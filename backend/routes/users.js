var express = require('express');
var router = express.Router();
var db = require("../models/index");

/* GET users listing. #1
router.get('/:id', async(req, res, next) => {
  const users = await db.User.findAll();
  res.render('user', { users });
}); */

/* GET users listing. #2
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
*/

// http:localhost:3000/loginpage/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // front에서 넘겨주는 정보가 형식에 맞다고 가정하고 유무정도만 확인한다.
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  try {
    // ID X
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "없는 email입니다." });
    }

    // ID O, PW X
    if (password != user.password) {
      return res.status(401).json({ message: "비밀번호가 틀렸습니다." });
    }

    // ID O, PW O
    return res.status(200).json({
      // 제대로 연동되었는지 확인하기 위한 임시 return data
      user: { id: user.id, email: user.email, password: user.password },
      message: "Login success",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  } 
});

module.exports = router;
