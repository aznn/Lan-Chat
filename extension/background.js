var socket = io("http://172.16.136.170:1337/");
var users = {};
var history = [];
var name = NAME || "Test-name";

function isPopup() {
    return chrome.extension.getViews().length != 1;
}

function getPopup() {
    return chrome.extension.getViews()[1];
}

socket.on('user:all', function(_users) {
    users = _users;

    if (isPopup())
        getPopup().setUserList();
});

socket.on('message:new', function(msg) {
    if (isPopup()) {
        getPopup().insertMessage(msg);
    } else {
        chrome.notifications.create("msg" + (+new Date()), {
            type: "basic",
            title: "New Message",
            message: "[" + msg.username + "] " + msg.message,
            iconUrl: "icon.png"
        }, function() {});
    }

    history.push(msg);
});

socket.on('connect', function() {
    socket.emit('user:add', name);
});

socket.on('reconnect', function() {
    socket.emit('user:add', name);
});

socket.on('user:register', function() {
    socket.emit('user:add', name);
});

// handle typing messages
socket.on('user:typingstart', function(username) {
    if (isPopup()) {
        getPopup().startTyping(username);
    }
});

socket.on('user:typingstop', function(username) {
    if (isPopup()) {
        getPopup().stopTyping(username);
    }
});

function startTyping() {
    socket.emit('user:typingstart');
}

function stopTyping() {
    socket.emit('user:typingstop');
}

// called by the popup
function sendMessage(msg) {
    history.push({
        username: 'me',
        message: msg
    });

    socket.emit('message:new', msg);
}
