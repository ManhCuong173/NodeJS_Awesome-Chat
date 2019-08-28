import session from 'express-session'
import connectMongo from 'connect-mongo'

let MongoStore = connectMongo(session);
/**
 * This variable is where save session, in this case is mongodb
 */
let sessionStore = new MongoStore({
  url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME};`,
  autoReconnect: true,
  //Default Mode of autoRemove. Just showing for know
  // autoRemove: false
});

let config = (app) => {
  app.use(session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    resave: true,
    store: sessionStore,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000*60*30
    }
  }));
};

module.exports = {
  config : config,
  sessionStore : sessionStore
}