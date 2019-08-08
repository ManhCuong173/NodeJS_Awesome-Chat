import mongoose from 'mongoose'

let  Schema = mongoose.Schema;

let MessageSchema = new Schema({
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: Date.now},
  deletedAt: {type: Number, default: Date.now},
});

module.exports = mongoose.model("message", MessageSchema);