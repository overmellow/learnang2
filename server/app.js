var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config'); // get our config file

var token = require('./token')

mongoose.connect(config.database); // connect to database

var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var conversations = require('./routes/conversations');

var app = express();

var socket_io = require( "socket.io" );
var io = socket_io();
app.io = io;
var ioroutes = require('./routes/io')(io);
app.use('ioroutes', ioroutes);

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', auth);

// route middleware to verify a token
app.use(token);

app.use('/', index);
app.use('/users', users);
app.use('/conversations', conversations);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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