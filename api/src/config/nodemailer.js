const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const {
  INTERNAL_EMAIL_SERVICE,
  INTERNAL_TRANSPORT_HOST,
  INTERNAL_TRANSPORT_PORT,
  SENDGRID_API_KEY,
} = process.env;

let transporter;

if (INTERNAL_EMAIL_SERVICE) {
  transporter = nodemailer.createTransport({
    host: INTERNAL_TRANSPORT_HOST,
    port: INTERNAL_TRANSPORT_PORT,
    secure: false,
    auth: {},
    tls: { rejectUnauthorized: false },
  });
} else {
  transporter = nodemailer.createTransport(nodemailerSendgrid({ apiKey: SENDGRID_API_KEY }));
}

module.exports = transporter;
