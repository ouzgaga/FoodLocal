// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendMail(to, from, subject, text, html) {
  const msg = {
    to,
    from,
    subject,
    html,
  };
  // Sending mail
  sgMail
    .send(msg)
    .then(() => console.log(`email send at ${to}`))
    .catch((error) => {
      console.error(error.toString());
    });
}


module.exports = {
  sendMail
};
