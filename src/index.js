import express from "express"
import ConnectDB from './config/connectDB'
import ContactModel from './models/contact.model'
import dotenv from 'dotenv'
// const express = require('express');
const app = express();
//Connect to MongoDB
ConnectDB();
//Use Environment Variables
dotenv.config();

app.get('/testdb', async (req,res) => {
  try {
    let item = {
      userId : "1528662",
      contactId : "56546464"
    };
    let contact = await ContactModel.createNew(item);
    res.send(contact);
  } catch (err) {
    console.log(err);
  };
});

app.listen(process.env.APP_PORT, process.env.APP_HOSTNAME, () => {
  console.log(`Hello Manh Cuong at : ${process.env.APP_HOSTNAME} : ${process.env.APP_PORT}`);
})