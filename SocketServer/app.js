var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('./util/jwtFactory');

var index = require('./routes/index');
var auth = require('./routes/auth');
var main = require('.//routes/main');

var http = require('http');

var app = express();


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

app.use('/', index);
app.use('/auth', auth);
app.use('/main', main);

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

///////////////////////////////////////////////////////////////////////////
// 이 아래로는 서버 구동
///////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(8000, function(){
    console.log('server started');
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(client){
    console.log('client connected');
    console.dir(client);
    
    client.on('clientMessage', function(err, msg){
       console.log('client says : ' + msg);
        console.log(JSON.parse(msg).clientMessage);
    });
    
    client.on('disconnect', function () {
        //io.emit('user disconnected');
        console.log('client disconnected');
    });
    client.emit('serverMessage', {message : 'hello client'});
});