import {notification, contact} from '../service/index'

let homeController = async (req,res) => {
  let errors= [];
  let notifications = null ;
  let countNotifUnread = null;
  let countAllContacts = 0;
  let countAllContactsSent = 0;
  let countAllContactsReceived = 0;
  let contacts = [];
  let contactsSent = [];
  let contactsReceived = [];
  try {
    //Take notifications from database by req.user._id only 10 items 
    notifications = await notification.getNotifications(req.user._id);

    //Get amount notifications unread
    countNotifUnread = await notification.countNotifUnread(req.user._id);
    
    //get 10 contacts on time
     contacts = await contact.getContacts(req.user._id)
    //get contacts send(10 item one time)
     contactsSent = await contact.getContactsSent(req.user._id)
    //get contacts receive(10 item one time)
     contactsReceived = await contact.getContactsReceived(req.user._id)

     //count all contacts
     countAllContacts = await contact.countAllContacts(req.user._id);
     countAllContactsSent = await contact.countAllContactsSent(req.user._id);
     countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);
  } catch (error) {
    errors.push(error);
  }  
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
    countAllContactsReceived: countAllContactsReceived
  });
};

module.exports = {
  homeController:homeController
};