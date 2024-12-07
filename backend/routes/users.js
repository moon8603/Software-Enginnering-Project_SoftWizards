var express = require('express');
var router = express.Router();
var db = require("../models/index");
var jwt =require("jsonwebtoken");

const {
  createAccessToken,
  createRefreshToken,
  extractUserFromJwt
} = require('./authentications');
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

    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

     res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS 환경에서만 사용
      maxAge: 90 * 24 * 60 * 60 * 1000 // 90일
    });


    // ID O, PW O
    return res.status(200).json({
      accessToken,
      message: "Login success",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  } 
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const userId = decodeRefreshToken(refreshToken); // Refresh Token에서 user_id 추출
    const newAccessToken = createAccessToken(userId); // 새로운 Access Token 생성
    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
});

router.get('/protected', async (req, res) => {
  try {
    const user = await extractUserFromJwt(req); // JWT에서 사용자 객체 추출
    res.json({ message: 'Protected route accessed', user });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;

  // refreshToken을 DB에서 삭제 (if stored in DB)
  try {
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required." });
    }

    const token = await db.Token.findOne({ where: { token: refreshToken } });
    if (!token) {
      return res.status(404).json({ message: "Invalid refresh token." });
    }

    // 삭제 처리
    await token.destroy();
    return res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error during logout." });
  }
});

module.exports = router;