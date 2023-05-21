var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const cors = require("cors");
const socket = require('socket.io')
dotenv.config()

var usersRouter = require('./routes/User/users');
var adminRouter = require('./routes/Admin/admin');


var app = express();

const corsOptions = {
  origin: 'https://bookletter.netlify.app',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

app.use(cors()) // Use this after the variable declaration`


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// mongoose.connect('mongodb://localhost:27017/LetterBox', { useNewUrlParser: true, useUnifiedTopology: true });
//MongoDB connection
const uri = process.env.MONGO_DB_URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("Connected to MongoDB"))
  .catch(error => console.log("Error connecting to MongoDB", error));



app.use('/', usersRouter);
app.use('/admin', adminRouter);

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


const PORT = process.env.PORT || 5000
const server = app.listen(PORT, console.log(`Port is running in http://localhost:${PORT}/`))

const io = socket(server, {
  cors: {
    origin: 'https://bookletter.netlify.app',
    credentials: true,
  },
});
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id)

  })


  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
})
module.exports = app;
