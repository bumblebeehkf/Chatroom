var io = io.connect('http://localhost:5000');
var inputMsg = document.getElementById('inputMsg');
var message = document.getElementById('message');
var button = document.getElementById('button');

//页面载入后name的值
var inputName;

io.on('connect', function () {

    //点击发送按钮发出消息
    button.addEventListener('click', function sendMessage (e) {
        e.preventDefault();

        //账户名和私聊对象
        var name = document.getElementById('name').value;
        //改变全局inputName的值
        inputName = name;
        var friend = document.getElementById('friend').value;
        var room = document.getElementById('room').value;

        //把用户名发送给服务器
        io.emit('join', name);

        var msg = document.createElement('div');
        msg.innerHTML = name + ' : ' + inputMsg.value;
        msg.className = 'myMsg';
        message.appendChild(msg);

        //在私聊中发消息
        //io.emit('sendPerson', {from: name, to: friend, content: inputMsg.value});

        //在群聊中发消息
           //遍历数组确定用户是否在群聊数组中，在的话才能发送群组消息；
        if(inputName === 'CV' || inputName === 'IT' || inputName === 'Ben') {
            io.emit('sendGroup', {from: name, to: friend, content: inputMsg.value});
        };

        inputMsg.value = '';
        inputMsg.focus();
    }, false);


    //收取私聊消息
    io.on('personMsg' ,function(data) {
        var msg = document.createElement('div');
        msg.innerHTML = data.from + ':' + data.content;
        msg.className = 'friendMsg';
        message.appendChild(msg);
    });

    //收取群聊消息
    io.on('groupMsg', function(data) {
        //自己发出去的消息不显示
        if(data.from != inputName) {
            var msg = document.createElement('div');
            msg.innerHTML = data.from + ':' + data.content;
            msg.className = 'friendMsg';
            message.appendChild(msg);
        }
    });


    //回车发出消息
    document.onkeyup = function(e){
        var keyNum = window.event ? e.keyCode : e.which;
        if(keyNum == 13) {
            button.click();
        }
    };

});



var back = document.getElementById('back');
var left = document.getElementById('left');
var right = document.getElementById('right');

back.onclick = function() {
    left.style.display = 'block';
    right.style.display = 'none';
};








