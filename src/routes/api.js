  import express from 'express';
  import {home, auth, user, contact, notification} from '../controllers/index';
  import {authValid, userValid, contactValid} from '../validation/index';
  import initPassport from '../controllers/passportController/local'
  import initPassportFacebook from '../controllers/passportController/facebook'
  import initPassportLocal from '../controllers/passportController/local'
  import passport from 'passport'
  import multer from 'multer'
  import {app} from '../config/app'

  //Init passportlocal
  initPassportLocal();

  //Init passportfacebook
  initPassport();
  initPassportFacebook();

  let router = express.Router(); 
  let upload = multer({dest: app.avatar_directory});


/* Init app
* @param app from exactly express module
*/
let initRoutes = (app) => {

  //Router
  router.get('/',auth.checkLoggin,home.homeController);
  router.get('/login-register',auth.checkLogout, auth.getLoginRegister);
  router.get("/verify/:token",auth.checkLogout, auth.verifyAccount);
  router.post("/register", authValid.register,auth.postRegister);
  router.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login-register',
    successFlash: true,
    failureFlash: true
  }));
  router.get('/logout', auth.getLogout);
  //Facebook login
  router.get("/auth/facebook", passport.authenticate('facebook',{scope: ['email']}));
  router.get('/auth/facebook/callback', passport.authenticate('facebook',{
    successRedirect: '/',
    failureRedirect: '/login-register'
  }));

  router.put('/user/update-avatar',auth.checkLoggin,user.updateAvatar);
  router.put('/user/update-info', auth.checkLoggin, userValid.updateInfo, user.updateInfo);
  router.put('/user/update-password', auth.checkLoggin, user.updatePassword);

  router.get('/contact/find-users/:keyword', auth.checkLoggin, contactValid.findUsersContact, contact.findUsersContact);
  router.post('/contact/add-new', auth.checkLoggin, contact.addNew);
  router.delete('/contact/remove-request-contact', auth.checkLoggin, contact.removeRequestContact);
  router.get('/contact/read-more-contacts', auth.checkLoggin, contact.readMoreContacts);
  router.get('/contact/read-more-contacts-sent', auth.checkLoggin, contact.readMoreContactsSent);
  router.get('/contact/read-more-contacts-received', auth.checkLoggin, contact.readMoreContactsReceived);

  router.get('/notification/read-more', auth.checkLoggin, notification.readMore);
  router.put('/notification/mark-all-as-read', auth.checkLoggin, notification.markAllAsRead);
  app.use('/', router);
};

module.exports = initRoutes;