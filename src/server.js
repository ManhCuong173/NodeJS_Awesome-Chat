import express from "express"
import ConnectDB from "./config/connectDB"
import ViewEngine from "./config/viewEngine"
import bodyParser from 'body-parser'
import ContactModel from './models/contactModel'
import dotenv from 'dotenv'
import api from './routes/api'
import connectFlash from 'connect-flash'
import session from './config/session'
import passport from 'passport'
import pem from 'pem'
import http from 'http'
import socketio from 'socket.io'
import initSockets from './sockets/index'
import configSocketIo from './config/socketio'
import cookieParser from 'cookie-parser'
import events from 'events'
import * as configApp from './config/app'

// pem.config({
//   pathOpenSSL: 'usr/local/bin/openssl'
// });
// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err
//   }
//   const app = express();

//   //Use Environment Variables
//   dotenv.config();

//   //Connect to MongoDB
//   ConnectDB();

//   //Config session
//   configSession(app);

//   //View Engine 
//   ViewEngine(app);

//   //Enable post data for request
//   app.use(bodyParser.urlencoded({extended: true}));

//   //Using connect flash
//   app.use(connectFlash());

//   //Config passport js
//   app.use(passport.initialize());
//   app.use(passport.session());

//   //Call API
//   api(app);

//   //Use Environment Variables
//   dotenv.config();


//   https.createServer({ key: keys.serviceKey, cert: keys.certificate },app).listen(process.env.APP_PORT, process.env.APP_HOSTNAME, () => {
//       console.log(`Hello Manh Cuong at : ${process.env.APP_HOSTNAME} : ${process.env.APP_PORT}`);
//     }
// )});
const app = express();

//Set Max Listener For Socket
events.EventEmitter.defaultMaxListeners = configApp.app.max_event_listener;

let server = http.createServer(app);
let io = socketio(server);

//Use Environment Variables
dotenv.config();

//Connect to MongoDB
ConnectDB();

//Config session
session.config(app);

//View Engine 
ViewEngine(app);

//Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

//Using connect flash
app.use(connectFlash());

//User cookie parser
app.use(cookieParser());

//Config passport js
app.use(passport.initialize());
app.use(passport.session());

//Call API
api(app);

//Config socket io
configSocketIo(io);

//Init all sockets
initSockets(io);

//Use Environment Variables
dotenv.config();


server.listen(process.env.APP_PORT, process.env.APP_HOSTNAME, () => {
  console.log(`Hello Manh Cuong at : ${process.env.APP_HOSTNAME} : ${process.env.APP_PORT}`);
});