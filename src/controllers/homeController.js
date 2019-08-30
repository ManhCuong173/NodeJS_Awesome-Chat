import {notification} from '../service/index'

let homeController = async (req,res) => {
  let errors= [];
  let notifications = null ;
  let countNotifUnread = null;
  try {
    //Take notifications from database by req.user._id only 10 items 
    notifications = await notification.getNotifications(req.user._id,10);

    //Get amount notifications unread
    countNotifUnread = await notification.countNotifUnread(req.user._id);
  } catch (error) {
    errors.push(error);
  }   
  res.render('main/home/home',{
    errors: req.flash('errors'),
    success: req.flash('success'),
    user: req.user,
    notifications: notifications,
    errors: errors,
    countNotifUnread: countNotifUnread
  });
};

module.exports = {
  homeController:homeController
};