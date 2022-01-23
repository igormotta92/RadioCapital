//https://www.youtube.com/watch?v=Zwdv9RllPqU&t=333s

const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars'); //Substituir váriaveis HTML no node (Temples)

const transport = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSOWORD
  },
  from : "igor.mottta@gmail.com",
});

transport.use('compile', hbs({
  viewEngine: {
    defaultLayout: undefined,
    partialsDir: path.resolve('./src/resources/mail/')
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.html',
}));

module.exports = transport;
