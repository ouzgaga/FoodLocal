const mail = require('./sendGridEmail.js');

function sendMailConfirmation(to, username, confirmationToken) {
  const confirmationLink = `https://foodlocal.ch/validationEmail/${confirmationToken}`;
  const from = {
    name: 'foodlocal',
    email: 'noreply@foodlocal.ch'
  };
  const subject = 'Confirmation de votre addresse email';
  const text = `Bonjour${username},\nMerci pour votre inscription sur foodlocal.ch. \nMerci de confirmer votre mail en cliquant sur le lien suivant: ${
    confirmationLink}\n\nVotre équipe foodlocal`;
  const html = `<h2>Bonjour ${username},</h2>`
    + `<h4>Merci pour votre inscription sur foodlocal.ch. <br/> Merci de confirmer votre mail en cliquant sur le lien suivant: <a href='${confirmationLink
    }'>${confirmationLink}</a><br/><br/>`
    + '<h4>Votre équipe foodlocal</h4>';
  mail.sendMail(to, from, subject, text, html);
}

function sendMailResetPassword(to, username, newPassword) {
  const from = {
    name: 'foodlocal',
    email: 'noreply@foodlocal.ch'
  };
  const subject = 'Nouveau mot de passe';
  const text = `Bonjour ${username},\nVotre mot de passe a été réinitialisé.\nVoici votre nouveau mot de passe : ${newPassword
  }\nMerci de le changer au plus vite!\n\nVotre équipe foodlocal`;
  const html = `<h2>Bonjour ${username},</h2>`
    + `<h4>Votre mot de passe a été réinitialisé.<br/>Voici votre nouveau mot de passe : ${newPassword
    }<br/> Merci de le changer au plus vite!<br/><br/>Votre équipe foodlocal</h4>`;
  mail.sendMail(to, from, subject, text, html);
}

module.exports = {
  sendMailConfirmation,
  sendMailResetPassword
};
