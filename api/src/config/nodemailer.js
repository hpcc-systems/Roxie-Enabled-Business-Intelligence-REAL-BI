const nodemailer = require('nodemailer');
const { TRANSPORT_HOST, TRANSPORT_PORT } = process.env;

const transporter = nodemailer.createTransport({
  host: TRANSPORT_HOST,
  port: TRANSPORT_PORT,
  secure: false,
  auth: {},
  tls: { rejectUnauthorized: false },
});

module.exports = transporter;
