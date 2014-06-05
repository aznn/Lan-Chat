var socket = io("http://172.16.136.170:1337/");
var users = {};
var history = [];
var name = NAME || "Test-name";

socket.on('user:all', function(_users) {
    users = _users;
});

socket.on('message:new', function(msg) {
    var popup = chrome.extension.getViews().length != 1;

    if (popup) {
        chrome.extension.getViews()[1].insertMessage(msg);
    } else {
        chrome.notifications.create("msg" + (+new Date), {
            type: "basic",
            title: "New Message",
            message: "[" + msg.username + "] " + msg.message,
            iconUrl: "icon.png"
        }, function() {});
    }

    history.push(msg);
});

socket.emit('user:add', name);
socket.emit('user:all');

// messagign the popup


// called by the popup
function sendMessage(msg) {
    history.push({
        username: 'me',
        message: msg
    });

    socket.emit('message:new', msg);
}
