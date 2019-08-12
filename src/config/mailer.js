import nodeMailer from 'nodemailer';
import { model } from 'mongoose';

let adminEmail = process.env.MAIL_USER;
let adminPassword = process.env.MAIL_PASSWORD;
let adminHost = process.env.MAIL_HOST;
let adminPort = process.env.MAIL_PORT;

let sendEmail = (to,subject, htmlContent) => {
  let transporter = nodeMailer.createTransport({
    host: adminHost,
    port: adminPort,
    secure: false,//Use SSL_TLS //Sau này đưa lên hostname thì chuyển thành true
    auth: {
      user: adminEmail,
      pass: adminPassword
    }
  });

let options = {
  from: adminEmail,
  to: to,
  subject: subject,
  html: htmlContent
};

  return transporter.sendMail(options);// This default return a promise
};

module.exports = sendEmail;
