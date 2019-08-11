import express from "express"
import ConnectDB from "./config/connectDB"
import ViewEngine from "./config/viewEngine"
import bodyParser from 'body-parser'
import ContactModel from './models/contactModel'
import dotenv from 'dotenv'
import api from './routes/api'
import connectFlash from 'connect-flash'
import configSession from './config/session'
// const express = require('express');
const app = express();

//Connect to MongoDB
ConnectDB();

//Config session
configSession(app);

//View Engine 
ViewEngine(app);

//Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

app.use(connectFlash());

//Call API
api(app);

//Use Environment Variables
dotenv.config();



app.listen(process.env.APP_PORT, process.env.APP_HOSTNAME, () => {
  console.log(`Hello Manh Cuong at : ${process.env.APP_HOSTNAME} : ${process.env.APP_PORT}`);
})