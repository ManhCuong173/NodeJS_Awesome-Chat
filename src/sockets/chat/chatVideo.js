import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper'
/**
 * 
 * @param io from socket.io 
 */
let chatVideo = (io) => {
  /**
   * Idea: Tạo 1 đối tượng có giá trị là 1 mảng, 1 user mới đăng nhập vào 
   * chúng ta sẽ cho nó có 1 mảng, mảng chứa các socketid user đó có (Trường hợp 1 user mở nhiều tab)
   * sau cùng nếu user disconntect(1 tab chẳng) chúng ta sẽ clear cái socketid đó ra khỏi mảng user đó
   *  */
  let clients = {};

  io.on('connection', (socket) => {
    //Function xử lý đưa socket.id vào mảng user connected socket
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    socket.request.user.chatGroupIds.forEach(groupId => {
      clients = pushSocketIdToArray(clients, groupId._id, socket.id);
    })

    socket.on('caller-check-listener-online-or-not', (data) => {
      if (clients[data.listenerId]) {
        //Online
        let response = {
          callerId: socket.request.user._id,
          listenerId: data.listenerId,
          callerName: data.callerName
        };

        emitNotifyToArray(clients, data.listenerId, io, 'server-request-peer-id-of-listener', response)
      } else {
        //Offline
        socket.emit('server-send-listener-is-offline')
      }
    });

    socket.on('listener-emit-peer-id-to-server', (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId
      }
      if (clients[data.callerId]) {
        emitNotifyToArray(clients, data.callerId, io, 'server-send-peer-id-of-listener-to-caller', response);
      }
    });

    socket.on('caller-request-call-to-server', (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId
      }
      if (clients[data.listenerId]) {
        emitNotifyToArray(clients, data.listenerId, io, 'server-send-request-call-to-listener', response);
      }
    });

    socket.on('caller-cancel-request-call-to-server', (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId
      }
      if (clients[data.listenerId]) {
        emitNotifyToArray(clients, data.listenerId, io, 'server-send-cancel-request-call-to-listener', response);
      }
    });

    //Step 10
    socket.on('listener-reject-request-call-to-server', (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId
      }
      if (clients[data.callerId]) {
        emitNotifyToArray(clients, data.callerId, io, 'server-send-reject-request-call-to-caller', response);
      }
    });

    //Step 12
    socket.on('listener-accept-request-call-to-server', (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId
      }

      if (clients[data.callerId]) {
        emitNotifyToArray(clients, data.callerId, io, 'server-send-accept-request-call-to-caller', response);
      }

      if (clients[data.listenerId]) {
        emitNotifyToArray(clients, data.listenerId, io, 'server-send-accept-request-call-to-listener', response);
      }

    });

    socket.on('disconnect', () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket.id);
      socket.request.user.chatGroupIds.forEach(groupId => {
        clients = removeSocketIdFromArray(clients, groupId._id, socket.id);
      })
    });

  });
}

module.exports = chatVideo;