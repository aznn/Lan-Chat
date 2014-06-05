var socket = io();

socket.emit('user:add', 'browser');
socket.emit('message:new', 'browser says hi');
