'use strict';
var socket = io();
var form;
var message_box;
var users_num;

function submit() {
    socket.emit('chat message', form.msg.value);
    message_box.appendChild(createMsg(form.msg.value));
    form.msg.value = "";
}

function createMsg(msg) {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(msg));
    return li;
}

function updateUserNum(num) {
    users_num.innerHTML = "Users online: " + num;
}

window.onload = function() {
    form = document.getElementById('ff');
    message_box = document.getElementById('messages');
    users_num = document.getElementById('users_num');

    form.addEventListener("submit", submit);

    socket.on("up_user_num", function(num) {
        updateUserNum(num);
    });

    socket.on('left', function(msg) {
        message_box.appendChild(createMsg(">Someone left chat :("));
        updateUserNum(msg.user_num);
    });

    socket.on('enter', function(msg){
        message_box.appendChild(createMsg(">Someone entered chat"));
    });

    socket.on('chat message', function(msg){
        message_box.appendChild(createMsg(msg));
    });
};
