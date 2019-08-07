import express from "express"
// const express = require('express');
const app = express();

var port = 3000;
var hostname = "localhost";

app.get('/helloworld', (req,res) => {
  res.send('<h1> Hello World </h1>');
});

app.listen(port, hostname, () => {
  console.log(`Hello Manh Cuong at : ${hostname} : ${port}`);
})