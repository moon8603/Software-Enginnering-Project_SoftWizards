var express = require('express');
var router = express.Router();
var db = require("../models/index");

/* GET amenities listing. */
router.get('/listAll', async(req, res, next) => {
  try {
    // 데이터베이스에서 모든 Amenity 가져오기
    const amenities = await db.Amenity.findAll();

    // JSON 형식으로 응답
    res.json({
      success: true,
      data: amenities,
    });
  } catch (error) {
    console.error("Error fetching amenities:", error);

    // 에러 발생 시 JSON 응답
    res.status(500).json({
      success: false,
      message: "Failed to fetch amenities",
      error: error.message,
    });
  }
});

module.exports = router;