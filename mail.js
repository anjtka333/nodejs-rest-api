const nodemailer = require("nodemailer");
require("dotenv").config();

const config = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "spercorep@gmail.com",
    pass: process.env.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

module.exports = transporter;
