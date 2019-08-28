import passportSocketIo from 'passport.socketio'
import cookieParser from 'cookie-parser'
import session from '../config/session'

let configSocketIo = (io) => {
  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    //Cặp key và secret này phải trùng với cặp key và secrect nằm trong sessionjs
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: session.sessionStore,
    success: (data, accept) => {
      if(!data.user.logged_in) {
        return accept("Invalid user", false);
      }
      return accept(null, true);
    },
    fail: (data, message, error, accept) => {
      if(error) {
        console.log('Failed connection to socket.io', message);
        return accept(new Error(message), false);
      }
    }
  }));
}

module.exports = configSocketIo;