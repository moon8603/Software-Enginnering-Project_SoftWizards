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

/* amenity 추가 */
router.post('/create', async (req, res) => {
  try {
      // 클라이언트가 보낸 JSON 데이터 추출
      const { name, coordinates, description, workingHour, type } = req.body;

      // 유효성 검사
      // working Hour 등 설계에 대한 논의 필요
      if (!name || !coordinates || !type) {
          return res.status(400).json({
              success: false,
              message: "name, coordinates, and type are required.",
          });
      }

      // 새 Amenity 생성
      const newAmenity = await db.Amenity.create({
          name,
          coordinates: Array.isArray(coordinates) ? coordinates.join(' ') : coordinates,
          description,
          workingHour,
          type: Array.isArray(type) ? type.join(' ') : type,
      });

      // 성공 응답
      res.status(201).json({
          success: true,
          message: "Amenity created successfully.",
          data: newAmenity,
      });
  } catch (error) {
      console.error("Error creating Amenity:", error);

      // 에러 발생 시 응답
      res.status(500).json({
          success: false,
          message: "Failed to create Amenity.",
          error: error.message,
      });
  }
});

module.exports = router;