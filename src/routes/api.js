  import express from 'express';
  import {home,auth} from '../controllers/index';
  import {authValid} from '../validation/index';
  let router = express.Router(); 

/* Init app
* @param app from exactly express module
*/
let initRoutes = (app) => {

  //Router
  router.get('/', home.homeController);
  router.get('/login-register', auth.getLoginRegister);
  router.post("/register", authValid.register,auth.postRegister);
  router.get("/verify/:token", auth.verifyAccount);
  app.use('/', router);
};

module.exports = initRoutes;