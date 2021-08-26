window.onload = function(){
  //verifica a conexão do usuário e caso ele não tenha conexão retorna false
  //e caso tenha conexao retorna true
  function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.NONE]= 1;
  
    if(states[networkState] == 1){
      return false;
    }else{
      return true;
    }
}

  const cadastrar = document.querySelector("#cadastrar");
  const nome = document.querySelector("#nome");
  const curso = document.querySelector("#curso");
  const buscar = document.querySelector("#buscar");
  const id = document.querySelector("#id");
  const alterar = document.querySelector("#alterar");
  const deletar = document.querySelector("#deletar");
  const buscarCodigo = document.querySelector("#buscarCodigo");

  function retornoErro(buttonIndex){
      if(buttonIndex==2){
        navigator.app.exitApp();
      }else{
        return false;
      }
  }

  function alertaGeral(mensagem){
    navigator.notification.confirm(
        mensagem,
        retornoErro,
        'Erro de Conexão',
        ['Ficar','Sair']
        );
  }

  //ação de cadastrar uma pessoa e curso
  cadastrar.addEventListener("click", function(){
    if(checkConnection()){
      let formdata = new FormData();
      formdata.append('nome',`${nome.value}`);
      formdata.append('curso',`${curso.value}`);

      fetch("https://www.jussimarleal.com.br/exemplo_api/pessoa",
        {
          body: formdata,
          method:"post",
          mode:'cors',
          cache:'default'
        }).then(()=>{
                alert("Registro efetuado com Sucesso");
                limparCampos();
            }
          
        );
    }else{
      alertaGeral("Você esta sem conexão tente realizar esse cadastro mais tarde");
    }
  });
  //metodo que listar uma pessoa
  buscar.addEventListener("click", function(){
    if(checkConnection()){
      fetch(`https://www.jussimarleal.com.br/exemplo_api/pessoa/${id.value}`,{
        method:"get",
        mode:'cors',
        cache:'default'
      }).then(response=>{
        response.json().then(data => {
          nome.value = data['nome'];
          curso.value = data['curso'];
        })
      })
    }else{
      navigator.notification.confirm(
        "Você esta sem conexão tente realizar essa consulta mais tarde",
        retornoErro,
        'Erro de Conexão',
        ['Ficar','Sair']
        );
    }
  })
  //metodo para alterar od dados dos registros
  alterar.addEventListener("click", function(){
    if(checkConnection()){
    fetch(`https://www.jussimarleal.com.br/exemplo_api/pessoa/${id.value}`,{
      method:"put",
      mode:'cors',
      cache:'default',
      headers:{
        'Content-type':'application/json; charset=UTF-8'
      },
      body:JSON.stringify({
        'nome':`${nome.value}`,
        'curso':`${curso.value}`
      })
    }).then(()=>{
      
      alert("Registro Alterado com Sucesso")
      limparCampos();
    });
    }else{
      navigator.notification.confirm(
        "Você esta sem conexão tente realizar essa alteração mais tarde",
        retornoErro,
        'Erro de Conexão',
        ['Ficar','Sair']
        );
    }
  });
  //metodo para deletar um registro
  deletar.addEventListener("click", function(){
    if(checkConnection()){
    fetch(`https://www.jussimarleal.com.br/exemplo_api/pessoa/${id.value}`,{
      method:"delete",
      mode:'cors',
      cache:'default'
    }).then(()=>{
      alert("Registro alterado com sucesso!");
      limparCampos();
    });
    }else{
      navigator.notification.confirm(
        "Você esta sem conexão tente realizar essa remoção mais tarde",
        retornoErro,
        'Erro de Conexão',
        ['Ficar','Sair']
        );
    }
  })

  //metodo para limpar os campos
  function limparCampos(){
    nome.value = "";
    curso.value = "";
  }

  buscarCodigo.addEventListener("click", function(){
     if(checkConnection()){
     cordova.plugins.barcodeScanner.scan(
      function (result) {
            fetch(`https://www.jussimarleal.com.br/exemplo_api/pessoa/${result.text}`,{
            method:"get",
            mode:'cors',
            cache:'default'
          }).then(response=>{
            response.json().then(data => {
              id.value = data['id'];
              nome.value = data['nome'];
              curso.value = data['curso'];
            })
          })
      },
      function (error) {
          alert("Scanning failed: " + error);
      },
      {
          preferFrontCamera : false, // iOS and Android
          showFlipCameraButton : true, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: true, // Android, launch with the torch switched on (if available)
          saveHistory: true, // Android, save scan history (default false)
          prompt : "Place a barcode inside the scan area", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
      }
   );
   }else{
      navigator.notification.confirm(
        "Você esta sem conexão tente realizar essa consulta mais tarde",
        retornoErro,
        'Erro de Conexão',
        ['Ficar','Sair']
        );
    }
  })
}
