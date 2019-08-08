import mongoose from 'mongoose';
import bluebird from 'bluebird';
import dotenv from 'dotenv';

dotenv.config();
let connectDB = () => {
  mongoose.Promise = bluebird;
  // Create url string to conenct mongodb database in specific port
  let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME};` ;

  return mongoose.connect(URI, {useMongoClient: true});
};
module.exports = connectDB;