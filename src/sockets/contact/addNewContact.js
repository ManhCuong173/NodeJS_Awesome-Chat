import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from '../../helpers/socketHelper'
/**
 * 
 * @param io from socket.io 
 */
let addNewContact = (io) => {
  /**
   * Idea: Tạo 1 đối tượng có giá trị là 1 mảng, 1 user mới đăng nhập vào 
   * chúng ta sẽ cho nó có 1 mảng, mảng chứa các socketid user đó có (Trường hợp 1 user mở nhiều tab)
   * sau cùng nếu user disconntect(1 tab chẳng) chúng ta sẽ clear cái socketid đó ra khỏi mảng user đó
   *  */
  let clients = {};

  io.on('connection', (socket) => {
    let currentUserId = socket.request.user._id;
    //Function xử lý đưa socket.id vào mảng user connected socket
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

    socket.on('add-new-contact', (data) => {
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar
      };
      if(clients[data.contactId]) {
        //Function xử lý trả về thông báo cho client nếu có new notification
        clients = emitNotifyToArray(clients, currentUser, io, "response-add-new-contact",data.contactId);
      }
    });
    socket.on('disconnect', () => {
      clients =  removeSocketIdFromArray(clients, socket.request.user._id, socket.id);
    });
  });
}

module.exports = addNewContact;