import {validationResult} from 'express-validator/check';
import {auth} from '../service/index';

let getLoginRegister = (req,res) => {
  return res.render('auth/master', {
    errors: req.flash("errors"),
    success: req.flash("success")
  });
};

let postRegister = (req,res) => {
  let errorsArr = [];
  let validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()){
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(element => {
      errorsArr.push(element.msg);
    });
    req.flash("errors", errorsArr);
    return res.redirect("/login-register");
  }
  auth.register(req.body.email,req.body.gender,req.body.password);
}
module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister
};