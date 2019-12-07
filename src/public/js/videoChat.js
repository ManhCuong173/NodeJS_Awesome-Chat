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

function playVideoStream(videoTagId, stream) {
  let video = document.getElementById(videoTagId);
  video.srcObject = stream;
  video.onloadeddata = function() {
    video.play();
  }
};

function closeVideoStream(stream) {
  return stream.getTracks().forEach(track => track.stop());
}

$(document).ready(function () {

  //Step 02 of caller
  socket.on('server-send-listener-is-offline', function () {
    alertify.notify('Người dùng này hiện không trực tuyến', 'error', 7);
  });

  //Get ice servers list
  let iceServersList = $('#ice-servers-list').text();

  let getPeerId = '';
  const peer = new Peer({
    key: 'peerjs',
    host: 'peerjs-server-trungquandev.herokuapp.com',
    secure: true,
    port: 443,
    // debug: 3,
    config: {'iceServers': JSON.parse(iceServersList)}
  });

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

  let timeInterval;

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

        if (Swal.getContent().querySelector !== null) {
          Swal.showLoading();
          timeInterval = setInterval(() => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }, 1000);
        }
      },

      onOpen: () => {

        //Step 12 of listener
        socket.on('server-send-reject-request-call-to-caller', function (response) {
          Swal.close();
          clearInterval(timeInterval);

          Swal.fire({
            type: 'error',
            icon: 'error',
            title: `<span style="color:"#2ECC71"">${response.listenerName}</span> &nbsp; hiện không thể trả lời cuộc gọi !`,
            backdrop: 'rgba(85, 85, 85, 0.4',
            width: '52rem',
            showConfirmButton: true,
            confirmButtonColor: '#2ECC71',
            confirmButtonText: "Ok"
          });
        });
      },

      onClose: () => {
        clearInterval(timeInterval);
      }
    }).then((result) => {
      return false;
    })
  });

  //Step 08 of listener
  socket.on('server-send-request-call-to-listener', function (response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    }

    Swal.fire({
      title: `<i class='fa fa-volume-control-phone'></i> &nbsp;${response.callerName} đang gọi  `,
      html: `Cuộc gọi tự động kết thúc trong : <strong></strong>
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
        if (Swal.getContent().querySelector !== null) {
          Swal.showLoading();
          timeInterval = setInterval(() => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }, 1000);
        }
      },
      onOpen: () => {
        //Step 09 of listener
        socket.on('server-send-cancel-request-call-to-listener', function () {
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
        });

      },
      onClose: () => {
        clearInterval(timeInterval);
      }
    }).then((result) => {
      return false;
    });
  });

  //Step 13 of caller
  socket.on('server-send-accept-request-call-to-caller', function (response) {
    console.log(response)
    Swal.close();
    clearInterval(timeInterval);

    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

    getUserMedia({video: true, audio: true}, function(stream) {
      //Show modal video call
      $('#streamModal').modal('show');

      //Play my stream in local
      playVideoStream('local-stream', stream);

      //Call to listener
      var call = peer.call(response.listenerPeerId, stream);
      // Listen and play stream of listener
      call.on('stream', function(remoteStream) {
        playVideoStream('remote-stream', remoteStream);
      });

      //Close modal remove stream
      $('#streamModal').on('hidden.bs.modal', function() {
        closeVideoStream(stream);
        Swal.fire({
          type: 'success',
          icon: 'success',
          title: `<span style="color:"#2ECC71"">Kết thúc cuộc gọi</span>`,
          backdrop: 'rgba(85, 85, 85, 0.4',
          width: '52rem',
          showConfirmButton: true,
          confirmButtonColor: '#2ECC71',
          confirmButtonText: "Ok"
        });
      });

    }, function(err) {
      if(err.toString() === 'NotAllowedError: Permission denied') {
        alertify.notify('Bạn đã tắt quyền cho phép truy cập vào thiết bị nghe gọi trên trình duyệt, vui lòng kiểm tra!', 'error', 7);
      };

      if(err.toString() === 'NotFoundError: Requested device not found') {
        alertify.notify('Không tìm thấy camera trên máy của bạn!', 'error', 7);
      }
    });
  });

  //Step 14 of listener
  socket.on('server-send-accept-request-call-to-listener', function (response) {
    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

    peer.on('call', function(call) {
      getUserMedia({video: true, audio: true}, function(stream) {
        //Show modal streaming
        $('#streamModal').modal('show');

        //Play stream in local of listener
        playVideoStream('local-stream', stream)

        call.answer(stream);
        call.on('stream', function(remoteStream) {
          playVideoStream('remote-stream', remoteStream);
        });

        
        //Close modal remove stream
        $('#streamModal').on('hidden.bs.modal', function() {
          closeVideoStream(stream);
          Swal.fire({
            type: 'success',
            icon: 'success',
            title: `<span style="color:"#2ECC71"">Kết thúc cuộc gọi</span>`,
            backdrop: 'rgba(85, 85, 85, 0.4',
            width: '52rem',
            showConfirmButton: true,
            confirmButtonColor: '#2ECC71',
            confirmButtonText: "Ok"
          });
        });
      }, function(err) {
        if(err.toString() === 'NotAllowedError: Permission denied') {
          alertify.notify('Bạn đã tắt quyền cho phép truy cập vào thiết bị nghe gọi trên trình duyệt, vui lòng kiểm tra!', 'error', 7);
        };
        if(err.toString() === 'NotFoundError: Requested device not found') {
          alertify.notify('Không tìm thấy camera trên máy của bạn!', 'error', 7);
        }
      });
    })
  })
});