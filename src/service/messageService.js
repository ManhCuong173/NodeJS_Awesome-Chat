import ContactModel from './../models/contactModel'
import UserModel from './../models/userModel'
import ChatGroupModel from './../models/chatGroupModel'
import MessageModel from './../models/messageModel'
import { transError } from './../../lang/vi'
import { app } from './../config/app'
import _ from 'lodash'
import fsExtra from 'fs-extra'

let LIMIT_CONVERSATION_TAKEN = 10;
let LIMIT_MESSAGES_TAKEN = 30;
/**
 * Get All Conversation
 * @param {string} currentUserId 
 */
let getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATION_TAKEN);
      let usersConversationsPromise = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
          //Vì 2 dữ liệu từ 2 model này về cùng 1 kiểu dữ liệu từ mongo cho nên k cần chuyển đổi getUserContact về object để gán thêm property
          // => getUserContact.toObject(); được dùng để chuyển đổi
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
        else {
          let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
      });
      //Lấy dữ liệu trò chuyện cá nhân
      let userConversations = await Promise.all(usersConversationsPromise);
      //Lấy dữ liệu trò chuyện nhóm
      let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATION_TAKEN);
      //Nối 2 đối tượng về cùng 1 mảng
      let allConversations = userConversations.concat(groupConversations);

      //Sắp xếp từng phần tử
      allConversations = _.sortBy(allConversations, (item) => {
        //Dấu '-' sẽ sắp xếp theo chiều giảm dần
        return -item.updatedAt;
      });

      //Lấy tin nhắn hiển thị từng phần tử chat
      let allConversationWithMessagePromise = allConversations.map(async (conversation) => {
        conversation = conversation.toObject();
        if (conversation.members) {
          let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
          conversation.messages = getMessages.reverse();
        }
        else {
          let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
          conversation.messages = getMessages.reverse();
        }
        return conversation;
      })

      let allConversationWithMessages = await Promise.all(allConversationWithMessagePromise);

      allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
        return -item.updatedAt;
      })
      resolve({
        userConversations: userConversations,
        groupConversations: groupConversations,
        allConversations: allConversations,
        allConversationWithMessages: allConversationWithMessages
      });
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * Add new message text and emoji
 * @param {Object} sender 
 * @param {string} receiverId 
 * @param {string} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      //Check that sent up message is from group or not
      if (isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);

        //If not finding conversation
        if (!getChatGroupReceiver) {
          reject(transError.conversation_not_founded);
        }

        let receiver = {
          id: receiverId,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiverId,
          conversationType: MessageModel.conversationType.GROUP,
          messageType: MessageModel.messageType.TEXT,
          sender: sender,
          receiver:receiver,
          text: messageVal,
          createdAt: Date.now()
          
        };

        //Create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);      
        
        //Get Id of newest message
        let newestIdMessage = await MessageModel.model.getNewestIdMessage(newMessageItem.senderId, newMessageItem.receiverId, newMessageItem.conversationType, newMessageItem.messageType);
        newMessageItem._id = newestIdMessage._id;

        //Update group chat
        await ChatGroupModel.updateWhenHasNewMessage(receiverId, getChatGroupReceiver.messageAmount + 1);

        resolve(newMessageItem);
      }
      else {
        let getChatUserReceiver = UserModel.getNormalUserDataById(receiverId);
        if (!getChatUserReceiver) {
          reject(transError.conversation_not_founded);
        }

        let receiver = {
          id: getChatUserReceiver._id,
          name: getChatUserReceiver.username,
          avatar: getChatUserReceiver.avatar
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiverId,
          conversationType: MessageModel.conversationType.PERSONAL,
          messageType: MessageModel.messageType.TEXT,
          sender: sender,
          receiver:receiver,
          text: messageVal,
          createdAt: Date.now()
        };
        //Create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);

        //Get Id of newest message
        let newestIdMessage = await MessageModel.model.getNewestIdMessage(newMessageItem.senderId, newMessageItem.receiverId, newMessageItem.conversationType, newMessageItem.messageType);
        newMessageItem._id = newestIdMessage._id;

        //Update contact
        await ContactModel.updateWhenHasNewMessage(sender.id, getChatUserReceiver._id);

        resolve(newMessageItem);

      }
    } catch (error) {
      reject(error);
    }
  })
}

/**
 * Add new message image
 * @param {Object} sender 
 * @param {string} receiverId 
 * @param {file} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      //Check that sent up message is from group or not
      if (isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);

        //If not finding conversation
        if (!getChatGroupReceiver) {
          reject(transError.conversation_not_founded);
        }

        let receiver = {
          id: receiverId,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        };

        //Create variables to process image file
        //Sau khi lưu file vào folder chứa bởi multer, giá trị messageVal sẽ trả về 1 đường dẫn
        let imageBuffer = await fsExtra.readFile(messageVal.path);
        let imageContentType = await messageVal.mimetype;
        let imageName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiverId,
          conversationType: MessageModel.conversationType.GROUP,
          messageType: MessageModel.messageType.IMAGE,
          sender: sender,
          receiver:receiver,
          file: {data: imageBuffer, contentType: imageContentType, fileName: imageName},
          createdAt: Date.now()
        };

        //Create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);      

        //Update group chat
        await ChatGroupModel.updateWhenHasNewMessage(receiverId, getChatGroupReceiver.messageAmount + 1);

        resolve(newMessageItem);
      }
      else {
        let getChatUserReceiver = UserModel.getNormalUserDataById(receiverId);
        if (!getChatUserReceiver) {
          reject(transError.conversation_not_founded);
        }

        let receiver = {
          id: getChatUserReceiver._id,
          name: getChatUserReceiver.username,
          avatar: getChatUserReceiver.avatar
        };

        let imageBuffer = await fsExtra.readFile(messageVal.path);
        let imageContentType = await messageVal.mimetype;
        let imageName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiverId,
          conversationType: MessageModel.conversationType.PERSONAL,
          messageType: MessageModel.messageType.IMAGE,
          sender: sender,
          receiver:receiver,
          file: {data: imageBuffer, contentType: imageContentType, fileName: imageName},
          createdAt: Date.now()
        };
        //Create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);

        //Update contact
        await ContactModel.updateWhenHasNewMessage(sender.id, getChatUserReceiver._id);

        resolve(newMessageItem);

      }
    } catch (error) {
      reject(error);
    }
  })
}
module.exports = {
  getAllConversationItems: getAllConversationItems,
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage
}