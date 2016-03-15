'use strict';
var socket = io();
var form;
var message_box;
var users_num;
var my_name = window.prompt("Please enter your name", "Anonym");

function sendMsg() {
    socket.emit('chat message', form.msg.value);
    message_box.appendChild(createMsg(form.msg.value, my_name));
    form.msg.value = "";
}

function createMsg(msg, name) {
    var li = document.createElement("li");
    if (name) {
        msg = name + ": " + msg;
    }
    li.appendChild(document.createTextNode(msg));
    return li;
}

function updateUserNum(num) {
    users_num.innerHTML = "Users online: " + num;
}

window.keydown = function(event) {
    //13 is ENTER press
    if (event.which === 13) {
        sendMsg();
    }
}

window.onload = function() {
    form = document.getElementById('ff');
    message_box = document.getElementById('messages');
    users_num = document.getElementById('users_num');

    form.addEventListener("submit", sendMsg);

    if (!my_name) {
        my_name = "Anonym";
    }

    socket.emit("reg_user", my_name);

    socket.on("up_user_num", function(num) {
        updateUserNum(num);
    });

    socket.on('left', function(msg) {
        message_box.appendChild(createMsg(">" + msg.user_name + " left chat :("));
        updateUserNum(msg.user_num);
    });

    socket.on('enter', function(name){
        message_box.appendChild(createMsg(">" + name + " enters chat"));
    });

    socket.on('chat message', function(msg){
        message_box.appendChild(createMsg(msg.msg, msg.user_name));
    });
};
