import UserModel from '../models/userModel'
import { transError } from '../../lang/vi';
import bcrypt from 'bcrypt'

const saltRounds = 7;

/**
 * @param {userid} id
 *@param {data update} item 
 */

let updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
}

/**
 * 
 * @param {userid} id 
 * @param {data update} item 
 */
let updatePassword = (id, dataUpdated) => {
  return new Promise(async (resolve, reject)=>{
    let currentUser = await UserModel.findUserById(id);

    if(!currentUser) {
      return reject(transError.account_undefined);
    }

    let checkCurrentPassword = await currentUser.comparePassword(dataUpdated.currentPassword);
    if(!checkCurrentPassword){
      return reject(transError.user_current_password_failed);
    }

    let salt = bcrypt.genSaltSync(saltRounds);
    await UserModel.updatePassword(id, bcrypt.hashSync(dataUpdated.newPassword, salt));
    resolve(true);
  })
};
module.exports = {
  updateUser: updateUser,
  updatePassword: updatePassword
};