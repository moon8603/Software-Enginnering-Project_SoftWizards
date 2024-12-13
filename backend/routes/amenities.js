var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require('path');
var db = require("../models/index");

// facilities.json 위치
const facilitiesFilePath = path.join(__dirname, '../../interactive-map/src/data/facilities.json');



// facilities.json 파일을 읽어오는 함수
const getFacilitiesFromFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(facilitiesFilePath, "utf8", (err, data) => {
      if (err) {
        reject("Error reading file: " + err);
      } else {
        const amenities = JSON.parse(data).data;
        const setAmenities = amenities.map(item => {
          return {
            ...item,
            coordinates: Array.isArray(item.coordinates) ? item.coordinates.join(' ') : item.coordinates, // 배열이면 join, 아니면 그대로
            type: Array.isArray(item.type) ? item.type.join(', ') : item.type // 배열이면 join, 아니면 그대로
          };
        });
        
        resolve(setAmenities);
      }
    });
  });
};

// facilities.json 파일에 데이터를 저장하는 함수
const saveFacilitiesToFile = (facilities) => {
  fs.writeFileSync(facilitiesFilePath, JSON.stringify({ data: facilities }, null, 2));
};









/**
 * @swagger
 * /main:
 *   get:
 *     summary: 시설 목록 조회
 *     description: Amenity id가 없으면 전체 목록을, 있으면 특정 시설을 조회
 *     parameters:
 *       - in: query
 *         name: id
 *         description: 시설 id
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 성공적으로 시설 목록을 조회
 *       404:
 *         description: 시설을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
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









/**
 * @swagger
 * /main/set:
 *   get:
 *     summary: 초기 시설 데이터 설정
 *     description: facilities.json 파일의 데이터를 DB에 저장
 *     responses:
 *       200:
 *         description: DB 설정 완료
 *       500:
 *         description: 데이터 삽입 중 오류
 */
router.get('/set', async (req, res) => {
  try {
    //console.log(getFacilitiesFromFile());
    const amenitiesFromFile = await getFacilitiesFromFile();

    // DB의 기존 데이터를 모두 삭제
    await db.Amenity.destroy({
      where: {},  // 조건 없이 모든 데이터 삭제
    });

    const result = await db.Amenity.bulkCreate(amenitiesFromFile, {
      ignoreDuplicates: true
    });
    console.log("DB SETTING 완료");
    res.status(200).json({ message: "DB SETTING 완료" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Error inserting data" });
  }
  
});











/**
 * @swagger
 * /main/create:
 *   post:
 *     summary: 개별 시설 추가
 *     description: 새로운 Amenity를 추가
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *               description:
 *                 type: string
 *               workingHour:
 *                 type: string
 *               type:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Amenity 생성 성공
 *       400:
 *         description: 필수 필드 누락
 *       500:
 *         description: 생성 중 오류
 */
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

      // facilities.json 파일에서 기존 시설 데이터를 읽어옴
      const facilitiesFromFile = await getFacilitiesFromFile();

      // 새로 추가한 시설을 facilities.json 데이터에 추가
      const newFacility = {
        id: newAmenity.id,
        name: newAmenity.name,
        coordinates: coordinates,
        description: newAmenity.description,
        workingHour: newAmenity.workingHour,
        type: type,
      };

      facilitiesFromFile.push(newFacility);
        
      // facilities.json 파일에 새로운 데이터 저장
      saveFacilitiesToFile(facilitiesFromFile);

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





/**
 * @swagger
 * /main/update:
 *   put:
 *     summary: 시설 정보 수정
 *     description: 기존 시설 정보를 수정
 *     parameters:
 *       - in: query
 *         name: id
 *         description: 시설 id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *               description:
 *                 type: string
 *               workingHour:
 *                 type: string
 *               type:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 시설 정보 수정 완료
 *       404:
 *         description: 시설을 찾을 수 없음
 *       500:
 *         description: 수정 중 오류
 */
router.put('/update', async (req, res) => {
  const { id } = req.query;
  const updatedFacility = req.body;
  //console.log (updatedFacility);
  try {
    const amenity = await db.Amenity.findByPk(id);
    if (!amenity) {
      return res.status(404).json({ message: '시설을 찾을 수 없습니다.' });
    }

    // front에서 넘겨줄 때 정보가 비워지는 일이 없도록 하자.
    // DB에서 시설 정보 업데이트
    await amenity.update({
      name: updatedFacility.name,
      coordinates: Array.isArray(updatedFacility.coordinates) ? updatedFacility.coordinates.join(' ') : updatedFacility.coordinates,
      description: updatedFacility.description,
      workingHour: updatedFacility.workingHour,
      type: Array.isArray(updatedFacility.type) ? updatedFacility.type.join(', ') : updatedFacility.type,
      link: updatedFacility.link,
    });

    // facilities.json에서 해당 시설 업데이트
    const facilitiesFromFile = await getFacilitiesFromFile();
    const updatedFacilities = facilitiesFromFile.map(facility =>
      facility.id === parseInt(id) ? { ...facility, ...updatedFacility } : facility
    );
    saveFacilitiesToFile(updatedFacilities);

    res.json(amenity);
  } catch (error) {
    console.error("Error updating Amenity:", error);
    res.status(500).json({ message: "Failed to update Amenity", error: error.message });
  }
});


/**
 * @swagger
 * /main/delete:
 *   delete:
 *     summary: 시설 삭제
 *     description: 특정 id의 시설을 삭제
 *     parameters:
 *       - in: query
 *         name: id
 *         description: 시설 id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 시설 삭제 완료
 *       404:
 *         description: 시설을 찾을 수 없음
 *       500:
 *         description: 삭제 중 오류
 */
router.delete('/delete', async (req, res) => {
  const { id } = req.query;

  try {
    const amenity = await db.Amenity.findByPk(id);
    if (!amenity) {
      return res.status(404).json({ message: '시설을 찾을 수 없습니다.' });
    }

    // DB에서 시설 삭제
    await amenity.destroy();

    // facilities.json에서 해당 시설 삭제
    const facilitiesFromFile = await getFacilitiesFromFile();
    const updatedFacilities = facilitiesFromFile.filter(facility => facility.id !== parseInt(id));
    saveFacilitiesToFile(updatedFacilities);

    res.json({ message: '시설이 삭제되었습니다.' });
  } catch (error) {
    console.error("Error deleting Amenity:", error);
    res.status(500).json({ message: "Failed to delete Amenity", error: error.message });
  }
});

module.exports = router;