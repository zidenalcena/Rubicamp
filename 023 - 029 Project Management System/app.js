var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var flash = require('connect-flash');
var fileUpload = require('express-fileupload');


const { Pool, client } = require('pg')

const pool = new Pool({

  user: 'vbztcgctcznpgl',
  host: 'ec2-54-235-92-244.compute-1.amazonaws.com',
  database: 'd6n2rc7g8va9cu',
  password: '938489f15ca803d3137bb22717daa986e86adf25a88d97f4061e74ab6d541f70',
  port: 5432













  // user: 'postgres',
  // host: 'localhost',
  // database: 'PMS',
  // password: '1234',
  // port: 5432
});

var signinRouter = require('./routes/signin')(pool);
var projectRouter = require('./routes/projects')(pool);
var usersRouter = require('./routes/users')(pool);
var profileRouter = require('./routes/profile')(pool);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "hayolo",
  resave: false,
  saveUninitialized: true
}));

app.use(function (req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use(flash());
app.use(fileUpload());

app.use('/', signinRouter);
app.use('/projects', projectRouter);
app.use('/users', usersRouter);
app.use('/profile', profileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
