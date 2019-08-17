import multer from 'multer'
import {app} from './../config/app'
import {transError} from '../../lang/vi'
import uuidv4 from 'uuid/v4'


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
  avatarUploadFile(req, res, function (err) {
    if(err) {
      if(err.message) {
        return res.status(500).send(transError.avatar_size);
      }
      return res.status(500).send(err);
    }
    try {
      let updateUserItem = {
        avatar: req.file.filename,
        updateAt: Date.now()
      };
    } catch (error) {
      
    }
  });
}
module.exports = {
  updateAvatar: updateAvatar
};