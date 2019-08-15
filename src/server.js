import express from "express"
import ConnectDB from "./config/connectDB"
import ViewEngine from "./config/viewEngine"
import bodyParser from 'body-parser'
import ContactModel from './models/contactModel'
import dotenv from 'dotenv'
import api from './routes/api'
import connectFlash from 'connect-flash'
import configSession from './config/session'
import passport from 'passport'
import pem from 'pem'
import https from 'https'

// pem.config({
//   pathOpenSSL: 'usr/local/bin/openssl'
// });
// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err
//   }
//   // const express = require('express');
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

// const express = require('express');
const app = express();

//Use Environment Variables
dotenv.config();

//Connect to MongoDB
ConnectDB();

//Config session
configSession(app);

//View Engine 
ViewEngine(app);

//Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

//Using connect flash
app.use(connectFlash());

//Config passport js
app.use(passport.initialize());
app.use(passport.session());

//Call API
api(app);

//Use Environment Variables
dotenv.config();



app.listen(process.env.APP_PORT, process.env.APP_HOSTNAME, () => {
  console.log(`Hello Manh Cuong at : ${process.env.APP_HOSTNAME} : ${process.env.APP_PORT}`);
});