const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs/promises');
const config = require('../../../configs/others/mailers/stockAlert');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const loadTemplate = async (templateName, data) => {
  const templatePath = path.join(__dirname, '../mail', templateName);
  let html = await fs.readFile(templatePath, 'utf-8');

  Object.entries(data).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });

  return html;
};

const sendLowStockEmail = async ({ productName, remainingQuantity, admins }) => {
    const html = await loadTemplate('lowStockAlert.html', {
        productName,
        remainingQuantity,
        threshold: config.lowStockThreshold,
        date: new Date().toLocaleString()
    });

    const emails = admins.map(admin => admin.email);

    await transporter.sendMail({
        from: `"Sistema de Estoque" <${process.env.EMAIL_USER}>`,
        to: emails.join(', '),
        subject: `Alerta: Estoque baixo para ${productName}`,
        html
    });
};

module.exports = { sendLowStockEmail };
