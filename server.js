var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 1337;

server.listen(port, function() {
    console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

// Chatroom
var usernames = {};
var numUsers = 0;

io.on('connection', function(socket) {
    var addedUser = false,
        typing = false;

    // request user to send name
    socket.emit('user:register');

    // sends user list
    function broadcastUserList() {
        socket.broadcast.emit('user:all', usernames);
    }

    socket.on('user:all', function() {
        socket.emit('user:all', usernames);
    });

    socket.on('message:new', function(msg) {
        if (socket.username === undefined) {
            socket.emit('user:register');
        }

        console.log(socket.username + ':' + msg);
        socket.broadcast.emit('message:new', {
            username: socket.username,
            message: msg
        });

        if (typing) {
            socket.broadcast.emit('user:typingstop', socket.username);
        }
    });

    socket.on('user:add', function(username) {
        console.log('Registered: ' + username);
        socket.username = username;

        usernames[username] = username;
        numUsers++;
        addedUser = true;

        broadcastUserList();
    });

    socket.on('user:typingstart', function() {
        console.log(socket.username + ' started typing');

        socket.broadcast.emit('user:typingstart', socket.username);
        typing = true;
    });

    socket.on('user:typingstop', function() {
        console.log(socket.username + ' stopped typing');

        socket.broadcast.emit('user:typingstop', socket.username);
        typing = false;
    });

    socket.on('disconnect', function() {
        console.log("--Disconnect");

        if(addedUser) {
            delete usernames[socket.username];
            numUsers--;

            broadcastUserList();
        }
    });

});
