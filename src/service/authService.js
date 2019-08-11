import UserModel from '../models/userModel';
import bcrypt from 'bcrypt';
import uuidv4 from 'uuid';
import {transError} from '../../lang/vi'
import uuidv4 from 'uuid'
let saltRounds = 7;

let register =  (email,gender,password) => {
  return new Promise(async (resolve,reject) => {
    let checkuserByEmail = await UserModel.findByEmail(email);
    if(checkuserByEmail){
      return reject(transError.account_in_use);
    };

    let salt = bcrypt.genSaltSync(saltRounds);

    let userItem = {
      username: email.split("@")[0],
      gender: gender,
      local: {
        email: email,
        password: bcrypt.hashSync(password, salt),
        verifyToken:  uuidv4()
      }
    };

    let user = await UserModel.create(userItem);
    return resolve(user);
  });  

let saltRounds = 7;

let register = async (email,gender,password) => {

  let salt = bcrypt.genSaltSync(saltRounds);

  let userItem = {
    username: email.split("@")[0],
    gender: gender,
    local: {
      email: email,
      password: bcrypt.hashSync(password, salt),
      verifyToken:  uuidv4()
    }
  };

  let user = await UserModel.create(userItem);
};

module.exports = {
  register: register
}