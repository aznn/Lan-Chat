var usernames = document.getElementById("usernames");
var back = chrome.extension.getBackgroundPage();
var chatBox = document.getElementById('chatbox');
var chatLog = document.getElementById('chatlog');

// set userlist
(function() {
    var html = "";
    for (var user in back.users) {
        html += "<li>" + user + "</li>";
    }

    usernames.innerHTML = html;
})();

chatBox.onkeypress = function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13') {
        // enter key pressed
        sendMessage(chatBox.value);
        chatBox.value = "";
    }
};

function insertMessage(msg) {
    var li = document.createElement('li');

    if (msg.username == 'me') {
        li.classList.add('me');
    } else {
        li.classList.add('them');
    }

    li.innerHTML = msg.message;
    chatLog.appendChild(li);
}

function sendMessage(msg) {
    var msgObj = {
        username: 'me',
        message: msg
    };

    var html = '<li class="me">' + msg + '</li>';
    back.sendMessage(msg);

    chatLog.innerHTML += html;
}
