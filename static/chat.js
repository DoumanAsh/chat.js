'use strict';
var socket = io();
var form;
var message_box;
var users_num;
var my_name = window.prompt("Please enter your name", "Anonym");

///Sends message to server.
function sendMsg() {
    socket.emit('chat message', form.msg.value);
    message_box.appendChild(createMsg(form.msg.value, my_name));
    form.msg.value = "";
}

///Creates list element with message.
function createMsg(msg, name) {
    var li = document.createElement("li");

    if (name) {
        var span_name = document.createElement("span");
        span_name.className += "bold";
        span_name.appendChild(document.createTextNode(name));
        li.appendChild(span_name);
        msg = ": " + msg;
    }
    li.appendChild(document.createTextNode(msg));
    return li;
}

///Adds message to chat window
function addMsg(msg, name) {
    message_box.appendChild(createMsg(msg, name));
}

function updateUserNum(num) {
    users_num.innerHTML = "Users online: " + num;
}

window.keydown = function(event) {
    //13 is ENTER press
    if (event.which === 13) {
        sendMsg();
    }
};

window.onload = function() {
    form = document.getElementById('ff');
    message_box = document.getElementById('messages');
    users_num = document.getElementById('users_num');

    form.addEventListener("submit", sendMsg);

    if (!my_name) {
        my_name = "Anonym";
    }

    document.getElementById('name').innerHTML = "Name: " + my_name;

    socket.emit("reg_user", my_name);

    socket.on("up_user_num", function(num) {
        updateUserNum(num);
    });

    socket.on("new_name", function(name) {
        document.getElementById('name').innerHTML = "Name: " + name;
        window.alert("Your name is already used. :(\nYou can stick with name: " + name);
    });

    socket.on('left', function(msg) {
        addMsg(">" + msg.user_name + " left chat :(");
        updateUserNum(msg.user_num);
    });

    socket.on('enter', function(name){
        addMsg(">" + name + " enters chat");
    });

    socket.on('chat message', function(msg){
        addMsg(msg.msg, msg.user_name);
    });
};
