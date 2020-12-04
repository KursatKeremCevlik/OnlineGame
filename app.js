var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.get('/', (req, res) => {res.sendFile(__dirname + '/CLIENT/index.html');});

app.use('/css', express.static(path.join(__dirname, '/CLIENT/index.css')));
app.use('/js', express.static(path.join(__dirname, '/CLIENT/app.js')));

app.use('/tile0', express.static(path.join(__dirname, '/assets/tiles/0.png')));
app.use('/tile1', express.static(path.join(__dirname, '/assets/tiles/1.png')));
app.use('/chrc0', express.static(path.join(__dirname, '/assets/characters/0.png')));
app.use('/chrc1', express.static(path.join(__dirname, '/assets/characters/1.png')));
app.use('/chrc2', express.static(path.join(__dirname, '/assets/characters/2.png')));
app.use('/chrc3', express.static(path.join(__dirname, '/assets/characters/3.png')));

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
