import passport from 'passport'
import passportLocal from 'passport-local'
import UserModel from '../../models/userModel'
import {transError, transSuccess} from '../../../lang/vi'
let LocalStrategy = passportLocal.Strategy;

/**
 * Valid user account type: local
 */

let initPassportLocal = () => {
  passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true
  },async(req,email,password,done) => {
    try {
      let user = await UserModel.findByEmail(email);
      if(!user) return done(null,false,transError.login_failed);
      if(!user.local.isActive) return done(null,false,req.flash('errors',transError.account_not_active));

      let checkPassword = await user.comparePassword(password);
      if(!checkPassword) return done(null, false, req.flash('errors', transError.login_failed));
      return done(null,user,req.flash('success', transSuccess.login_success(user.username)));

    } catch (error) {
      console.log(error);

      //When errors from user don't happen. It's exactly from server's error
      return done(null, false, req.flash('errors', transError.server_error));      
    }
  }));

  //Save userid to session
  passport.serializeUser((user,done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done)=> {
        try {
          let user = await UserModel.findUserById(id);
          return done(null, user);
        } catch (error) {
          return done(false, null);
        }
  });
 }

 module.exports = initPassportLocal;