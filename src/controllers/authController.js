import {validationResult} from 'express-validator/check';

let getLoginRegister = (req,res) => {
  res.render('auth/master');
};

let postRegister = (req,res) => {
  let errorsArr = [];
  let validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()){
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(element => {
      errorsArr.push(element.msg);
    });
    console.log(errorsArr);
  }
}
module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister
};