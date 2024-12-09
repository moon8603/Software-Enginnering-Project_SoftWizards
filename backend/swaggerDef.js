const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        info: {
          title: "SEProject", // 프로젝트 제목
          version: "1.0.0", // 프로젝트 버전
          description: "편의시설 안내 서비스" // 프로젝트 설명
        },
        host: "localhost:3000", // 요청 URL
        basePath: "/",
      },

  apis: ['./routes/**/*.js'], // 라우트 파일들의 경로
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;