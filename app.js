require('./models/bddconnect');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./models/bddconnect')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var scrapRouter = require('./routes/scrapdata');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/scrapdata/', scrapRouter);

module.exports = app;
