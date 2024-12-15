require('dotenv').config();

var express = require('express');
var router = express.Router();
var db = require("../models/index");
var jwt = require('jsonwebtoken');

/**
 * @swagger
 * /loginpage/login:
 *   post:
 *     summary: 로그인
 *     description: 이메일과 비밀번호를 사용하여 사용자가 로그인합니다.
 *     tags: [Users]
 *     parameters:
 *       - in: formData
 *         name: email
 *         type: string
 *         description: 로그인할 사용자의 이메일
 *         required: true
 *       - in: formData
 *         name: password
 *         type: string
 *         description: 사용자의 비밀번호
 *         required: true
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT 토큰
 *                 message:
 *                   type: string
 *                   description: 로그인 성공 메시지
 *       400:
 *         description: 이메일과 비밀번호가 누락되었습니다.
 *       404:
 *         description: 이메일에 해당하는 사용자를 찾을 수 없습니다.
 *       401:
 *         description: 비밀번호가 틀렸습니다.
 *       500:
 *         description: 서버 오류로 로그인에 실패했습니다.
 */
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

    // JWT 토큰 발급
    const token = jwt.sign(
      { id: user.id, email: user.email }, // payload: 사용자 정보
      process.env.JWT_SECRET, // JWT 비밀 키 (환경변수로 관리)
      { expiresIn: '1h' } // 만료 시간 설정 (1시간)
    );

    // ID O, PW O
    return res.status(200).json({
      // 제대로 연동되었는지 확인하기 위한 임시 return data
      //user: { id: user.id, email: user.email, password: user.password },
      token: token,
      message: "Login success",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  } 
});

module.exports = router;