// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');
console.log(process.env.SENDGRID_API_KEY); // TODO: a del

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
