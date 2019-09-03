import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

let  Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  gender: {type: String, default: "male"},
  phone: {type: String, default: null},
  address: {type: String, default: null},
  avatar: {type: String, default: "avatar-default.jpg"},
  role: {type: String, default: "user"},
  local: {
    email: {type: String, trim: true},
    password: String,
    isActive: {type: Boolean, default: false},
    verifyToken: String
  },
  facebook: {
    uid: String,
    token: String,
    email: {type: String, trim: true}
  },
  google: {
    uid: String,
    token: String,
    email: {type: String, trim: true}
  },
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: Date.now},
  deletedAt: {type: Number, default: Date.now},
});

UserSchema.statics = {
  createNew(item) {
    return this.create(item)
  },

  findByEmail(email){
    return this.findOne({"local.email":email}).exec();
  },

  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },

  verify(token) {
    return this.findOneAndUpdate(
      {"local.verifyToken":token},
      {"local.isActive":true,"local.verifyToken":null}
    ).exec();
  },

  findByToken(token) {
    return this.findOne({"local.verifyToken": token}).exec(); 
  },

  findUserById(id) {
    return this.findById(id).exec();
  },

  findByFacebookId(id) {
    return this.findOne({'facebook.uid': id}).exec();
  },

  updateUser(id, item) {
    return this.findByIdAndUpdate(id, item).exec();
  },

  updatePassword(id, hashedPassword) {
    return this.findByIdAndUpdate(id, {"local.password": hashedPassword}).exec();
  },

  /**
   * @param {array: deprecated userIds} deprecatedUserIds
   * @param {string: keyword search} keyword
   */
  findAllForAddContact(deprecatedUserIds, keyword) {
    return this.find({
      $and: [
        {"_id": {$nin: deprecatedUserIds}},
        {"local.isActive": true},
        {$or: [
          {"username": {"$regex": new RegExp(keyword, "i")}},
          {"local.email": {"$regex": new RegExp(keyword, "i")}},
          {"facebook.email": {"$regex": new RegExp(keyword, "i")}},
          {"google.email": {"$regex": new RegExp(keyword, "i")}}
        ]}
      ]
    },{_id: 1, username: 1,address: 1, avatar: 1}).exec();
  }
};

UserSchema.methods = {
  comparePassword(password){
    return bcrypt.compare(password, this.local.password);
  }
}
module.exports = mongoose.model("user", UserSchema);