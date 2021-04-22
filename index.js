var net = require('net');
 
//var HOST = '127.0.0.1';
const PORT = process.env.PORT || 6969;

Array.prototype.indexOf = function(val) { 
for (var i = 0; i < this.length; i++) { 
if (this[i] == val) return i; 
} 
return -1; 
};

Array.prototype.remove = function(val) { 
var index = this.indexOf(val); 
if (index > -1) { 
this.splice(index, 1); 
} 
};

var scks =[];

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
net.createServer(function(sock) {
 
    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);
    scks.push(sock);
    console.log('连接数:'+scks.length);
    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', function(data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // 回发该数据，客户端将收到来自服务端的数据
      for (var i = 0; i < scks.length; i++) { 
      if(scks[i]==sock){continue;}
      try
      {
        scks[i].write(data); 
      }
      catch(err)
      {
   //在此处理错误
      console.log('err:'+err)
      }
     } 
        //sock.write('You said "' + data + '"');
    });
 
        sock.on('error',(e)=>{
            console.log('====>',e.stack)
        });
    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function(data) {
        scks.remove(sock);
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
        console.log('连接数:'+scks.length);
    });
 
}).listen(PORT);
 
console.log('Server listening on ' + ':'+ PORT);