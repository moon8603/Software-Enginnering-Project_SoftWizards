var express = require('express');
var router = express.Router();
var db = require("../models/index");

/* GET amenities listing. */
router.get('/', async(req, res, next) => {
  try {
    let amenities;
    const { id } = req.query;

    // Amenity id 있는 경우
    if (id) {
      // 유효한 Amenity id
      amenities = await db.Amenity.findOne({
        where: { id },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });

      // 유효하지 않은 Amenity id
      if (!amenities) {
        return res.status(404).json({
          success: false,
          message: `Amenity with id ${id} not found`,
        });
      }

      amenities = [amenities];
    } else {
      // Amenity id 없는 경우
      amenities = await db.Amenity.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });
    }
    
    // 가공된 데이터
    const amenitiesData = (amenities || []).map(item => {
      return {
        ...item.dataValues,
        coordinates: item.coordinates.split(' ').map(parseFloat),
        type: item.type.split(' '),
      };
    });

    // JSON 형식으로 응답
    res.json({
      // success: true,
      data: amenitiesData,
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