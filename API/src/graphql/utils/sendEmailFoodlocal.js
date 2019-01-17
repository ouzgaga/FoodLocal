const mail = require('./sendGridEmail.js');

function sendMailConfirmation(emailTo, firstname, lastname, token) {
  const confirmationLink = `https://foodlocal.ch/validationEmail/${token}`;
  const from = {
    name: 'foodlocal',
    email: 'noreply@foodlocal.ch'
  };
  const subject = 'Confirmation de votre addresse email';
  const text = `Bonjour ${firstname} ${lastname},\n
  Merci pour votre inscription sur foodlocal.ch. \n
  Pour la finaliser, veuillez cliquer sur le lien suivant afin de confirmer votre adresse email : ${confirmationLink}
  
  \n\nVotre équipe FoodLocal`;

  const html = `<h2>Bonjour ${firstname} ${lastname},</h2>`
               + '<h4>Merci pour votre inscription sur foodlocal.ch.<h4><br/>'
               + `Pour la finaliser, veuillez cliquer sur le lien suivant afin de confirmer votre adresse email : <a href='${confirmationLink}'> ${confirmationLink}</a> <br/><br/>`
               + '<h4>Votre équipe foodlocal</h4>';
  mail.sendMail(emailTo, from, subject, text, html);
}

function sendMailResetPassword(emailTo, firstname, lastname, newPassword) {
  const from = {
    name: 'foodlocal',
    email: 'noreply@foodlocal.ch'
  };
  const subject = 'Nouveau mot de passe';
  const text = `Bonjour ${firstname} ${lastname},\n
  Votre mot de passe a été réinitialisé.\n
  Voici votre nouveau mot de passe : ${newPassword}\n
  Merci de le changer au plus vite!\n\n
  
  Votre équipe foodlocal`;

  const html = `<h2>Bonjour ${firstname} ${lastname},</h2>`
               + '<h4>Votre mot de passe a été réinitialisé'
               + `<br/>Voici votre nouveau mot de passe : ${newPassword}<br/>`
               + 'Merci de le changer au plus vite!'

               + '<br/><br/>Votre équipe foodlocal</h4>';

  mail.sendMail(emailTo, from, subject, text, html);
}

module.exports = {
  sendMailConfirmation,
  sendMailResetPassword
};
