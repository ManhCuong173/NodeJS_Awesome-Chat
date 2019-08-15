  import express from 'express';
  import {home,auth} from '../controllers/index';
  import {authValid} from '../validation/index';
  import initPassport from '../controllers/passportController/local'
  import initPassportFacebook from '../controllers/passportController/facebook'
  import initPassportLocal from '../controllers/passportController/local'
  import passport from 'passport'
  //Init passportlocal
  initPassportLocal();

  //Init passportfacebook
  initPassport();
  initPassportFacebook();

  let router = express.Router(); 

/* Init app
* @param app from exactly express module
*/
let initRoutes = (app) => {

  //Router
  router.get('/',auth.checkLoggin,home.homeController);
  router.get('/login-register',auth.checkLogout, auth.getLoginRegister);
  router.post("/register", authValid.register,auth.postRegister);
  router.get("/verify/:token",auth.checkLogout, auth.verifyAccount);
  router.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login-register',
    successFlash: true,
    failureFlash: true
  }));
  router.get('/logout', auth.getLogout);
  router.get("/auth/facebook", passport.authenticate('facebook',{scope: ['email']}));
  router.get('/auth/facebook/callback', passport.authenticate('facebook',{
    successRedirect: '/',
    failureRedirect: '/login-register'
  }));
  app.use('/', router);
};

module.exports = initRoutes;