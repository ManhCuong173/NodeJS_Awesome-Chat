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
  removeRequestContact(userId, contactId) {
    return this.remove({
      $and: [
        {"userId": userId},
        {"contactId": contactId}
      ]}
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
    }).sort({"createdAt": -1}).limit(limit).exec();
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
    }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
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
  }
  
}

module.exports = mongoose.model("contact", ContactSchema);
