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
    socket.on("reg_user", function(name) {
        users_num += 1;

        for (var sock_id in io.sockets.connected) {
            if (io.sockets.connected[sock_id].username === name) {
                name = name + "_" + socket.id.slice(-4);
                socket.emit("new_name", name);
                break;
            }
        }

        socket.username = name;
        console.log('>a user connected');
        socket.broadcast.emit('enter', name);

        var user_list = [];

        for (var sock_id in io.sockets.connected) {
            if (io.sockets.connected[sock_id].username) {
                user_list.push(io.sockets.connected[sock_id].username);
            }
        }

        io.emit("up_user_num", users_num);
        socket.emit("user_list", user_list);

        socket.on('disconnect', function() {
            console.log('>user disconnected');
            users_num -= 1;
            io.emit('left', {user_name: socket.username, user_num: users_num});
        });

        socket.on('chat message', function(msg) {
          console.log('message: ' + msg);
          socket.broadcast.emit('chat message', {user_name: socket.username, msg: msg});
        });
    });
});

http.listen(PORT, function () {
    console.log('Start chat.js on port ' + PORT);
});
