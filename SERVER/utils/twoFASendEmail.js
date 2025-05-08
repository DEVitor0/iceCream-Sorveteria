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
        rejectUnauthorized: false
    }
});

function sendTwoFACodeEmail(email, codigoVerificacao) {
    return new Promise((resolve, reject) => {
        const emailTemplatePath = path.join(__dirname, '../mail/email.html');

        fs.readFile(emailTemplatePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Erro ao ler o template do e-mail:', err);
                return reject(err);
            }

            const emailBody = data
                .replace(/{{nomeCliente}}/g, email)
                .replace(/{{codigoVerificacao}}/g, codigoVerificacao);

            const mailOptions = {
                from: `"Ice Cream Sorveteria" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Código de autenticação da Ice Cream Sorveteria 🍦',
                html: emailBody,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Erro ao enviar o e-mail:', error);
                    reject(error);
                } else {
                    console.log('E-mail enviado:', info.response);
                    resolve(info);
                }
            });
        });
    });
}

module.exports = sendTwoFACodeEmail;
