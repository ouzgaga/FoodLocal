// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendMail(to, from, subject, text, html) {
    const msg = {
        to: to,
        from: from,
        subject: subject,
        text: text,
        html: html,
    };
    // Sending mail
    sgMail
        .send(msg)
        .then(() => console.log("email send"))
        .catch(error => {
            console.error(error.toString());
        });
}


module.exports = {
    sendMail
};
