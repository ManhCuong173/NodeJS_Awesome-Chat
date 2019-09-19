import {validationResult} from 'express-validator/check'
import { message } from '../service';

let addNewTextEmoji = async (req,res) => {
  let errorsArr = [];
  let validationErrors = validationResult(req);

  if(!validationErrors.isEmpty()){
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(element => {
      errorsArr.push(element.msg);
    });
    /**
     * Flash is middleware use for attaching req and rendering to client by jade engine
     */
    return res.status(500).send(errorsArr);
  };

  try {
    let sender = {
      id : req.user._id,
      name: req.user.username,
      avatar: req.user.avatar
    };

    //Get data from post method
    let receiverId = req.body.uid;
    let messageVal = req.body.messageVal;
    let isChatGroup = req.body.isChatGroup;

    //Create new message send to database
    let newMessage = await message.addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);

    return res.status(200).send({message: newMessage});
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  addNewTextEmoji: addNewTextEmoji
}