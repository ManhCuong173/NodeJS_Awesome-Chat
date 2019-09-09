import NotificationModel from '../models/notificationModel'
import UserModel from '../models/userModel'

const LIMIT_NUMBER_TAKEN = 1;
/**
 *Get notifications when refresh f5 page
  Just get 10 noti on time 
 * @param {string} currentUserId 
 * @param {number} limit 
 */
let getNotifications = (currentUserId) => {
  return new Promise(async (resolve, reject) => { 
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId,LIMIT_NUMBER_TAKEN);
      let getNotiContents = notifications.map(async (notification) => {
        //Return info of users whose send notification one by one
        let sender = await UserModel.findUserById(notification.senderId);
        return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      });
      resolve(await Promise.all(getNotiContents));
    } catch (error) {
      reject(error);
    };
    resolve()
  });
};
/**
 * Count all notification
 * @param {*} currentUserId 
 */
let countNotifUnread = (currentUserId) => {
  return new Promise(async (resolve, reject) => { 
    try {
     let notificationsUnread = await NotificationModel.model.countNotifUnread(currentUserId);
     resolve(notificationsUnread);
    } catch (error) {
      reject(error);
    };
  });
};

/**
 * Read more notificaion (max 10 items one time)
 * @param {string} currentUserId 
 * @param {number} skipNumberNotif 
 */
let readMore = (currentUserId, skipNumberNotif) => {
  return new Promise(async (resolve, reject) => { 
    try {
    let newNotifications = await NotificationModel.model.readMore(currentUserId, skipNumberNotif, LIMIT_NUMBER_TAKEN);
    let getNotiContents = newNotifications.map(async (notification) => {
      let sender = await UserModel.findUserById(notification.senderId);
      return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      });
    resolve(await Promise.all(getNotiContents));
    } 
    catch (error) {
      reject(error);
    };
  });
};
/**
 * Mark notifications as read
 * @param {string} currentUserId 
 * @param {array} targetUsers 
 */
let markAllAsRead = (currentUserId, targetUsers) => {
  return new Promise(async (resolve, reject) => { 
    try {
      await NotificationModel.model.markAllAsRead(currentUserId, targetUsers);
      resolve(true);
    } 
    catch (error) {
      console.log(`Error when mark notification as read: ${error}`);
      reject(false);
    };
  });
};
module.exports = {
  getNotifications: getNotifications,
  countNotifUnread: countNotifUnread,
  readMore: readMore,
  markAllAsRead: markAllAsRead
}