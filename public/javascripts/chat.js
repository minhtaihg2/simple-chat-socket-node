  var chatUserConnect = io.connect('/chatUserConnect');
  var chatUserMessage = io.connect('/chatUserMessage');
  var chatUserID = io.connect('/chatUserID');
  var userJoin;
  var date;

  var user = prompt('Nhập tên trước khi tham gia :');
  var obUser = {};

  function selectUser(username, id) {
      obUser.username = username;
      obUser.id = id;
      $('#choice-room').text('@' + username);
  };

  function selectAll() {
      obUser = {};
      $('#choice-room').text('@Tất cả');
  }

  $(document).ready(function() {


      $('#choice-room').text('@Tất cả');
      chatUserConnect.emit('user:login', {
          username: user
      });



      chatUserConnect.on('user:view', function(data) {
          date = new Date();
          userJoin = date + ' ' + data.username + ' đã tham gia phòng...';
          var li = '<li onclick="selectUser(' + "'" +data.username + "','"  + data.id + "'" + ')">';
          $('#list-users').append($(li).text(data.username));

          $('#list-msg').append($('<i class="room">').text(userJoin));
      });

      $('#content_mes').keypress(function(event) {
          var keycode = (event.keyCode ? event.keyCode : event.which);
          if (keycode == '13') {
              if (Object.keys(obUser).length === 0) {
                  chatUserMessage.emit('msg', {
                      msg: $('#content_mes').val(),
                      user: user
                  });

                  $('#list-msg').append($('<strong style="width: 100%;" class="text-right">').text(user));
                  $('#list-msg').append($('<li>').text($('#content_mes').val()));
                  $('#content_mes').val('');
              } else {
                  obUser.message = $('#content_mes').val();
                  chatUserID.emit('chatting', obUser);
                  $('#list-msg').append($('<strong style="width: 100%;color:red" class="text-right">').text(user));
                  $('#list-msg').append($('<li style="color:red">').text($('#content_mes').val()));
                  $('#content_mes').val('');
              }
          }

      });

      $('#btn-click').click(function() {
          console.log(obUser);
          chatUserMessage.emit('msg', {
              msg: $('#content_mes').val(),
              user: user
          });

          $('#list-msg').append($('<strong style="width: 100%;" class="text-right">').text(user));
          $('#list-msg').append($('<li>').text($('#content_mes').val()));

          $('#content_mes').val('');
      });

      chatUserMessage.on('user:send', function(msg) {
          $('#list-msg').append($('<strong style="float: right;width: 100%;color : rgb(87, 87, 162);" class="text-right">').text(msg.user));
          $('#list-msg').append($('<li class="text-right" style="float: right;">').text(msg.msg));
      });

      chatUserID.on('chat', function(msg) {
          $('#list-msg').append($('<strong style="float: right;width: 100%;color :red;" class="text-right">').text('@' + msg.username));
          $('#list-msg').append($('<li style="color:red" class="text-right" style="float: right;">').text(msg.message));
      });

  });
