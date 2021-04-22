//app.js

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

const webport = 3000;
const tcpport = 4545;
app.use(express.static("./public"));//路径指向 相对的文件夹路径


io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);

        io.emit('chat message', msg);
        for (var i = 0; i < scks.length; i++) {
            try {
                scks[i].write(msg);
            }
            catch (err) {
                //在此处理错误
                console.log('err:' + err)
            }
        }
    });

});

app.set('port', process.env.PORT || webport);//web port

var server = http.listen(app.get('port'), function () {
    console.log('web start at port:' + server.address().port);
});



var net = require('net');

//var HOST = '127.0.0.1';
const PORT = process.env.PORT || tcpport;//tcp port

Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

var scks = [];

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
net.createServer(function (sock) {

    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);
    scks.push(sock);
    console.log('连接数:' + scks.length);
    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', function (data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        io.emit("chat message", ab2str(data))//将数据发送到网页
        // 回发该数据，客户端将收到来自服务端的数据
        for (var i = 0; i < scks.length; i++) {
            if (scks[i] == sock) { continue; }
            try {
                scks[i].write(data);
            }
            catch (err) {
                //在此处理错误
                console.log('err:' + err)
            }
        }
        //sock.write('You said "' + data + '"');
    });

    sock.on('error', (e) => {
        console.log('====>', e.stack)
    });
    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function (data) {
        scks.remove(sock);
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
        console.log('连接数:' + scks.length);
    });

}).listen(PORT);

console.log('TCP Server listening on ' + ':' + PORT);