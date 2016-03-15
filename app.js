var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const PORT = 8080;

var users_num = 0;

app.set('views', './views');
app.set('view engine', 'pug');
app.use('/', express.static(__dirname + '/static'));

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Some real time chat'
    });
});

io.on('connection', function(socket) {
    users_num += 1;
    console.log('>a user connected');
    socket.broadcast.emit('enter', null);

    io.emit("up_user_num", users_num);

    socket.on('disconnect', function(){
        console.log('>user disconnected');
        users_num -= 1;
        io.emit('left', {user_num: users_num});
    });

    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
      socket.broadcast.emit('chat message', msg);
    });
});

http.listen(PORT, function () {
    console.log('Start chat.js on port ' + PORT);
});
