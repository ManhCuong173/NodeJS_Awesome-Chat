export let pushSocketIdToArray = (clients, userId, socketId) => {
  //Nếu user đã đăng nhập vào
  if(clients[userId]) {
    clients[userId].push(socketId);
  }
  else{//Không thì tạo mới 
    clients[userId] = [socketId];
  }
  
  return clients;
};
export let emitNotifyToArray = (clients, dataId, io, eventName,currentUser) => {

  clients[dataId].forEach((socketId) => {
    io.sockets.connected[socketId].emit(eventName,currentUser);
  });

  return clients;
}
export let removeSocketIdFromArray = (clients, userId, socketIdConnect) => {
    //Nếu mảng của user đó không còn phần thì xóa luôn user
    if(!clients[userId].length) {
    delete clients[userId];
    } else{
    //Xóa những socketId dư vì nhũng socketId đó không còn online thì là trash
    clients[userId] = clients[userId].filter(socketId => socketId !== socketIdConnect);
    };
    return clients;
}