/**
 * 
 * @param io from socket.io 
 */
let removeRequestContactReceived = (io) => {
  /**
   * Idea: Tạo 1 đối tượng có giá trị là 1 mảng, 1 user mới đăng nhập vào 
   * chúng ta sẽ cho nó có 1 mảng, mảng chứa các socketid user đó có (Trường hợp 1 user mở nhiều tab)
   * sau cùng nếu user disconntect(1 tab chẳng) chúng ta sẽ clear cái socketid đó ra khỏi mảng user đó
   *  */
  let clients = {};

  io.on('connection', (socket) => {
    let currentUserId = socket.request.user._id;
    //Nếu user đã đăng nhập vào
    if(clients[currentUserId]) {
      clients[currentUserId].push(socket.id);
    }
    else{//Không thì tạo mới 
      clients[currentUserId] = [socket.id];
    }
    socket.on('remove-request-contact-received', (data) => {
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar
      };

     if(clients[data.contactId]) {
       clients[data.contactId].forEach((socketId) => {
        io.sockets.connected[socketId].emit('response-remove-request-contact-received', currentUser);
       });
     }
    });

    socket.on('disconnect', () => {
      //Nếu mảng của user đó không còn thì xóa luôn user
      if(!clients[currentUserId].length) {
        delete clients[currentUserId];
      }
      else{
      //Xóa những socketId dư vì nhũng socketId đó không còn online thì là trash
      clients[currentUserId] = clients[currentUserId].filter(socketId => socketId !== socket.id);
      };
    });
  })
}

module.exports = removeRequestContactReceived;