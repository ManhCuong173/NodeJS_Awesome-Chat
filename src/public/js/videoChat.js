function videoChat(divId) {
  $(`#video-chat-${divId}`).bind('click', function () {
    let targetId = $(this).data('chat');
    let callerName = $('#navbar-username').text();

    let dataToEmit = {
      listenerId: targetId,
      callerName: callerName
    }

    //Step 01 of caller 
    socket.emit('caller-check-listener-online-or-not', dataToEmit)

  })
}

$(document).ready(function () {
  //Step 02 of caller
  socket.on('server-send-listener-is-offline', function () {
    alertify.notify('Người dùng này hiện không trực tuyến', 'error', 7);
  });

  let getPeerId = '';
  const peer = new Peer();
  peer.on('open', function (peerId) {
    getPeerId = peerId
  });

  //Step 03 of listener 
  socket.on('server-request-peer-id-of-listener', function (response) {
    //Get name of listener 
    listenerName = $('#navbar-username').text();
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: listenerName,
      listenerPeerId: getPeerId
    }

    //Step 04 of listener
    socket.emit('listener-emit-peer-id-to-server', dataToEmit);
  })

  //Step 05 of caller
  socket.on('server-send-peer-id-of-listener-to-caller', function (response) {

    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    }

    //Step 06 of caller
    socket.emit('caller-request-call-to-server', dataToEmit);

    let timeInterval;
    Swal.fire({
      title: `<i class='fa fa-volume-control-phone'></i> &nbsp;${response.listenerName}`,
      html: `Cuộc gọi tự động kết thúc trong : <strong></strong>
        <br><br>
        <button id='btn-cancel-call' class='btn btn-danger'>Cancel</button>
        `,
      showConfirmButton: true,
      width: '52rem',
      backdrop: 'rgba(85,85,85,0.4)',
      //Not allow click section outside the swal modal
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        $('#btn-cancel-call').unbind('click').on('click', function () {
          Swal.close();
          clearInterval(timeInterval);

          socket.emit('caller-cancel-request-call-to-server', dataToEmit);
        })

        Swal.showLoading();
        timeInterval = setInterval(() => {
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        }, 1000);
      },

      onOpen: () => {

        //Step 12 of listener
        socket.on('server-send-reject-request-call-to-caller', function(response) {
          Swal.close();
          clearInterval(timeInterval);

          Swal.fire({
            type:'error',
            icon: 'error',
            title: `<span style="color:"#2ECC71"">${response.listenerName}</span> &nbsp; hiện không thể nghe máy !`,
            backdrop: 'rgba(85, 85, 85, 0.4',
            width: '52rem',
            showConfirmButton: true,
            confirmButtonColor: '#2ECC71',
            confirmButtonText: "Ok"
          })
        });

        socket.on('server-send-accept-request-call-to-caller', function(response) {
          Swal.close();
          clearInterval(timeInterval);
          console.log("Caller Ready");
          
        })
      },

      onClose: () => {
        clearInterval(timeInterval);
      }
    }).then((result) => {
      return false;
    })
  });

  //Step 08 of listener
  socket.on('server-send-request-call-to-listener', function(response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    }

    let timeInterval;
    Swal.fire({
      title: `<i class='fa fa-volume-control-phone'></i> &nbsp;${response.callerName} calling `,
      html: `Please wait in : <strong></strong>
        <br><br>
        <button id='btn-accept-call' class='btn btn-success'>Accept</button>
        <button id='btn-reject-call' class='btn btn-danger'>Cancel</button>
        `,
      showConfirmButton: true,
      width: '52rem',
      backdrop: 'rgba(85,85,85,0.4)',
      //Not allow click section outside the swal modal
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        Swal.showLoading();
        timeInterval = setInterval(() => {
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        }, 1000);
      },
      onOpen: () => {
        //Step 09 of listener
        socket.on('server-send-cancel-request-call-to-listener', function() {
          Swal.close();
          clearInterval(timeInterval);
        });

        $('#btn-reject-call').unbind('click').on('click', function () {
          Swal.close();
          clearInterval(timeInterval);
          
          //Step 10 of listener
          socket.emit('listener-reject-request-call-to-server', dataToEmit);
        })
                
        $('#btn-accept-call').unbind('click').on('click', function () {
          Swal.close();
          clearInterval(timeInterval);
          //Step 11 of listener
          socket.emit('listener-accept-request-call-to-server', dataToEmit);
        })

        socket.on('server-send-accept-request-call-to-listener', function(response) {
          console.log("Listener Ready");       
        })

      },
      onClose: () => {
        clearInterval(timeInterval);
      }
    }).then((result) => {
      return false;
    })
  });
});