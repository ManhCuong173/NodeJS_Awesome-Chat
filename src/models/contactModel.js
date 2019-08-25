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
  findAllByUser(userId){
    return this.find({
      $or: [
        {'userId': userId},
        {'contactId': userId}
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
  }
  
}

module.exports = mongoose.model("contact", ContactSchema);