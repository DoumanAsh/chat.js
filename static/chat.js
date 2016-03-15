var socket = io()
var form;
var message_box;
function submit() {
    socket.emit('chat message', form.msg.value);
    message_box.appendChild(createMsg(form.msg.value));
    form.msg.value = ""
}

function createMsg(msg) {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(msg));
    return li;
}

window.onload = function() {
    form = document.getElementById('ff');
    message_box = document.getElementById('messages');

    form.addEventListener("submit", submit);

    socket.on('left', function(msg) {
        message_box.appendChild(createMsg(">Someone left chat :("));
    });

    socket.on('enter', function(msg){
        message_box.appendChild(createMsg(">Someone entered chat"));
    });

    socket.on('chat message', function(msg){
        message_box.appendChild(createMsg(msg));
    });
}
