import {notification, contact} from '../service/index'

let homeController = async (req,res) => {
  let errors= [];
  let notifications = null ;
  let countNotifUnread = null;
  try {
    //Take notifications from database by req.user._id only 10 items 
    notifications = await notification.getNotifications(req.user._id);

    //Get amount notifications unread
    countNotifUnread = await notification.countNotifUnread(req.user._id);
    
    //get 10 contacts on time
    let contacts = await contact.getContacts(req.user._id)
    //get contacts send(10 item one time)
    let contactsSent = await contact.getContactsSent(req.user._id)
    //get contacts receive(10 item one time)
    let contactsReceived = await contact.getContactsReceived(req.user._id)
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
    contactsReceived: contactsReceived
  });
};

module.exports = {
  homeController:homeController
};