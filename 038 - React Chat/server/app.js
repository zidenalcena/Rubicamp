var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')


const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/reactdb', {
  useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true
});;

//Setting up express and adding socketIo middleware
const app = express();
const http = require("http").Server(app);
clientPort = 3001;

const connectSocket = http.listen(clientPort);

const io = require('socket.io')(connectSocket);

io.on("connection", socket => {

  socket.on('send-message', data => {

    io.emit('receive-message', data);
  
  });

  socket.on('delete-message', (userRemove) => {
    console.log('this socket server >');
    
    io.emit('deleted-message',userRemove);
  
  });
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', indexRouter);
app.use('/api/users', usersRouter);

module.exports = app;
