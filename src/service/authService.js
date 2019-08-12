import UserModel from '../models/userModel';
import bcrypt from 'bcrypt';
import uuidv4 from 'uuid';
import {transError} from '../../lang/vi';
import {transMail} from '../../lang/vi';
import {transSuccess} from '../../lang/vi';
import sendEmail from '../config/mailer';
let saltRounds = 7;

let register =  (email,gender,password,protocol,host) => {
  return new Promise(async (resolve,reject) => {
    let checkuserByEmail = await UserModel.findByEmail(email);
    //IF
    if(checkuserByEmail){
      return reject(transError.account_in_use);
    };

    //ELSE
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
    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;

    //Send email to SMTP Server Gmail for validating before send succesful annoucment to client
    sendEmail(email, transMail.subject, transMail.template(linkVerify))
    .then((success) => {
        resolve(transSuccess.userCreated(user.local.email));
      }
    )
    .catch(async (error) => {
      //If having failure, must remove email of that user's register
      await UserModel.removeById(user._id);
      reject(transMail.send_failed);  
    });
  });  
};

let verifyAccount = (token) => {
  return new Promise(async (resolve,reject)=>{
    var verify = await UserModel.verify(token);
    resolve(transSuccess.account_actived);
  });
};
module.exports = {
  register: register,
  verifyAccount: verifyAccount
}   



