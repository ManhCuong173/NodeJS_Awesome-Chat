import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper'
/**
 * 
 * @param io from socket.io 
 */
let chatAttachmentFile = (io) => {
  /**
   * Idea: Tạo 1 đối tượng có giá trị là 1 mảng, 1 user mới đăng nhập vào 
   * chúng ta sẽ cho nó có 1 mảng, mảng chứa các socketid user đó có (Trường hợp 1 user mở nhiều tab)
   * sau cùng nếu user disconntect(1 tab chẳng) chúng ta sẽ clear cái socketid đó ra khỏi mảng user đó
   *  */
  let clients = {};

  io.on('connection', (socket) => {
    //Function xử lý đưa socket.id vào mảng user connected socket
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    socket.request.user.chatGroupIds.forEach( groupId => {
      clients = pushSocketIdToArray(clients, groupId._id, socket.id);
    })
    
    socket.on('chat-attachment', (data) => {
      if (data.groupId) {   
        let response = {
          currentGroupId: data.groupId,
          currentUserId: socket.request.user._id,
          message: data.message,
        }

        if (clients[data.groupId]) {
          clients = emitNotifyToArray(clients,data.groupId, io, "response-chat-attachment", response);
        }
      }
      if (data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message,
        }

        if (clients[data.contactId]) {
          clients = emitNotifyToArray(clients,data.contactId, io, "response-chat-attachment",response);
        }
      }
    });
    socket.on('disconnect', () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket.id);
      socket.request.user.chatGroupIds.forEach( groupId => {
        clients = removeSocketIdFromArray(clients, groupId._id, socket.id);
      })
    });
  });
}

module.exports = chatAttachmentFile;