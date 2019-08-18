import UserModel from '../models/userModel'

/**
 * @param {userid} id
 *@param {data update} item 
 */

let updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
}

module.exports = {
  updateUser: updateUser
};