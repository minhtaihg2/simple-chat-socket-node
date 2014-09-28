module.exports = function(httpServer, port, listUser) {
    var io = require('socket.io').listen(httpServer, {
        origins: "*:" + port,
        transports: ['polling', 'websocket']
    });
    var chatUserConnect,
        chatUserMessage,
        chatUserID;


    chatUserConnect = io.of('/chatUserConnect').on('connection', function(socket) {
        socket.on('user:login', function(data) {
            var obUser = {
                username: data.username,
                id: socket.id
            };
            listUser.push(obUser);
            socket.broadcast.emit('user:view',obUser);
        });

        socket.on('disconnect', function() {
           
            for(var i = 0; i < listUser.length; i ++){
                if(listUser[i].id == socket.id){
                    console.log('User disconnect : ', listUser[i].username);
                    listUser.splice(i,1);
                }
            }
        })

    });

    chatUserMessage = io.of('/chatUserMessage').on('connection', function(socket) {
        socket.on('msg', function(data) {
            socket.broadcast.emit('user:send', {
                msg: data.msg,
                user: data.user
            })
        })
    });

    chatUserID = io.of('/chatUserID').on('connection', function(socket) {
            socket.on('chatting',function(data){
                socket.broadcast.to(data.id).emit('chat',data);
            })
    });

};
