import passport from 'passport'
import passportFacebook from 'passport-facebook'
import UserModel from '../../models/userModel'
import ChatGroupModel from '../../models/chatGroupModel'
import { transError, transSuccess } from '../../../lang/vi'

let FacebookStrategy = passportFacebook.Strategy;

//Generate variables for saving into database 
let fbAppId = process.env.FB_APP_ID;
let fbAppSecret = process.env.FB_APP_SECRET;
let fbAppCallbackURL = process.env.FB_CALLBACK_URL

/**
 * Valid user account type: facebook
 */

let initPassportFacebook = () => {
  passport.use(new FacebookStrategy({
    clientID: fbAppId,
    clientSecret: fbAppSecret,
    callbackURL: fbAppCallbackURL,
    passReqToCallback: true,
    profileFields: ["email", "gender", "displayName"]
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findByFacebookId(profile.id);
      if (user) return done(null, user, req.flash('success', transSuccess.login_success(user.username)));

      let newUserItem = {
        username: profile.displayName,
        gender: profile.gender,
        local: { isActive: true },
        facebook: {
          uid: profile.id,
          token: accessToken,
          email: profile.emails[0].value
        }
      };

      let newUser = newUserItem.createNew(newUserItem);
      if (user) return done(null, newUser, req.flash('success', transSuccess.login_success(newUser.username)));
    } catch (error) {
      //When errors from user don't happen. It's exactly from server's error
      return done(null, false, req.flash('errors', transError.server_error));
    }
  }));

  //Save userid to session
  passport.serializeUser((user, done) => {
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

module.exports = initPassportFacebook;