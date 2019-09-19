import mongoose from 'mongoose'

let  Schema = mongoose.Schema;

let MessageSchema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    name: String,
    avatar: String
  },
  receiver: {
    id: String,
    name: String,
    avatar: String
  },
  text: String,
  file: {data: Buffer, contentType: String, fileName: String},
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: Date.now},
  deletedAt: {type: Number, default: Date.now},
});

MessageSchema.statics = {
  /**
   * 
   * @param {Object} item 
   */
  createNew(item) {
    return this.create(item);
  },
  /**
   * get limited item one time
   * @param {string} senderId //current user id 
   * @param {string} receiverId 
   * @param {strirng} limit 
   */
  getMessagesInPersonal(senderId, receiverId, limit) {
    return this.find({
      $or:[
        {$and:[
          {"senderId": senderId},
          {"receiverId": receiverId}
        ]},
        {$and:[
          {"receiverId": senderId},
          {"senderId": receiverId}
        ]}
      ]
    }).sort({"createdAt": 1}).limit(limit).exec();
  },

  getMessagesInGroup(receiverId, limit) {
    return this.find({
      "receiverId": receiverId
    }).sort({"createdAt": 1}).limit(limit).exec();
  }
}

const MESSAGE_CONVERSATION_TYPES = {
  PERSONAL: 'personal',
  GROUP: 'group'
}

const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file"
}

module.exports = {
  model: mongoose.model("message", MessageSchema),
  conversationType: MESSAGE_CONVERSATION_TYPES,
  messageType: MESSAGE_TYPES
};