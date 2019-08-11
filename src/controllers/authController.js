import {validationResult} from 'express-validator/check';
import {auth} from '../service/index';

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
    var newuser = await auth.register(req.body.email,req.body.gender,req.body.password);
    successArr.push("Thành công");
    req.flash("success", successArr);
    return res.redirect('/login-register');
  } catch (error) {
    errorsArr.push(error);
    req.flash('errors', errorsArr);
    return res.redirect('/login-register');
  }
  
}
module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister
};