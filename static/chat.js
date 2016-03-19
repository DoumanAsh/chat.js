'use strict';
var socket = io();
var form;
var message_box;
var users_num;
var my_name = window.prompt("Please enter your name", "Anonym");

///Sends message to server.
function sendMsg() {
    if (form.msg.value) {
        //Do not send empty message
        socket.emit('chat message', form.msg.value);
        message_box.appendChild(createMsg(form.msg.value, my_name));
        form.msg.value = "";
    }
}

///Creates li for messages
function createLi() {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode((new Date()).strftime("%H:%M:%S ")));
    return li;
}

///Creates system message
function createSys(msg) {
    var li = createLi();

    var span_name = document.createElement("span");
    span_name.className += "sys_msg";
    span_name.appendChild(document.createTextNode(msg));
    li.appendChild(span_name);

    return li;
}

///Sends warning msg to user.
function warningMsg(msg) {
    var li = createLi();

    var span_name = document.createElement("span");
    span_name.className += "sys_warning";
    span_name.appendChild(document.createTextNode(msg));
    li.appendChild(span_name);

    return li;

}

///Creates list element with message.
function createMsg(msg, name) {
    var li = createLi();

    if (name) {
        var span_name = document.createElement("span");

        span_name.className += "chat_name";
        span_name.onclick = function() {
            var text_box = document.getElementById('msg');
            text_box.value = text_box.value + name + ": ";
        };

        span_name.appendChild(document.createTextNode("<" + name + "> "));

        li.appendChild(span_name);
    }
    li.appendChild(document.createTextNode(msg));
    return li;
}

///Removes user_name from list of users.
function removeUser(user_name) {
    var user_list = document.getElementById('user_list');
    var el_name = document.getElementById(user_name);

    user_list.removeChild(el_name);
}

///Add user_name to list of users.
///Pass reference to user_list in case of loops
function addUserToList(user_name, user_list) {
    if (!user_list) {
        user_list = document.getElementById('user_list');
    }

    var li = document.createElement("li");
    var span_name = document.createElement("span");

    li.id = user_name;
    span_name.className += "chat_name";
    span_name.onclick = function() {
        var text_box = document.getElementById('msg');
        text_box.value = text_box.value + user_name + ": ";
        document.getElementById('msg').focus();
    };
    span_name.appendChild(document.createTextNode(user_name));

    li.appendChild(span_name);
    user_list.appendChild(li);
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

    socket.on("user_list", function(list) {
        var user_list = document.getElementById('user_list');

        for (var i = 0; i < list.length; i++) {
            var user_name = list[i];

            addUserToList(user_name, user_list);
        }
    });

    socket.on("new_name", function(name) {
        document.getElementById('name').innerHTML = "Name: " + name;
        message_box.appendChild(warningMsg("Your name is already used. You can stick with name: " + name));
        my_name = name;
    });

    socket.on('left', function(msg) {
        message_box.appendChild(createSys(msg.user_name + " left chat :("));
        updateUserNum(msg.user_num);
        removeUser(msg.user_name);
    });

    socket.on('enter', function(name){
        message_box.appendChild(createSys(name + " enters chat"));
        addUserToList(name);
    });

    socket.on('chat message', function(msg){
        message_box.appendChild(createMsg(msg.msg, msg.user_name));
    });

    document.getElementById('msg').focus();
};
