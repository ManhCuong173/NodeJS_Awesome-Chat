import NotificationModel from '../models/notificationModel'
import UserModel from '../models/userModel'

/**
 *Get notifications when refresh f5 page
  Just get 10 noti on time 
 * @param {string} currentUserId 
 * @param {number} limit 
 */
let getNotifications = (currentUserId, limit) => {
  return new Promise(async (resolve, reject) => { 
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, limit);
      let getNotiContents = notifications.map(async (notification) => {
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

module.exports = {
  getNotifications: getNotifications,
  countNotifUnread: countNotifUnread
}