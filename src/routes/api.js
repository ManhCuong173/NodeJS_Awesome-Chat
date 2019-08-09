  import express from 'express'
  import {home,auth} from '../controllers/index'
  let router = express.Router(); 

/* Init app
* @param app from exactly express module
*/
let initRoutes = (app) => {

  //Router
  router.get('/', home.homeController);

  router.get('/login-register', auth.authController);

  app.use('/', router);
};

module.exports = initRoutes;