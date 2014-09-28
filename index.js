var express = require('express'),
    app = express(),
    path = require('path'),
    server;
    listUser = [];

app.set('PORT', 8080);

app.set('view engine', 'ejs');

app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
    res.render('index', {
        title: 'Chat soket.io',
        user : listUser
    });
});

server = app.listen(app.set('PORT'), function() {
    console.log('chat socket.io open port : ', app.set('PORT'));
});


require('./socket_process')(server,app.set('PORT'),listUser);
