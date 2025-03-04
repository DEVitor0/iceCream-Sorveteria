const nodemailer = require('nodemailer');

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

// Function to send the 2FA code via email
function sendTwoFACodeEmail(email, code) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'vitormoreira6940@gmail.com',
        subject: 'Your 2FA Code',
        text: `Your 2FA code is: ${code}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = sendTwoFACodeEmail;
