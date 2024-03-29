import addNewContact from './contact/addNewContact'
import removeRequestContactSent from './contact/removeRequestContactSent'
import removeRequestContactReceived from './contact/removeRequestContactReceived'
import approveRequestContactReceived from './contact/approveRequestContactReceived'
import removeContact from './contact/removeContact'
import chatTextEmoji from './chat/chatTextEmoji'
import typingOn from './chat/typingOn'
import typingOff from './chat/typingOff'
import chatImage from './chat/chatImage'
import chatAttachmentFile from './chat/chatAttachmentFile'
import chatVideo from './chat/chatVideo'

/**
 * 
 * @param {} io from socket.io lib 
 */
let initSockets = (io) => {
  addNewContact(io); 
  removeRequestContactSent(io);
  removeRequestContactReceived(io);
  approveRequestContactReceived(io);
  removeContact(io);
  chatTextEmoji(io);
  typingOn(io);
  typingOff(io);
  chatImage(io);
  chatAttachmentFile(io);
  chatVideo(io);
}

module.exports = initSockets;