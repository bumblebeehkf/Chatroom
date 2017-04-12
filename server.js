var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(5000);

app.use(express.static(__dirname +'/public'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});


//存储所有用户socket对象的数组；
var allSocket = [];

io.on('connection', function (socket) {

        //用户登录后将其名字和对应的socket对象存储在allSocket数组里
        socket.on('join', function(userName) {
            var user = userName;
            allSocket[user] = socket;
        });

        //聊天室里的用户
        var room = ['Ben', 'CV', 'IT'];

        //私聊
        socket.on('sendPerson', function(data) {
            var target = allSocket[data.to];
            if(target) {
                target.emit('personMsg', data);
            }
        });

        //群聊，只发消息给群聊中的用户； 也应只接收群聊成员的消息
        socket.on('sendGroup', function(data) {
            //遍历群组的全部用户
            for(var i = 0; i < room.length; i++) {
                //遍历此时所有在线的用户
                for(var userName in allSocket) {
                    if(room[i] == userName) {
                        //取得该群组中每个在线成员的socket对象
                        var target = allSocket[userName];
                        if(target) {
                            target.emit('groupMsg', data);
                        }
                    }
                }
            }
        });

    });









