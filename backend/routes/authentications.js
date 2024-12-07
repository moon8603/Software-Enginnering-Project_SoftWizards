require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../models/index'); // User 모델을 import
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, ALGORITHM } = process.env;

// Access Token 생성 (3시간 유지)
function createAccessToken(userId) {
  const payload = {
    user_id: userId,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3), // 3시간 후 만료
    iat: Math.floor(Date.now() / 1000) // 발급 시간
  };
  return jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, { algorithm: ALGORITHM });
}

// Access Token 디코딩
function decodeAccessToken(token) {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY, { algorithms: [ALGORITHM] });
    return decoded.user_id; // user_id 리턴
  } catch (error) {
    throw new Error('Access token is unauthenticated');
  }
}

// Refresh Token 생성 (90일 유지)
function createRefreshToken(userId) {
  const payload = {
    user_id: userId,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 90), // 90일 후 만료
    iat: Math.floor(Date.now() / 1000) // 발급 시간
  };
  return jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, { algorithm: ALGORITHM });
}

// Refresh Token 디코딩
function decodeRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET_KEY, { algorithms: [ALGORITHM] });
    return decoded.user_id; // user_id 리턴
  } catch (error) {
    throw new Error('Refresh token is unauthenticated');
  }
}

// 요청에서 JWT를 통해 사용자 객체 추출
async function extractUserFromJwt(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.split(' ').length === 2) {
    const token = authHeader.split(' ')[1]; // 'Bearer <token>'
    try {
      const userId = decodeAccessToken(token); // 토큰에서 user_id 추출
      const user = await db.User.findByPk(userId); // DB에서 유저 찾기
      if (!user) {
        throw new Error('User not found');
      }
      // 유저 상태 업데이트 함수 호출
      user.updateStatus(); 
      return user; // 사용자 객체 리턴
    } catch (error) {
      throw new Error('Access token unauthenticated');
    }
  } else {
    throw new Error('Authorization header is missing or invalid');
  }
}

module.exports = {
  createAccessToken,
  decodeAccessToken,
  createRefreshToken,
  decodeRefreshToken,
  extractUserFromJwt
};
