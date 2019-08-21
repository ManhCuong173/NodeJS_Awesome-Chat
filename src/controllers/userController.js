import multer from 'multer'
import {app} from './../config/app'
import {transError, transSuccess} from '../../lang/vi'
import uuidv4 from 'uuid/v4'
import {user} from '../service/index'
import fsExtra from 'fs-extra'
import {validationResult} from 'express-validator/check'

let storageAvatar = multer.diskStorage({
  destination: (req,file,callback) => {
    callback(null,app.avatar_directory);
  },
  filename: (req,file,callback) => {
    let math = app.avatar_type;
    if(math.indexOf(file.mimetype) === -1) {
      callback(transError.avatar_type, null);
    }
    /**
     *Sẽ có những trường hợp user sẽ send 2 tấm ảnh có cùng tên server, sẽ có 2 cách để xử lý truòng8 hợp này
        Cách 1: Dùng phương thức timestamp để xác định thời gian gửi của user, nó sẽ tính theo milisecond
        Cách 2: Để đảm bảo trường hợp user click 2 tấm ảnh cùng 1 lúc (milisecond bằng nhau nhưng rất hiếm xảy ra
        trường hợp đó, nhưng đời mà, sao biết được thiên hạ :> ) ==> Chúng ta sử dụng module uuidv4 kết hợp với 
        timestamp
     *  */
    let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    callback(null, avatarName);
  }
});

let avatarUploadFile = multer({
  storage: storageAvatar,
  limits: {fileSize: app.avatar_limit_size}
}).single('avatar');

let updateAvatar = (req, res) => {
  avatarUploadFile(req, res, async function(err) {
    if(err) {
      //Xử lý kích thước ảnh là 1 trong những lỗi multer chưa triển, chúng ta phải tự làm thủ công nó
      //Nếu property message của error xuất hiện (là cái mà multer chưa giúp ta display ) thì in lỗi đó ra
      if(err.message) {
        return res.status(500).send(transError.avatar_size);
      }
      //Không có lỗi đặc biệt nào multer chưa tiền xử lý dùm dev thì chúng ta in những regular error
      return res.status(500).send(err);
    }
    try {
      let updateUserItem = {
        avatar: req.file.filename,
        updateAt: Date.now()
      };

      let userUpdate = await user.updateUser(req.user._id, updateUserItem);
      
      //Remove old user avatar
      await fsExtra.remove(`${app.avatar_directory}\\${userUpdate.avatar}`);

      let result = {
        message: transSuccess.user_info_updated,
        imageSrc: `/images/users/${req.file.filename}`
      }

      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send(error);
    }
  });
}

let updateInfo = async (req, res) => {
  let errorsArr = [];
  let validationErrors = validationResult(req);
  //IF
  if(!validationErrors.isEmpty()){
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(element => {
      errorsArr.push(element.msg);
    });
    /**
     * Flash is middleware use for attaching req and rendering to client by jade engine
     */
    return res.status(500).send(errorsArr);
  }
  //ELSE
  try {
    let updateUserItem = req.body;
    await user.updateUser(req.user._id, updateUserItem);

    let result = {
      message: transSuccess.user_info_updated
    }
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
module.exports = {
  updateAvatar: updateAvatar,
  updateInfo: updateInfo
};