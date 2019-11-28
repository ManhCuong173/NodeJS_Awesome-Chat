import passport from 'passport'
import passportLocal from 'passport-local'
import UserModel from '../../models/userModel'
import ChatGroupModel from '../../models/chatGroupModel'
import { transError, transSuccess } from '../../../lang/vi'
let LocalStrategy = passportLocal.Strategy;

/**
 * Valid user account type: local
 */

let initPassportLocal = () => {
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      let user = await UserModel.findByEmail(email);
      if (!user) return done(null, false, transError.login_failed);
      if (!user.local.isActive) return done(null, false, req.flash('errors', transError.account_not_active));

      let checkPassword = await user.comparePassword(password);
      if (!checkPassword) return done(null, false, req.flash('errors', transError.login_failed));
      return done(null, user, req.flash('success', transSuccess.login_success(user.username)));

    } catch (error) {
      //When errors from user don't happen. It's exactly from server's error
      return done(null, false, req.flash('errors', transError.server_error));
    }
  }));

  //Save userid to session
  passport.serializeUser((user, done) => {
    //add userId into session request
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      //After req has an id attach, we will have req.id so that we can eventually find user by get user info in database
      let user = await UserModel.findUserByIdForSessionToUse(id);
      let getChatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);
      user = user.toObject();
      user.chatGroupIds = getChatGroupIds;
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  });
}

module.exports = initPassportLocal;