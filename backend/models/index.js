// 'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
const config = require('../config/config.json')[env];
const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  dialectOptions: {
    timezone: '+09:00', // 한국 시간 KST
  },
  timezone: '+09:00', // 한국 시간 KST
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.Amenity = require('./amenity')(sequelize, Sequelize);
// db.Post = require('./post')(sequelize, Sequelize);
// db.User = require('./user')(sequelize, Sequelize);
// 위와 같이 각각 모델들을 연결하는 대신 아래 코드를 사용함
const basename = path.basename(__filename);
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    console.log(file, model.name);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
