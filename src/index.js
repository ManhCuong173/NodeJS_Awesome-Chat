import express from "express"
import ConnectDB from './config/connectDB'
import ViewEngine from './config/viewEngine'
import ContactModel from './models/contact.model'
import dotenv from 'dotenv'
// const express = require('express');
const app = express();

//Connect to MongoDB
ConnectDB();

//View Engine 
ViewEngine(app);


//Use Environment Variables
dotenv.config();

//Router
app.get('/', (req,res) => {
  res.render('main/master');
});

app.get('/login-register', (req,res) => {
  res.render('auth/logRegister');
});

app.listen(process.env.APP_PORT, process.env.APP_HOSTNAME, () => {
  console.log(`Hello Manh Cuong at : ${process.env.APP_HOSTNAME} : ${process.env.APP_PORT}`);
})