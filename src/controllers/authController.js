import {validationResult} from 'express-validator/check';
import {auth} from '../service/index';
import {transSuccess} from '../../lang/vi'

let getLoginRegister = (req,res) => {
  return res.render('auth/master', {
    errors: req.flash("errors"),
    success: req.flash("success")
  });
};

let postRegister = async (req,res) => {
  let errorsArr = [];
  let successArr = [];
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
    req.flash("errors", errorsArr);
    return res.redirect("/login-register");
  }
  //ELSE
  try {
    //Vì phương thức register này phải xử lý bên trong đến 2 await cho nên nó cần phải dược chờ
    var newuser = await auth.register(req.body.email,req.body.gender,req.body.password,req.protocol,req.get("host"));
    successArr.push(newuser);
    req.flash("success", successArr);
    return res.redirect('/login-register');
  } catch (error) {
    errorsArr.push(error);
    req.flash('errors', errorsArr);
    return res.redirect('/login-register');
    } 
  };
  
let verifyAccount = async (req,res) => {
  let errorsArr = [];
  let successArr = [];
  try {
    let verifyAccount = await auth.verifyAccount(req.params.token);
    successArr.push(verifyAccount);
    req.flash("success", successArr);
    return res.redirect('/login-register');
  } catch (error) {
    errorsArr.push(error);
    req.flash('errors', errorsArr);
    return res.redirect('/login-register');
    } 
  };

let getLogout = (req,res) => {
  req.logout();
  req.flash('success', transSuccess.logout_success);
  res.redirect('/login-register');
}

let checkLoggin = (req,res,next) => {
  if(!req.isAuthenticated()) {
    res.redirect('/login-register');
  }
  next();
}

let checkLogout = (req,res,next) => {
  if(req.isAuthenticated()) {
    res.redirect('/');
  }
  next();
}
module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister,
  verifyAccount: verifyAccount,
  getLogout: getLogout,
  checkLoggin: checkLoggin,
  checkLogout: checkLogout
};