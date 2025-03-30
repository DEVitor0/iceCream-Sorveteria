const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        ciphers: 'SSLv3',
    },
});

function sendTwoFACodeEmail(email, codigoVerificacao) {
    const emailTemplatePath = path.join(__dirname, '../view/email.html');

    fs.readFile(emailTemplatePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o template do e-mail:', err);
            return;
        }

        const emailBody = data
            .replace(/{{nomeCliente}}/g, email)
            .replace(/{{codigoVerificacao}}/g, codigoVerificacao);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Código de autenticação da Ice Cream Sorveteria 🍦',
            html: emailBody,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erro ao enviar o e-mail:', error);
            } else {
                console.log('E-mail enviado:', info.response);
            }
        });
    });
}

module.exports = sendTwoFACodeEmail;
