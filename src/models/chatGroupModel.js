import mongoose from 'mongoose'

let  Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
  name: String,
  userAmount: {type: Number, min: 3, max: 177},
  messageAmount: {type: Number, default: 0},
  userId: String,
  members: [
    {userId: String}
  ],
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: Date.now},
  deletedAt: {type: Number, default: null},
});

ChatGroupSchema.statics = {
  getChatGroups(userId, limit) {
    return this.find({
      "members": {$elemMatch: {"userId": userId}}
    }).sort({'updatedAt': -1}).limit(limit).exec();
  },

  getChatGroupById(receiverId) {
    return this.findById(receiverId).exec();
  },
  /**
   * 
   * @param {string} receiverId 
   * @param {number} messageAmout 
   */
  updateWhenHasNewMessage(receiverId, messageAmout) {
    return this.findByIdAndUpdate(receiverId, {"messageAmount": messageAmout,"updatedAt": Date.now()
  }).exec();
  }
}

module.exports = mongoose.model("chat-groups", ChatGroupSchema);