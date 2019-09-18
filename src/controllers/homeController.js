import {notification, contact, message} from '../service/index'
import { bufferToBase64, lastItemOfArray, convertTimestamptoHumenstamp } from './../helpers/clientHelper'


let homeController = async (req,res) => {
  let errors = [];
  try {
    errors = [];
    //Take notifications from database by req.user._id only 10 items 
    let notifications = await notification.getNotifications(req.user._id);

    //Get amount notifications unread
    let countNotifUnread = await notification.countNotifUnread(req.user._id);
    
    //get 10 contacts on time
    let  contacts = await contact.getContacts(req.user._id)
    //get contacts send(10 item one time)
    let  contactsSent = await contact.getContactsSent(req.user._id)
    //get contacts receive(10 item one time)
    let  contactsReceived = await contact.getContactsReceived(req.user._id)

     //count all contacts
    let countAllContacts = await contact.countAllContacts(req.user._id);
    let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
    let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

    let getAllConversationItems = await message.getAllConversationItems(req.user._id);
    let allConversations = getAllConversationItems.allConversations;
    let userConversations = getAllConversationItems.userConversations;
    let groupConversations = getAllConversationItems.groupConversations;

    //all messages with conversations, max 30 items
    let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;
    
     res.render('main/home/home',{
      errors: req.flash('errors'),
      success: req.flash('success'),
      user: req.user,
      notifications: notifications,
      errors: errors,
      countNotifUnread: countNotifUnread,
      contacts: contacts,
      contactsSent: contactsSent,
      contactsReceived: contactsReceived,
      countAllContacts: countAllContacts,
      countAllContactsSent: countAllContactsSent,
      countAllContactsReceived: countAllContactsReceived,
      allConversationWithMessages: allConversationWithMessages,
      bufferToBase64: bufferToBase64,
      lastItemOfArray: lastItemOfArray,
      convertTimestamptoHumenstamp: convertTimestamptoHumenstamp
    });
  } catch (error) {
    errors.push(error);
  }  
};

module.exports = {
  homeController:homeController
};