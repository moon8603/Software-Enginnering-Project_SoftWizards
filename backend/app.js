//require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const bodyPasrser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// 라우터 분리 수정해야 함
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const amenitiesRouter = require('./routes/amenities');
const db = require("./models");

const app = express();
// cors
//const server = createServer(app);
const cors = require('cors');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 수정
app.use('/', indexRouter);
app.use('/loginpage', usersRouter);
app.use('/main', amenitiesRouter);

// cors
app.use(cors());

// db 연결
db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("DB 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
