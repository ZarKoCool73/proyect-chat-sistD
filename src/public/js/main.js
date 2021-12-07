
let userChat = ''
let currentUser = ''
const $userContent=document.getElementById('content-user');
const $userPrivado =document.getElementById('messageUser');
function getUser(user){
  if (user !== currentUser){
    $userPrivado.setAttribute('value',user + ':');
    $userPrivado.style.display = 'inline-block';
    $userContent.style.display = 'inline-block';
    userChat = '/w ' + user + ' '
  }

}

$userContent.addEventListener('click',()=>{
  $userPrivado.setAttribute('value','');
  $userPrivado.style.display = 'none';
  $userContent.style.display = 'none';
  userChat = ''
})

$ (function (){
    const socket = io();

    //OBTENIENDO LOS ELEMENTOS DEL DOOM DESDE LA INTERFAZ
    const $messageForm=$('#message-form');
    const $messageBox=$('#message');
    const $chat=$('#chat');

    //OBTENIENDO DATOS DESDE EL nicknameFORM
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname= $('#nickname');
    let $sala
    const $users = $('#usernames');
    const $grupoChat = document.getElementById('grupoChat');
    const $nombreSala = document.getElementById('nombreSala');

    $nickForm.submit(e=>{
      e.preventDefault();
      socket.emit('new user',{nickname: $nickname.val(), sala: $sala}, data=> {
        if(data){
          currentUser = $nickname.val()
          $('#nickWrap').hide();
          $('#contentWrap').show();
        }else{
          $nickError.html(`
            <div class="alert alert-danger">
            Usuario ya existente.
            </div>
            `);
        }
        $nickname.val('');
      });
    });
    //EVENTOS

    $messageForm.submit(e=> {
      e.preventDefault();
      if (userChat !== ''){
        $chat.append(`<p class="whisper"><b>${currentUser}:</b>${$messageBox.val()}</p>`);
      }
      socket.emit('send message',{msg: $messageBox.val(), sala: $sala, user: userChat}, data =>{
        $chat.append(`<p class="error">${data}</p>`)
      });
      $messageBox.val('');
    });

    socket.on('new message',function (data) {
      if (data.grupo == $sala) {
        $chat.append('<b>'+data.nick+'</b>: '+data.msg +'<br/>');
      }
    });

    socket.on('usernames',data => {
      let html='';
      console.log('current user', currentUser)
      for(let i=0; i<data.userList.length;i++){
        if (data.objtUser[i].sala == $sala && data.userList[i] !== currentUser ) {
          html +=`<p onClick="getUser('${data.userList[i]}')"><i class="fas fa-user"></i> ${data.userList[i]}</p>`
        }
      }
        html +=`<p id="currentUser"><b>Nombre del usuario:</b> <br><i class="fas fa-user"></i>${currentUser}</p>`
        $users.html(html);
    });

    socket.on('whisper', data=> {
      $chat.append(`<p class="whisper"><b>${data.nick}:</b>${data.msg}</p>`);
    })

    socket.on('load old msgs',msgs=>{
      for (let i =0 ; i<msgs.length;i++){
        displayMsg(msgs[i]);
      }
    })
    function displayMsg(data){
      $chat.append(`<p class="whisper"><b>${data.nick}:</b>${data.msg}</p>`);
    }

    $grupoChat.addEventListener('change',
    function(){
      let btnSubmit = document.getElementById('btnSelectRoom');
      btnSubmit.removeAttribute('disabled')
      var selectedOption = this.options[$grupoChat.selectedIndex];
      $nombreSala.append(selectedOption.text);

      $sala = selectedOption.text;
    });
})
