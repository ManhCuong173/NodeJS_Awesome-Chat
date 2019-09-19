import mongoose from 'mongoose'

let  Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: {type: String, default: false},
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: Date.now},
  deletedAt: {type: Number, default: Date.now},
});

//Create constructor function for creating new document
ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  }
  ,
  /**
   * Find all items that related with user 
   * @param {string} userId 
   */
  findAllByUser(userId) {
      return this.find({
        $or: [
          {"userId": userId},
          {"contactId": userId}
        ]
      }).exec();
    },

  /**
   * Check exists of 2 users
   * 
   */

  checkExist(userId, contactId){
     return this.findOne(
      {$or:[
          {$and: [
            {"userId" : userId},
            {"contactId": contactId}
            ]},
          {$and: [
            {"contactId": userId},
            {"userId": contactId}
            ]}
          ] 
      })
   },

  /**
   * 
   * @param {string} userId 
   * @param {string} contactId 
   */
  removeRequestContactSent(userId, contactId) {
      return this.remove({
        $and: [
          {"userId": userId},
          {"contactId": contactId},
          {"status": false}
        ]}
      ).exec();
    },

  removeRequestContactReceived(userId, contactId) {
      return this.remove({
        $and: [
          {"userId": contactId},
          {"contactId": userId},
          {"status": false}
        ]}
      ).exec();
    },
    /**
     * Approve contact
     * @param {string} userId 
     * @param {string} contactId 
     */
  approveRequestContactReceived(userId, contactId) {
      return this.update({
        $and: [
          {"userId": contactId},
          {"contactId": userId},
          {"status": false}
        ]},
        {"status": true,
        "updatedAt": Date.now()
        }
      ).exec();
    },
  /**
   * Remove Contact
   * @param {string} userId 
   * @param {string} contactId 
   */
  removeContact(userId, contactId) {
    return this.remove({
      $or:[
        {$and:[
          {"userId": contactId},
          {"contactId": userId}
        ]},
        {$and:[
          {"userId": userId},
          {"contactId": contactId}
        ]}
      ],
      "status": true}
      ).exec();
    },
  /**
   * add contact by user id and limit
   * @param {stringm} userId 
   * @param {number} limit 
   */
  getContacts(userId, limit) {
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"updatedAt": -1}).limit(limit).exec();
  },

  getContactsSent(userId, limit) {
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();
  },

  getContactsReceived(userId, limit) {
    return this.find({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();
  },

  countAllContacts(userId) {
    return this.count({
      $and: [
        {$or:[
          {"userId":userId},
          {"contactId":userId}
        ]},
        {"status":true}
      ]
    }).exec();
  },
  countAllContactsSent(userId) {
    return this.count({
      $and: [
        {"userId": userId},
        {"status": false}
      ]}).exec();
  },
  countAllContactsReceived(userId) {
    return this.count({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]}).exec();
  },

  readMoreContacts(userId, skip, limit) {
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"updatedAt": -1}).skip(skip).limit(limit).exec();
  },

  readMoreContactsSent(userId, skip, limit) {
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  },

  readMoreContactsReceived(userId, skip, limit) {
    return this.find({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  },

  /**
   *Update contact {chat personal} when has new message 
   * @param {string} userId 
   * @param {string} contactId 
   */
  updateWhenHasNewMessage(userId, contactId) {
    return this.update(
      {$or:[
        {$and: [
          {"userId" : userId},
          {"contactId": contactId}
          ]},
        {$and: [
          {"contactId": userId},
          {"userId": contactId}
          ]}
        ] 
      },{"updatedAt": Date.now()
    }).exec();
  }
  
}

module.exports = mongoose.model("contact", ContactSchema);
