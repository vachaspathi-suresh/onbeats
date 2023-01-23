const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.ZOHO_USER_MAIL,
    pass: process.env.ZOHO_APP_PASSWORD,
  },
});

module.exports = transporter;
