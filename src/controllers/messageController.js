import { validationResult } from 'express-validator/check'
import { message } from '../service';
import { app } from './../config/app'
import { transError, transSuccess } from '../../lang/vi'
import multer from 'multer'
import fsExtra from 'fs-extra'

let addNewTextEmoji = async (req, res) => {
  let errorsArr = [];
  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
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
      id: req.user._id,
      name: req.user.username,
      avatar: req.user.avatar
    };

    //Get data from post method
    let receiverId = req.body.uid;
    let messageVal = req.body.messageVal;
    let isChatGroup = req.body.isChatGroup;

    //Create new message send to database
    let newMessage = await message.addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);

    return res.status(200).send({ message: newMessage });
  } catch (error) {
    return res.status(500).send(error);
  }
}

let storageImageChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.image_message_directory);
  },
  filename: (req, file, callback) => {
    let math = app.image_type;
    if (math.indexOf(file.mimetype) === -1) {
      return callback(transError.image_message_type, null);
    };

    let imageName = file.originalname;
    callback(null, imageName);
  }
});

let imageMessageUploadFile = multer({
  storage: storageImageChat,
  limits: { fileSize: app.image_limit_size }
}).single('my-image-chat');


let addNewImage = (req, res) => {

  imageMessageUploadFile(req, res, async (error) => {
    if (error) {
      //If has the property error.message, multer always return size file error 
      if (error.message) {
        return res.status(500).send(transError.image_message_size);
      }
      return res.status(500).send(error);
    }

    try {
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar
      };

      //Get data from post method
      let receiverId = req.body.uid;
      let messageVal = req.file
      let isChatGroup = req.body.isChatGroup;

      //Create new message send to database
      let newMessage = await message.addNewImage(sender, receiverId, messageVal, isChatGroup);

      //Remove Image in folder images becasue image is save into MongoDB
      await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`);

      return res.status(200).send({ message: newMessage });
    } catch (error) {
      return res.status(500).send(error);
    }
  })


}
module.exports = {
  addNewTextEmoji: addNewTextEmoji,
  addNewImage : addNewImage
}