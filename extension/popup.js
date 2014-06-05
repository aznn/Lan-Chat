var usernames = document.getElementById("usernames");
var back = chrome.extension.getBackgroundPage();
var chatBox = document.getElementById('chatbox');
var chatLog = document.getElementById('chatlog');

chatbox.focus();
back.history.forEach(function(i) {
    insertMessage(i,true);
});


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
        if(chatBox.value.trim() == "")
        {
            return;
        }
        sendMessage(chatBox.value);
        chatBox.value = "";
    }
};

function insertMessage(msg, batch) {
    var li = document.createElement('li');

    if (msg.username == 'me') {
        li.classList.add('me');
    } else {
        li.classList.add('them');
    }

    li.innerHTML = msg.username + ": " + msg.message;
    if (!batch) li.classList.add('beforeadd');
    chatLog.appendChild(li);

    if (!batch) {
        setTimeout(function() {
            li.classList.remove('beforeadd');
        }, 250)
    }

    chatLog.scrollTop = chatLog.scrollHeight;
}

function sendMessage(msg) {
    var msgObj = {
        username: 'me',
        message: msg
    };

    insertMessage(msgObj);
    back.sendMessage(msg);

}
