import ContactModel from './../models/contactModel'
import UserModel from './../models/userModel'
import ChatGroupModel from './../models/chatGroupModel'
import _ from 'lodash'

let LIMIT_CONVERSATION_TAKEN = 10;
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
          let getUserContact =  await UserModel.getNormalUserDataById(contact.userId);
          //Vì 2 dữ liệu từ 2 model này về cùng 1 kiểu dữ liệu từ mongo cho nên k cần chuyển đổi getUserContact về object để gán thêm property
          // => getUserContact.toObject(); được dùng để chuyển đổi
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
        else {
          let getUserContact =  await UserModel.getNormalUserDataById(contact.contactId);
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
      resolve({
        userConversations: userConversations,
        groupConversations: groupConversations,
        allConversations: allConversations
      });
    } catch (error) {
      reject(error);
    }
  })
};

module.exports = {
  getAllConversationItems: getAllConversationItems
}