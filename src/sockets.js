const Chat = require('./app/models/Chat');


module.exports = function(io){
  //arreglo almancenando nombres de usuario
  let users ={};
  let sala = ''
  let userList = []
 //CONEXION DE SOCKETS DEL SERVIDOR
  io.on('connection', socket=>{
    console.log('new user connected');
    console.log('sala:',sala)
    socket.on('new user',async (data,cb)=>{
      sala = data.sala
      let messages = await Chat.find({grupo: sala});
      socket.emit('load old msgs',messages);
      if(data.nickname in users){
        cb(false);
      }else{
        cb(true);
        socket.nickname =data.nickname;
        users[socket.nickname]=socket;
        userList.push({
          userName: socket.nickname,
          sala: data.sala
        })
        updateNicknames();
      }
    });

    socket.on('send message', async (data,cb)=> {
      var msg = data.user + data.msg.trim();
      sala = data.sala
      if(msg.substr(0, 3) === '/w '){
        msg = msg.substr(3);
        const index = msg.indexOf(' ');
        if(index !== -1){
          var name = msg.substring(0,index);
          var msg = msg.substring(index+1);
          if(name in users){
            users[name].emit('whisper',{
              msg,
              grupo: sala,
              nick:socket.nickname
            });
            
          }else{
            cb('Error! Por favor ingrese nombre de usuario valido');
          }
        }else{
          cb('Error! Por favor ingrese el mensaje');
        }
      }else{
        var newMsg = new Chat({
          msg,
          grupo: sala,
          nick:socket.nickname
        });
        await newMsg.save();
        io.sockets.emit('new message',{
          msg:data.msg,
          grupo: sala,
          nick:socket.nickname
        });
      }
    });

    socket.on('disconnect',data=> {
      if(!socket.nickname)return;
      delete users[socket.nickname];
      updateNicknames();
    });

    function updateNicknames() {
      io.sockets.emit('usernames',{userList: Object.keys(users), objtUser: userList});
    }

  });

}
