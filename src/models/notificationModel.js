import mongoose from 'mongoose'

let  Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: {type: Boolean, default: false},
  createdAt: {type: Number, default: Date.now}
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  removeRequestContactNotification(senderId, receiverId, type) {
    return this.remove({
      $and: [
        {"senderId": senderId},
        {"receiverId": receiverId},
        {"type": type}
      ]
    }).exec();
  },
  /**
   * Get by user id and limit 
   * @param {string} userId 
   * @param {number} limit 
   */
  getByUserIdAndLimit(userId, limit) {
    return this.find({
      "receiverId" : userId}).sort({"createdAt" : -1}).limit((limit)).exec();
  },
  /**
   * Count notification unread
   * @param {string} userId 
   */
  countNotifUnread(userId) {
    return this.count({
      $and: [
        {"receiverId": userId},
        {"isRead": false}
      ]
    }).exec();
  }
}

const NOTIFICATION_TYPES = {
  ADD_CONTACT: "add_contact",
};

const NOTIFICATION_CONTENTS = {
  getContent: (notificationType, isRead, userId, userName, userAvatar) => {
    if(notificationType === NOTIFICATION_TYPES.ADD_CONTACT) { 
      if(!isRead) {
        return `<div class='notif_readed_false' data-uid="${ userId }">
        <img class="avatar-small" src="images/users/${ userAvatar }" alt=""> 
        <strong>${ userName }</strong> đã gửi cho bạn một lời mời kết bạn!
        </div>`;
      }

      return `<div data-uid="${ userId }">
      <img class="avatar-small" src="images/users/${ userAvatar }" alt=""> 
      <strong>${ userName }</strong> đã gửi cho bạn một lời mời kết bạn!
      </div>`;
    }

    return "No matching with any notification type!"
  }
}

module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIFICATION_TYPES,
  contents: NOTIFICATION_CONTENTS
}
