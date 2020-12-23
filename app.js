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
app.use('/tile2', express.static(path.join(__dirname, '/assets/tiles/2.png')));
app.use('/tile3', express.static(path.join(__dirname, '/assets/tiles/3.png')));
app.use('/tile4', express.static(path.join(__dirname, '/assets/tiles/4.png')));
app.use('/tile5', express.static(path.join(__dirname, '/assets/tiles/5.png')));
app.use('/windmill/tile0', express.static(path.join(__dirname, '/assets/tiles/windMillAnimation/0.png')));
app.use('/windmill/tile1', express.static(path.join(__dirname, '/assets/tiles/windMillAnimation/1.png')));
app.use('/windmill/tile2', express.static(path.join(__dirname, '/assets/tiles/windMillAnimation/2.png')));
app.use('/windmill/tile3', express.static(path.join(__dirname, '/assets/tiles/windMillAnimation/3.png')));
app.use('/windmill/tile4', express.static(path.join(__dirname, '/assets/tiles/windMillAnimation/4.png')));
app.use('/ways/tile0', express.static(path.join(__dirname, '/assets/tiles/ways/0.png')));
app.use('/ways/tile1', express.static(path.join(__dirname, '/assets/tiles/ways/1.png')));
app.use('/ways/tile2', express.static(path.join(__dirname, '/assets/tiles/ways/2.png')));
app.use('/ways/tile3', express.static(path.join(__dirname, '/assets/tiles/ways/3.png')));
app.use('/ways/tile4', express.static(path.join(__dirname, '/assets/tiles/ways/4.png')));
app.use('/ways/tile5', express.static(path.join(__dirname, '/assets/tiles/ways/5.png')));
app.use('/ways/tile6', express.static(path.join(__dirname, '/assets/tiles/ways/6.png')));
app.use('/ways/tile7', express.static(path.join(__dirname, '/assets/tiles/ways/7.png')));
app.use('/ways/tile8', express.static(path.join(__dirname, '/assets/tiles/ways/8.png')));
app.use('/ways/tile9', express.static(path.join(__dirname, '/assets/tiles/ways/9.png')));
app.use('/chrc0', express.static(path.join(__dirname, '/assets/characters/0.png')));
app.use('/chrc1', express.static(path.join(__dirname, '/assets/characters/1.png')));
app.use('/chrc2', express.static(path.join(__dirname, '/assets/characters/2.png')));
app.use('/chrc3', express.static(path.join(__dirname, '/assets/characters/3.png')));
app.use('/chrc4', express.static(path.join(__dirname, '/assets/characters/4.png')));
app.use('/chrc5', express.static(path.join(__dirname, '/assets/characters/5.png')));
app.use('/chrc6', express.static(path.join(__dirname, '/assets/characters/6.png')));
app.use('/chrc7', express.static(path.join(__dirname, '/assets/characters/7.png')));
app.use('/chrc8', express.static(path.join(__dirname, '/assets/characters/8.png')));
app.use('/chrc9', express.static(path.join(__dirname, '/assets/characters/9.png')));
app.use('/chrc10', express.static(path.join(__dirname, '/assets/characters/10.png')));
app.use('/chrc11', express.static(path.join(__dirname, '/assets/characters/11.png')));
app.use('/chrc12', express.static(path.join(__dirname, '/assets/characters/12.png')));
app.use('/chrc13', express.static(path.join(__dirname, '/assets/characters/13.png')));
app.use('/chrc14', express.static(path.join(__dirname, '/assets/characters/14.png')));
app.use('/chrc15', express.static(path.join(__dirname, '/assets/characters/15.png')));
app.use('/chrc16', express.static(path.join(__dirname, '/assets/characters/16.png')));
app.use('/chrc17', express.static(path.join(__dirname, '/assets/characters/17.png')));
app.use('/chrc18', express.static(path.join(__dirname, '/assets/characters/18.png')));
app.use('/chrc19', express.static(path.join(__dirname, '/assets/characters/19.png')));
app.use('/chrc20', express.static(path.join(__dirname, '/assets/characters/20.png')));
app.use('/chrc21', express.static(path.join(__dirname, '/assets/characters/21.png')));
app.use('/chrc22', express.static(path.join(__dirname, '/assets/characters/22.png')));
app.use('/chrc23', express.static(path.join(__dirname, '/assets/characters/23.png')));
app.use('/coin0', express.static(path.join(__dirname, '/assets/coins/coin0.png')));
app.use('/coin1', express.static(path.join(__dirname, '/assets/coins/coin1.png')));
app.use('/coin2', express.static(path.join(__dirname, '/assets/coins/coin2.png')));
app.use('/coin3', express.static(path.join(__dirname, '/assets/coins/coin3.png')));
app.use('/bullet', express.static(path.join(__dirname, '/assets/environments/bullet.png')));
app.use('/stone', express.static(path.join(__dirname, '/assets/environments/stone.png')));

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
